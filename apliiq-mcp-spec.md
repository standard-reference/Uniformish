# Apliiq MCP — Build Spec

Grounded in help.apliiq.com (Authentication, API Overview, Artwork API, Product API pages). MCP-in-Claude-Code-only for now, architected so remote hosting is a later add-on, not a rewrite.

## 0. Prerequisite — manual, do this before writing any code

Credentials can't be generated via the API. In the Apliiq dashboard:
**Account → Stores page → Add a Custom Store** → this generates your `APP_ID` (API Key) and `SHARED_SECRET`.

No custom store = no credentials = nothing else in this spec works.

## 1. Auth — the part most likely to trip up a first pass

Apliiq uses **HMAC-SHA256 signing**, not a bearer token. Every request needs:

- `RTS` — request timestamp, Unix seconds
- `STATE` — random nonce, unique per request
- `SIG` — `base64(HMAC-SHA256(APPID + RTS + STATE + base64(body-or-empty-string), SHARED_SECRET))`
- Header: `Authorization: x-apliiq-auth {RTS}:{SIG}:{APPID}:{STATE}`
- Plus `Accept: application/json`

Base URL: `https://api.apliiq.com/v1/`

**Never** let `SHARED_SECRET` touch client-side code — Apliiq's own docs flag this explicitly. It lives in env vars, server/local-process side only. This is also *why* MCP-in-Claude-Code (or later, a backend-hosted server) is the correct shape here — a browser-side frontend must never hold this secret.

## 2. Environment

```
APLIIQ_APP_ID=
APLIIQ_SHARED_SECRET=
APLIIQ_BASE_URL=https://api.apliiq.com/v1
```
`.env`, gitignored, never committed.

## 3. Architecture — client/transport split, so hosting stays optional

```
/apliiq-mcp
  /src
    apliiq-client.ts    // HMAC signing + raw HTTP calls, zero MCP awareness
    tools.ts            // MCP tool schemas + handlers, calls apliiq-client
    server.ts           // wires tools.ts to a transport
  /transports
    stdio.ts             // what you use now, in Claude Code
    http.ts               // stub — fill in only if/when you host it
```

The rule: `apliiq-client.ts` and `tools.ts` never know which transport is running. Swapping stdio for HTTP later means writing `http.ts` and changing one line in `server.ts` — not touching the parts that actually talk to Apliiq.

## 4. Tools to implement (v1)

| Tool | Apliiq endpoint | Confirmed? |
|---|---|---|
| `list_products` | Product API (GET) | ✅ documented |
| `get_product` | Product API (GET single) — colors/variants live here, this is the one that kills manual catalog-checking | ✅ documented |
| `upload_artwork` | `POST /v1/Artwork` | ✅ documented |
| `create_order` | Create Order endpoint | ⚠️ auth pattern confirmed, haven't pulled full field-level spec yet |
| `get_order_status` | Orders | ⚠️ endpoint exists per API overview, exact shape unconfirmed |

## 5. Known gaps — resolve before building order tools

- **Warehouse API is explicitly "currently in development"** per Apliiq's own docs. Don't build anything against it yet.
- I've confirmed Product and Artwork API shapes directly. Order creation/status I've only confirmed *exists* and *uses the same auth* — haven't pulled the full request/response spec yet. Worth fetching the Create Order page in detail before writing that tool, so it's not guessed from the auth doc alone.

## 6. Hosting

Stdio transport, local, runs inside Claude Code on the web. Zero infrastructure. Add the HTTP transport (Cloudflare Workers, per earlier plan) only once you've actually reached for this from claude.ai chat and felt the gap — not before.

---

## Implementation status (added during build — not part of the original spec)

**v1 as built ships the three confirmed tools only.** `create_order` and `get_order_status` are deliberately *not* implemented, per §5's own rule — their field-level shapes were never pulled, and guessing them from the auth doc is exactly what §5 warns against. Tracked as a GitHub issue.

Everything below §1 that touches request *bodies* is implemented from this spec document rather than from a live read of help.apliiq.com, because the build environment's egress policy blocks every `*.apliiq.com` host. The signing algorithm is isolated in one exported function with known-answer tests so that if the live API rejects it, there is exactly one place to correct. See `apliiq-mcp/README.md` → "Verify against the live API first".
