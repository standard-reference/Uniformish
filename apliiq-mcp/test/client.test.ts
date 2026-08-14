/**
 * Client tests — `fetch` is stubbed, so nothing here touches the network.
 * That matters: CI has no Apliiq reachability, and neither did the machine
 * this was written on.
 */

import { strict as assert } from "node:assert";
import { afterEach, describe, it } from "node:test";
import {
  ApliiqClient,
  ApliiqConfigError,
  ApliiqError,
  ApliiqHttpError,
  ApliiqNetworkError,
  DEFAULT_BASE_URL,
  loadConfigFromEnv,
  signRequest,
} from "../src/apliiq-client.js";

const CONFIG = { appId: "testapp", sharedSecret: "shhh", baseUrl: "https://api.example.test/v1" };

interface Captured {
  url: string;
  init: RequestInit;
}

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

/**
 * Replace fetch with a recorder. Takes a factory rather than a Response so
 * each call gets an unconsumed body, and so a test can throw instead.
 */
function stubFetch(makeResponse: () => Response): Captured[] {
  const calls: Captured[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return makeResponse();
  }) as unknown as typeof fetch;
  return calls;
}

function json(payload: unknown, status = 200): () => Response {
  return () =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { "content-type": "application/json" },
    });
}

function headerValue(init: RequestInit, name: string): string | undefined {
  return (init.headers as Record<string, string> | undefined)?.[name];
}

describe("ApliiqClient.request", () => {
  it("sends Accept: application/json and an x-apliiq-auth Authorization header", async () => {
    const calls = stubFetch(json({ ok: true }));
    await new ApliiqClient(CONFIG).request("GET", "Product");

    const call = calls[0];
    assert.ok(call);
    assert.equal(headerValue(call.init, "Accept"), "application/json");
    assert.match(headerValue(call.init, "Authorization") ?? "", /^x-apliiq-auth \d+:.+:testapp:[0-9a-f]+$/);
  });

  it("signs the exact body string it puts on the wire", async () => {
    const calls = stubFetch(json({ ok: true }));
    await new ApliiqClient(CONFIG).request("POST", "Artwork", { body: { b: 2, a: 1 } });

    const call = calls[0];
    assert.ok(call);
    const sentBody = call.init.body as string;

    // Re-derive the signature from the bytes that were actually sent. If the
    // client ever serialized twice (different key order the second time), the
    // signature would not match the body and Apliiq would reject it.
    const [, payload] = (headerValue(call.init, "Authorization") ?? "").split(" ");
    const [rts, sig, , state] = (payload ?? "").split(":");
    const expected = signRequest(CONFIG, sentBody, { rts: rts as string, state: state as string });
    assert.equal(sig, expected.sig);
  });

  it("sets Content-Type only when there is a body", async () => {
    const withBody = stubFetch(json({}));
    await new ApliiqClient(CONFIG).request("POST", "Artwork", { body: { a: 1 } });
    assert.equal(headerValue(withBody[0]!.init, "Content-Type"), "application/json");

    const withoutBody = stubFetch(json({}));
    await new ApliiqClient(CONFIG).request("GET", "Product");
    assert.equal(headerValue(withoutBody[0]!.init, "Content-Type"), undefined);
    assert.equal(withoutBody[0]!.init.body, undefined);
  });

  it("appends defined query params and drops undefined ones", async () => {
    const calls = stubFetch(json([]));
    await new ApliiqClient(CONFIG).listProducts({ page: 2, pageSize: undefined });

    const url = new URL(calls[0]!.url);
    assert.equal(url.searchParams.get("page"), "2");
    assert.equal(url.searchParams.has("pageSize"), false);
  });

  it("joins paths without doubling or dropping slashes", async () => {
    const calls = stubFetch(json({}));
    await new ApliiqClient({ ...CONFIG, baseUrl: "https://api.example.test/v1///" }).request("GET", "/Product");
    assert.equal(calls[0]!.url, "https://api.example.test/v1/Product");
  });

  it("url-encodes a product id", async () => {
    const calls = stubFetch(json({}));
    await new ApliiqClient(CONFIG).getProduct("a b/c");
    assert.equal(calls[0]!.url, "https://api.example.test/v1/Product/a%20b%2Fc");
  });

  it("throws ApliiqHttpError carrying the status and response body", async () => {
    stubFetch(() => new Response("nope", { status: 401, statusText: "Unauthorized" }));

    const error = await new ApliiqClient(CONFIG).getProduct("x").then(
      () => null,
      (caught: unknown) => caught,
    );

    assert.ok(error instanceof ApliiqHttpError);
    assert.equal(error.status, 401);
    assert.equal(error.responseBody, "nope");
    assert.match(error.message, /401 Unauthorized/);
  });

  it("wraps transport failures as ApliiqNetworkError", async () => {
    stubFetch(() => {
      throw new TypeError("fetch failed");
    });

    const error = await new ApliiqClient(CONFIG).listProducts().then(
      () => null,
      (caught: unknown) => caught,
    );

    assert.ok(error instanceof ApliiqNetworkError);
    assert.match(error.message, /Could not reach Apliiq/);
  });

  it("returns undefined for a 204 with no body", async () => {
    // 204 is a null-body status: passing "" to the Response constructor throws.
    stubFetch(() => new Response(null, { status: 204 }));
    assert.equal(await new ApliiqClient(CONFIG).listProducts(), undefined);
  });

  it("returns undefined for a 200 whose body is only whitespace", async () => {
    stubFetch(() => new Response("  \n", { status: 200 }));
    assert.equal(await new ApliiqClient(CONFIG).listProducts(), undefined);
  });

  it("throws ApliiqError when a 2xx body is not JSON", async () => {
    stubFetch(() => new Response("<html>maintenance</html>", { status: 200 }));

    const error = await new ApliiqClient(CONFIG).listProducts().then(
      () => null,
      (caught: unknown) => caught,
    );

    assert.ok(error instanceof ApliiqError);
    assert.match(error.message, /not valid JSON/);
  });
});

