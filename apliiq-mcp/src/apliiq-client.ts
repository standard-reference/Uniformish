/**
 * Apliiq HTTP client — HMAC signing and raw HTTP only.
 *
 * This module has ZERO MCP awareness by design (spec §3). It must stay
 * importable from a plain script, a test, a Cloudflare Worker, or an MCP tool
 * handler without any of them leaking into each other.
 */

import { createHmac, randomBytes } from "node:crypto";

export const DEFAULT_BASE_URL = "https://api.apliiq.com/v1";
const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Endpoint paths, relative to the base URL.
 *
 * ASSUMPTION — the `Artwork` path is quoted directly in the build spec
 * (`POST /v1/Artwork`). The `Product` paths follow its PascalCase singular
 * convention but were NOT read from Apliiq's docs, because the build
 * environment could not reach help.apliiq.com. Confirm both with `npm run
 * smoke` before trusting them. They are collected here so that correcting
 * them is a one-line change in one file.
 */
export const ENDPOINTS = {
  products: "Product",
  product: (id: string) => `Product/${encodeURIComponent(id)}`,
  artwork: "Artwork",
} as const;

export interface ApliiqCredentials {
  appId: string;
  sharedSecret: string;
}

export interface ApliiqConfig extends ApliiqCredentials {
  baseUrl?: string;
  timeoutMs?: number;
}

export interface SignatureParts {
  /** Request timestamp, Unix seconds, as a string. */
  rts: string;
  /** Per-request nonce. */
  state: string;
  /** base64 HMAC-SHA256 digest. */
  sig: string;
  /** The complete `Authorization` header value. */
  header: string;
}

/**
 * Build the Apliiq `Authorization` header for a single request.
 *
 * Per spec §1, the signed message is the plain concatenation
 *
 *     APPID + RTS + STATE + base64(body)
 *
 * HMAC-SHA256'd under SHARED_SECRET and base64-encoded. An empty body
 * contributes the empty string, since `base64("") === ""`.
 *
 * The resulting header is `x-apliiq-auth {RTS}:{SIG}:{APPID}:{STATE}` — note
 * that the APPID travels in the clear and only the signature is derived from
 * the secret. The secret itself is never transmitted.
 *
 * `rts` and `state` are injectable purely so tests can pin them. Production
 * callers should always let them be generated: reusing a nonce is exactly the
 * replay window the scheme exists to close.
 *
 * ASSUMPTION — this is transcribed from the build spec rather than read from
 * Apliiq's Authentication page, which the build environment could not reach.
 * If the live API returns 401 with credentials known to be good, the fault is
 * almost certainly in this function, and the likely culprits are, in order:
 * the concatenation order, whether the body is base64'd before or after being
 * included, and whether the secret is used as raw UTF-8 bytes (as here) or
 * base64-decoded first.
 */
export function signRequest(
  credentials: ApliiqCredentials,
  body = "",
  overrides: { rts?: string; state?: string } = {},
): SignatureParts {
  const rts = overrides.rts ?? Math.floor(Date.now() / 1000).toString();
  const state = overrides.state ?? randomBytes(16).toString("hex");

  const encodedBody = Buffer.from(body, "utf8").toString("base64");
  const message = `${credentials.appId}${rts}${state}${encodedBody}`;

  const sig = createHmac("sha256", credentials.sharedSecret)
    .update(message, "utf8")
    .digest("base64");

  return {
    rts,
    state,
    sig,
    header: `x-apliiq-auth ${rts}:${sig}:${credentials.appId}:${state}`,
  };
}

/** Base class so callers can catch every Apliiq failure with one clause. */
export class ApliiqError extends Error {}

/** Missing or malformed configuration — raised before any network call. */
export class ApliiqConfigError extends ApliiqError {}

/** The request never completed: DNS, TLS, timeout, egress policy. */
export class ApliiqNetworkError extends ApliiqError {}

/** The request completed with a non-2xx status. */
export class ApliiqHttpError extends ApliiqError {
  readonly status: number;
  readonly statusText: string;
  readonly method: string;
  readonly url: string;
  readonly responseBody: string;

