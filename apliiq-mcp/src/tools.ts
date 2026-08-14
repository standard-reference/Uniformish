/**
 * MCP tool schemas and handlers.
 *
 * Knows about MCP and about `apliiq-client`, but nothing about transports
 * (spec §3). Whether this process is speaking stdio or HTTP is not
 * observable from here, and must stay that way.
 *
 * v1 ships the three tools the build spec marks ✅ documented. `create_order`
 * and `get_order_status` are deliberately absent: spec §5 says resolve the
 * field-level shape before building them, and it has not been resolved.
 */

import { readFile, stat } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApliiqClient, ApliiqError } from "./apliiq-client.js";

/** Refuse to base64 anything larger than this. Base64 inflates by ~33%. */
const MAX_ARTWORK_BYTES = 25 * 1024 * 1024;

/** Scrubs sensitive strings out of text bound for the model's context. */
export type Redactor = (text: string) => string;

/**
 * Build a redactor that removes the shared secret from any outbound text.
 *
 * Nothing in `apliiq-client` puts the secret into an error message today, so
 * this is belt-and-braces — but tool results are rendered into a transcript
 * that gets stored and displayed, so a leak here would be durable and hard to
 * walk back. Cheap insurance against a future edit that is less careful.
 */
export function createRedactor(sharedSecret: string): Redactor {
  if (!sharedSecret) return (text) => text;
  return (text) => text.split(sharedSecret).join("[REDACTED APLIIQ_SHARED_SECRET]");
}

function ok(payload: unknown, redact: Redactor) {
  return {
    content: [{ type: "text" as const, text: redact(JSON.stringify(payload, null, 2)) }],
  };
}

function fail(error: unknown, redact: Redactor) {
  const message =
    error instanceof ApliiqError
      ? error.message
      : error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);
  return {
    content: [{ type: "text" as const, text: redact(message) }],
    isError: true as const,
  };
}

export function registerTools(
  server: McpServer,
  client: ApliiqClient,
  redact: Redactor = (text) => text,
): void {
  server.registerTool(
    "list_products",
    {
      title: "List Apliiq products",
      description:
        "List products in the Apliiq catalog. Use this to find a product's ID, then call " +
        "get_product for its colors and variants. Returns Apliiq's raw JSON response.",
      inputSchema: {
        page: z.number().int().positive().optional().describe("1-based page number, if the endpoint paginates."),
        pageSize: z.number().int().positive().max(200).optional().describe("Results per page."),
      },
    },
    async ({ page, pageSize }) => {
      try {
        return ok(await client.listProducts({ page, pageSize }), redact);
      } catch (error) {
        return fail(error, redact);
      }
    },
  );

  server.registerTool(
    "get_product",
    {
      title: "Get one Apliiq product",
      description:
        "Fetch a single Apliiq product by ID, including its available colors and variants. " +
        "This is the tool that replaces checking the Apliiq catalog by hand — use it to confirm " +
        "which blank colors actually exist before committing to a colorway.",
      inputSchema: {
        productId: z
          .string()
          .min(1)
          .describe("Apliiq product ID, as returned by list_products."),
      },
    },
    async ({ productId }) => {
      try {
        return ok(await client.getProduct(productId), redact);
      } catch (error) {
        return fail(error, redact);
      }
    },
  );

  server.registerTool(
    "upload_artwork",
    {
      title: "Upload artwork to Apliiq",
      description:
        "Upload an artwork file to Apliiq (POST /Artwork). Pass a path to a local file — the " +
        "server reads and base64-encodes it, so the image bytes never pass through the " +
        "conversation. NOTE: the exact field names Apliiq expects in this request body were not " +
        "verifiable when this tool was written; if it fails with a 4xx, use extraFields to " +
        "override or add keys rather than guessing repeatedly.",
      inputSchema: {
        filePath: z
          .string()
          .min(1)
          .describe("Absolute or relative path to the artwork file on this machine."),
        name: z.string().optional().describe("Display name for the artwork. Defaults to the filename."),
        extraFields: z
          .record(z.string(), z.unknown())
          .optional()
          .describe(
            "Additional top-level keys merged into the request body. Keys set here override " +
              "the defaults, which is the escape hatch for correcting field names without a code change.",
          ),
      },
    },
    async ({ filePath, name, extraFields }) => {
      try {
        const absolutePath = resolve(filePath);

        const stats = await stat(absolutePath).catch(() => null);
        if (!stats) {
          return fail(new ApliiqError(`No such file: ${absolutePath}`), redact);
        }
        if (!stats.isFile()) {
          return fail(new ApliiqError(`Not a regular file: ${absolutePath}`), redact);
        }
        if (stats.size > MAX_ARTWORK_BYTES) {
          return fail(
            new ApliiqError(
              `Artwork is ${stats.size} bytes, over the ${MAX_ARTWORK_BYTES}-byte limit.`,
            ),
            redact,
          );
        }

        const fileName = basename(absolutePath);
        const payload: Record<string, unknown> = {
          // ASSUMPTION — these key names are not confirmed against Apliiq's
          // Artwork API docs. See the tool description and README.
          fileName,
          name: name ?? fileName,
          fileContent: (await readFile(absolutePath)).toString("base64"),
          ...extraFields,
        };

        return ok(await client.uploadArtwork(payload), redact);
      } catch (error) {
        return fail(error, redact);
      }
    },
  );
}
