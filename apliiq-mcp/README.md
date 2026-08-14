# apliiq-mcp

An MCP server exposing the [Apliiq](https://www.apliiq.com) print-on-demand API to Claude Code. Built to spec in [`../apliiq-mcp-spec.md`](../apliiq-mcp-spec.md).

Runs over **stdio, locally, only**. There is no hosted deployment and no HTTP transport — see [Hosting](#hosting).

---

## Verify against the live API first

**Read this before trusting any output from this server.**

This server was written in an environment whose egress policy blocked every `*.apliiq.com` host, so no request was ever made against the real API and no documentation page was ever read. Three things were therefore implemented from the spec document rather than confirmed:

| What | Where | How to confirm |
|---|---|---|
| The HMAC signature construction | `signRequest()` in `src/apliiq-client.ts` | `npm run smoke` — a 200 means it's right |
| The catalog endpoint paths | `ENDPOINTS` in `src/apliiq-client.ts` | `npm run smoke` — it probes several candidates and names the working one |
| `upload_artwork`'s request body field names | `src/tools.ts` | Not covered by the smoke test. Read the Artwork API docs, or use the tool's `extraFields` escape hatch |

Everything else — the auth *scheme*, the base URL, the header format — comes straight from the spec and is quoted there.

```bash
npm run smoke
```

The smoke test makes GET requests only. It is written specifically to distinguish "your credentials are wrong" from "the signature algorithm is wrong" from "the URL path is wrong", because all three produce an identical-looking failed tool call.

---

## Setup

**Prerequisite.** Credentials cannot be created through the API. In the Apliiq dashboard: **Account → Stores → Add a Custom Store**. That generates the App ID and Shared Secret. Without a custom store there are no credentials and nothing here works.

```bash
cd apliiq-mcp
npm install
cp .env.example .env    # then fill in APLIIQ_APP_ID and APLIIQ_SHARED_SECRET
npm test                # no network needed
npm run smoke           # live; needs real credentials and reachability
npm run build
```

### Register with Claude Code

After `npm run build`:

```bash
claude mcp add apliiq \
  --env APLIIQ_APP_ID=your_app_id \
  --env APLIIQ_SHARED_SECRET=your_shared_secret \
  -- node /absolute/path/to/apliiq-mcp/dist/src/server.js
```

The server reads credentials from its own process environment. `.env` is only used by `npm run smoke` and `npm run dev` — Claude Code injects the values above directly, so the two paths are independent.

---

## Tools

| Tool | Method | What it's for |
|---|---|---|
| `list_products` | GET | Find a product's ID. |
| `get_product` | GET | A single product with its colors and variants. **This is the one that replaces checking the catalog by hand** — use it to confirm a blank actually exists in a colorway before committing to it. |
| `upload_artwork` | POST | Upload an artwork file. Takes a *local file path*; the server reads and base64-encodes it, so image bytes never pass through the conversation. |

### What is deliberately missing

`create_order` and `get_order_status` are **not implemented**. Spec §5 says to resolve their field-level shapes before building them, and that never happened — the endpoints are confirmed to *exist* and to use the same auth, but their request and response bodies were never pulled. Shipping them would mean inventing field names from the authentication doc, which is exactly what §5 warns against. Tracked as a GitHub issue.

The Warehouse API is untouched: Apliiq's own docs mark it "currently in development".

---

## Architecture

```
src/apliiq-client.ts   HMAC signing + raw HTTP. Zero MCP awareness.
src/tools.ts           MCP tool schemas and handlers. Zero transport awareness.
src/server.ts          Wires the two together and picks a transport.
transports/stdio.ts    What Claude Code launches.
transports/http.ts     Stub. Not implemented, on purpose.
```

The invariant from spec §3: **neither `apliiq-client.ts` nor `tools.ts` knows which transport is running.** Adding HTTP later means writing `transports/http.ts` and changing one marked import line in `src/server.ts` — nothing that talks to Apliiq gets touched.

### stdout belongs to the protocol

Under stdio, Claude Code speaks JSON-RPC over this process's stdin/stdout. A single `console.log` anywhere in the process corrupts that stream and the server dies with an opaque parse error. All diagnostics go to **stderr**, which Claude Code surfaces as MCP server logs.

---

## Security

- `APLIIQ_SHARED_SECRET` is an **HMAC key, not a bearer token**. It is never transmitted — only used to derive a signature. Apliiq's docs flag exposure of it explicitly.
- It must never reach client-side code. This is the actual reason the architecture is an MCP server rather than something the storefront calls directly: a browser bundle cannot hold this secret, so the signing has to happen in a process the user controls.
- `.env` is gitignored, and CI fails the build if any `.env` file becomes tracked.
- Tool output is passed through a redactor that strips the secret before it can reach the transcript. Nothing puts it there today; the redactor guards against a future edit that is less careful.
- **If the secret is ever committed, rotate it in the Apliiq dashboard.** Removing the commit is not sufficient.

---

## Hosting

There isn't any, deliberately. Spec §6: add the HTTP transport only once you have actually reached for Apliiq data from a claude.ai chat and felt the gap.

One thing to understand before that day comes. Over stdio, the process boundary *is* the security boundary — only your local Claude Code can talk to this server. Over HTTP that is gone: anyone who finds the URL can spend your Apliiq credentials, because the server signs every request with your shared secret on the caller's behalf. An unauthenticated deployment of `transports/http.ts` is a credential-sharing endpoint. The notes in that file cover the rest.

---

## Development

```bash
npm run typecheck    # tsc --noEmit
npm test             # node:test; fetch is stubbed, no network
npm run build        # emit dist/
npm run dev          # run from source over stdio
```

The signing tests pin the algorithm against digests generated by OpenSSL, not by this codebase — so they verify the implementation rather than agree with it. If you change `signRequest`, regenerate the expected values with `openssl` by hand; do not paste in what the new implementation prints.
