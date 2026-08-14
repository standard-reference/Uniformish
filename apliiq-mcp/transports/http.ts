/**
 * HTTP transport — STUB. Not implemented, deliberately.
 *
 * Spec §6: add this only once you have actually reached for Apliiq data from a
 * claude.ai chat and felt the gap. Building it before then is infrastructure
 * with no user.
 *
 * When that day comes, the work is contained to this file plus one import line
 * in `src/server.ts`:
 *
 *   1. Use `StreamableHTTPServerTransport` from
 *      `@modelcontextprotocol/sdk/server/streamableHttp.js`, mounted on a POST
 *      route (Hono and Express both ship with the SDK).
 *   2. Decide session handling: stateless (a fresh transport per request) is
 *      simplest and fits Cloudflare Workers; stateful needs a session store.
 *   3. **Authenticate the endpoint.** This is the part that matters. Over
 *      stdio the process boundary is the security boundary — only the local
 *      Claude Code can talk to it. Over HTTP anyone who finds the URL can
 *      spend your Apliiq credentials, because the server signs every request
 *      with the shared secret on the caller's behalf. An unauthenticated
 *      deployment of this file is a credential-sharing endpoint.
 *   4. Keep `APLIIQ_SHARED_SECRET` in the platform's secret store, never in
 *      wrangler.toml or any bundled asset.
 *
 * `apliiq-client.ts` and `tools.ts` need no changes for any of this.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function start(_server: McpServer): Promise<void> {
  return Promise.reject(
    new Error(
      "The HTTP transport is not implemented. apliiq-mcp runs over stdio only (spec §6). " +
        "See the notes in transports/http.ts before implementing it — in particular, this " +
        "endpoint must be authenticated, since it signs requests with your Apliiq secret.",
    ),
  );
}