  constructor(args: {
    status: number;
    statusText: string;
    method: string;
    url: string;
    responseBody: string;
  }) {
    super(
      `Apliiq ${args.method} ${args.url} failed: ${args.status} ${args.statusText}` +
        (args.responseBody ? ` — ${truncate(args.responseBody, 800)}` : ""),
    );
    this.status = args.status;
    this.statusText = args.statusText;
    this.method = args.method;
    this.url = args.url;
    this.responseBody = args.responseBody;
  }
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max)}… (${value.length} bytes total)`;
}

/**
 * Read configuration from the environment.
 *
 * Values are trimmed because credentials pasted out of a dashboard routinely
 * carry a trailing newline, and a stray `\n` inside the HMAC key produces a
 * 401 that looks identical to a wrong secret.
 */
export function loadConfigFromEnv(env: NodeJS.ProcessEnv = process.env): ApliiqConfig {
  const appId = env.APLIIQ_APP_ID?.trim();
  const sharedSecret = env.APLIIQ_SHARED_SECRET?.trim();

  const missing: string[] = [];
  if (!appId) missing.push("APLIIQ_APP_ID");
  if (!sharedSecret) missing.push("APLIIQ_SHARED_SECRET");
  if (missing.length > 0) {
    throw new ApliiqConfigError(
      `Missing required environment ${missing.length === 1 ? "variable" : "variables"}: ${missing.join(", ")}. ` +
        "Copy apliiq-mcp/.env.example to apliiq-mcp/.env and fill it in — both values come from " +
        "the Apliiq dashboard under Account -> Stores -> Add a Custom Store.",
    );
  }

  const timeoutRaw = env.APLIIQ_TIMEOUT_MS?.trim();
  const timeoutMs = timeoutRaw ? Number(timeoutRaw) : DEFAULT_TIMEOUT_MS;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new ApliiqConfigError(`APLIIQ_TIMEOUT_MS must be a positive number, got: ${timeoutRaw}`);
  }

  return {
    appId: appId as string,
    sharedSecret: sharedSecret as string,
    baseUrl: env.APLIIQ_BASE_URL?.trim() || DEFAULT_BASE_URL,
    timeoutMs,
  };
}

export interface RequestOptions {
  /** Query string parameters. Entries with `undefined` values are dropped. */
  query?: Record<string, string | number | boolean | undefined>;
  /** Serialized as JSON and folded into the signature. */
  body?: unknown;
}

export class ApliiqClient {
  readonly #credentials: ApliiqCredentials;
  readonly #baseUrl: string;
  readonly #timeoutMs: number;

  constructor(config: ApliiqConfig) {
    this.#credentials = { appId: config.appId, sharedSecret: config.sharedSecret };
    // Trailing slashes are stripped so path joining stays predictable.
    this.#baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.#timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  /** The base URL in use. Exposed for diagnostics; contains no secret. */
  get baseUrl(): string {
    return this.#baseUrl;
  }

  #buildUrl(path: string, query: RequestOptions["query"]): string {
    const url = new URL(`${this.#baseUrl}/${path.replace(/^\/+/, "")}`);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    return url.toString();
  }

  /**
   * Issue a signed request and parse the JSON response.
   *
   * The body is serialized exactly once and that same string is both signed
   * and sent. Re-serializing would risk a different key order and therefore a
   * signature that does not match the bytes on the wire.
   */
  async request<T = unknown>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = this.#buildUrl(path, options.query);
    const serializedBody = options.body === undefined ? "" : JSON.stringify(options.body);
    const { header } = signRequest(this.#credentials, serializedBody);

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: header,
    };
    if (serializedBody !== "") headers["Content-Type"] = "application/json";

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers,
        ...(serializedBody === "" ? {} : { body: serializedBody }),
        signal: AbortSignal.timeout(this.#timeoutMs),
      });
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : String(cause);
      throw new ApliiqNetworkError(
        `Could not reach Apliiq at ${url}: ${reason}. ` +
          "Check network reachability and that APLIIQ_BASE_URL is correct.",
        { cause },
      );
    }

    const text = await response.text();

    if (!response.ok) {
      throw new ApliiqHttpError({
        status: response.status,
        statusText: response.statusText,
        method,
        url,
        responseBody: text,
      });
    }

    if (text.trim() === "") return undefined as T;

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApliiqError(
        `Apliiq ${method} ${url} returned a 2xx response that is not valid JSON: ${truncate(text, 400)}`,
      );
    }
  }

  /** List catalog products. */
  listProducts(query: RequestOptions["query"] = {}): Promise<unknown> {
    return this.request("GET", ENDPOINTS.products, { query });
  }

  /** Fetch a single product, including its colors and variants. */
  getProduct(productId: string): Promise<unknown> {
    return this.request("GET", ENDPOINTS.product(productId));
  }

  /** Upload an artwork file. See `tools.ts` for the field-name caveat. */
  uploadArtwork(payload: Record<string, unknown>): Promise<unknown> {
    return this.request("POST", ENDPOINTS.artwork, { body: payload });
  }
}