describe("loadConfigFromEnv", () => {
  it("reads all values from the environment", () => {
    const config = loadConfigFromEnv({
      APLIIQ_APP_ID: "id",
      APLIIQ_SHARED_SECRET: "secret",
      APLIIQ_BASE_URL: "https://example.test/v1",
      APLIIQ_TIMEOUT_MS: "5000",
    } as NodeJS.ProcessEnv);

    assert.deepEqual(config, {
      appId: "id",
      sharedSecret: "secret",
      baseUrl: "https://example.test/v1",
      timeoutMs: 5000,
    });
  });

  it("defaults the base URL and timeout", () => {
    const config = loadConfigFromEnv({
      APLIIQ_APP_ID: "id",
      APLIIQ_SHARED_SECRET: "secret",
    } as NodeJS.ProcessEnv);

    assert.equal(config.baseUrl, DEFAULT_BASE_URL);
    assert.equal(config.timeoutMs, 30_000);
  });

  it("trims whitespace, since a pasted secret often carries a trailing newline", () => {
    const config = loadConfigFromEnv({
      APLIIQ_APP_ID: "  id  ",
      APLIIQ_SHARED_SECRET: "secret\n",
    } as NodeJS.ProcessEnv);

    assert.equal(config.appId, "id");
    assert.equal(config.sharedSecret, "secret");
  });

  it("names every missing variable at once", () => {
    assert.throws(
      () => loadConfigFromEnv({} as NodeJS.ProcessEnv),
      (error: unknown) =>
        error instanceof ApliiqConfigError &&
        error.message.includes("APLIIQ_APP_ID") &&
        error.message.includes("APLIIQ_SHARED_SECRET"),
    );
  });

  it("rejects a non-numeric timeout instead of silently using NaN", () => {
    assert.throws(
      () =>
        loadConfigFromEnv({
          APLIIQ_APP_ID: "id",
          APLIIQ_SHARED_SECRET: "secret",
          APLIIQ_TIMEOUT_MS: "soon",
        } as NodeJS.ProcessEnv),
      ApliiqConfigError,
    );
  });
});
