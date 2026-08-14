/**
 * Live smoke test — run this on a machine that can actually reach Apliiq.
 *
 *   cd apliiq-mcp && npm run smoke
 *
 * This exists because the environment this server was built in could not reach
 * any *.apliiq.com host, so two things went into the code as assumptions
 * rather than facts: the exact HMAC construction, and the catalog endpoint
 * path. This script is designed to tell those two failure modes apart, because
 * they look identical from a failed tool call.
 *
 * It makes GET requests only. Nothing here creates or mutates anything.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  ApliiqClient,
  ApliiqConfigError,
  ApliiqHttpError,
  ApliiqNetworkError,
  loadConfigFromEnv,
} from "../src/apliiq-client.js";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Minimal .env loader.
 *
 * Deliberately not `--env-file`: that flag's behaviour varies across the Node
 * versions this might run on, and a dependency for fifteen lines is not worth
 * it. Existing process env always wins, so `APLIIQ_APP_ID=x npm run smoke`
 * overrides the file.
 */
async function loadDotEnv(): Promise<void> {
  const path = join(HERE, "..", ".env");
  let contents: string;
  try {
    contents = await readFile(path, "utf8");
  } catch {
    return; // No .env is fine — the values may already be exported.
  }

  for (const rawLine of contents.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

/** Show enough of an identifier to recognise it, never enough to use it. */
function mask(value: string): string {
  return value.length <= 6 ? "*".repeat(value.length) : `${value.slice(0, 4)}…${value.slice(-2)}`;
}

/** Candidate catalog paths, tried in order. See ENDPOINTS in apliiq-client.ts. */
const CANDIDATE_PRODUCT_PATHS = ["Product", "Products", "product", "products"];

function say(line = ""): void {
  process.stdout.write(`${line}\n`);
}

async function main(): Promise<number> {
  await loadDotEnv();

  let config;
  try {
    config = loadConfigFromEnv();
  } catch (error) {
    say(`✗ Configuration: ${error instanceof ApliiqConfigError ? error.message : String(error)}`);
    return 1;
  }

  const client = new ApliiqClient(config);
  say(`Base URL : ${client.baseUrl}`);
  say(`App ID   : ${mask(config.appId)}`);
  say(`Secret   : ${mask(config.sharedSecret)} (never sent — HMAC key only)`);
  say();

  let workingPath: string | null = null;
  let firstPayload: unknown = null;
  let sawAuthFailure = false;

  for (const path of CANDIDATE_PRODUCT_PATHS) {
    try {
      firstPayload = await client.request("GET", path);
      workingPath = path;
      say(`✓ GET ${path} → 200`);
      break;
    } catch (error) {
      if (error instanceof ApliiqNetworkError) {
        say(`✗ Network: ${error.message}`);
        say();
        say("  The request never reached Apliiq. This is connectivity or egress policy,");
        say("  not credentials. Nothing below can be trusted until this is fixed.");
        return 1;
      }
      if (error instanceof ApliiqHttpError) {
        say(`  GET ${path} → ${error.status} ${error.statusText}`);
        if (error.status === 401 || error.status === 403) sawAuthFailure = true;
      } else {
        say(`  GET ${path} → ${String(error)}`);
      }
    }
  }

  say();

  if (!workingPath) {
    if (sawAuthFailure) {
      say("✗ Authentication rejected (401/403) on every candidate path.");
      say();
      say("  Credentials or the signature are wrong. In likelihood order:");
      say("   1. APP_ID / SHARED_SECRET copied incorrectly, or from the wrong custom store.");
      say("   2. The custom store was never created (Account → Stores → Add a Custom Store).");
      say("   3. The signature construction in signRequest() is wrong — it was transcribed");
      say("      from a spec doc, not read from Apliiq's Authentication page. Check the");
      say("      concatenation order, and whether the secret is raw UTF-8 or base64-decoded.");
      say("   4. API access is gated behind a support/approval step on your account.");
    } else {
      say("✗ No candidate catalog path returned 200, but auth was not rejected.");
      say();
      say("  Auth is probably fine and the path is wrong. Find the real one in the");
      say("  Apliiq Product API docs and correct ENDPOINTS in src/apliiq-client.ts.");
    }
    return 1;
  }

  if (workingPath !== "Product") {
    say(`⚠ The working path is "${workingPath}", but src/apliiq-client.ts assumes "Product".`);
    say(`  Update ENDPOINTS.products to "${workingPath}".`);
    say();
  }

  say("✓ Authentication works — the HMAC signature was accepted.");
  say();

  // Try to pull a single product, which is the tool that actually matters:
  // it is where colors and variants live.
  const ids = collectIds(firstPayload);
  if (ids.length === 0) {
    say("⚠ Could not find an obvious product id in the list response, so get_product");
    say("  was not exercised. Inspect the payload below and call it manually.");
    say();
    say(preview(firstPayload));
    return 0;
  }

  const id = ids[0] as string;
  try {
    const product = await client.getProduct(id);
    say(`✓ GET ${workingPath}/${id} → 200`);
    say();
    say("Single-product payload (truncated):");
    say(preview(product));
  } catch (error) {
    say(`✗ Single product fetch failed: ${error instanceof Error ? error.message : String(error)}`);
    say();
    say("  The list endpoint works, so auth is fine. The single-product path shape");
    say("  is likely different — check ENDPOINTS.product in src/apliiq-client.ts.");
    return 1;
  }

  say();
  say("All checks passed. Remaining unverified: upload_artwork's request body field");
  say("names — see apliiq-mcp/README.md.");
  return 0;
}

/** Best-effort scan for id-ish fields, since the response shape is unknown. */
function collectIds(payload: unknown): string[] {
  const items = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null
      ? (Object.values(payload).find(Array.isArray) as unknown[] | undefined) ?? []
      : [];

  const ids: string[] = [];
  for (const item of items) {
    if (typeof item !== "object" || item === null) continue;
    for (const [key, value] of Object.entries(item)) {
      if (/^(id|productid)$/i.test(key) && (typeof value === "string" || typeof value === "number")) {
        ids.push(String(value));
        break;
      }
    }
  }
  return ids;
}

function preview(payload: unknown): string {
  const text = JSON.stringify(payload, null, 2) ?? String(payload);
  return text.length > 2000 ? `${text.slice(0, 2000)}\n… (${text.length} bytes total)` : text;
}

process.exitCode = await main();
