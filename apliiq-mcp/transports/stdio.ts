/**
 * stdio transport — what Claude Code launches locally.
 *
 * Claude Code spawns this process and speaks JSON-RPC over stdin/stdout.
 * Consequence worth stating plainly: **stdout belongs to the protocol**.
 * A single `console.log` anywhere in this process corrupts the stream and
 * the server dies with an opaque parse error. Diagnostics go to stderr,
 * which Claude Code surfaces as MCP server logs.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export async function start(server: McpServer): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("apliiq-mcp: connected over stdio\n");
}
