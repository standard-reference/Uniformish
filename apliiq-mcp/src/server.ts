#!/usr/bin/env node
/**
 * Wires the tools to a transport.
 *
 * Swapping transports is the single import on the marked line below. Nothing
 * in `tools.ts` or `apliiq-client.ts` changes, which is the whole point of the
 * split in spec §3.
 */

import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApliiqClient, loadConfigFromEnv, type ApliiqConfig } from "./apliiq-client.js";
import { createRedactor, registerTools } from "./tools.js";

// ↓↓↓ THE ONE LINE ↓↓↓  swap for `../transports/http.js` to host this remotely.
import { start } from "../transports/stdio.js";
// ↑↑↑ THE ONE LINE ↑↑↑

const SERVER_NAME = "apliiq";
const SERVER_VERSION = "0.1.0";

/**
 * Construct the server with its tools registered, without connecting it.
 *
 * Kept separate from the entry point so tests and future transports can build
 * a server without a transport being chosen for them.
 */
export function buildServer(config: ApliiqConfig): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });
  registerTools(server, new ApliiqClient(config), createRedactor(config.sharedSecret));
  return server;
}

async function main(): Promise<void> {
  let config: ApliiqConfig;
  try {
    config = loadConfigFromEnv();
  } catch (error) {
    // stderr, never stdout: under stdio transport stdout carries the protocol
    // and a stray write there corrupts the stream.
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
    return;
  }

  await start(buildServer(config));
}

const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error: unknown) => {
    process.stderr.write(`apliiq-mcp failed to start: ${error instanceof Error ? error.stack : String(error)}\n`);
    process.exit(1);
  });
}
