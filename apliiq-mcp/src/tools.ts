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

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApliiqClient, ApliiqError } from "./apliiq-client.js";

/** Apliiq's Artwork API documents "Name cannot exceed 50 characters". */
const MAX_ARTWORK_NAME_LENGTH = 50;

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

/**
 * Build the POST /Artwork request body.
 *
 * Isolated and exported for the same reason `signRequest` is: it encodes a
 * request shape owned by Apliiq, so when their API disagrees with us there
 * should be exactly one place to correct and one place that pins the current
 * belief in tests.
 *
 * Both field names come from help.apliiq.com's Artwork API page, which
 * documents exactly two required fields and no optional ones. Note that Apliiq
 * fetches the image itself from `ImagePath` — this endpoint takes a URL, never
 * file bytes.
 *
 * @throws ApliiqError if the URL or name violates a documented constraint.
 */
export function buildArtworkPayload(
  imagePath: string,
  name?: string,
): { Name: string; ImagePath: string } {
  let url: URL;
  try {
    url = new URL(imagePath);
  } catch {
    throw new ApliiqError(`Not a valid URL: ${imagePath}`);
  }

  // Documented explicitly: "url must be https://". Apliiq fetches this
  // server-side, so a plain-http source would also be a downgrade we control.
  if (url.protocol !== "https:") {
    throw new ApliiqError(`Artwork URL must use https://, got ${url.protocol}//`);
  }

  let derived: string;
  try {
    derived = decodeURIComponent(url.pathname.split("/").pop() ?? "");
  } catch {
    derived = url.pathname.split("/").pop() ?? ""; // Malformed %-escapes: use it raw.
  }
  const artworkName = name ?? (derived || "artwork");

  // Documented as "Name cannot exceed 50 characters". Checked here so the
  // failure names the real problem instead of surfacing an opaque 4xx.
  if (artworkName.length > MAX_ARTWORK_NAME_LENGTH) {
    throw new ApliiqError(
      `Artwork name is ${artworkName.length} characters, over Apliiq's ` +
        `${MAX_ARTWORK_NAME_LENGTH}-character limit: ${JSON.stringify(artworkName)}`,
    );
  }

  return { Name: artworkName, ImagePath: url.toString() };
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
        "Register artwork with Apliiq (POST /Artwork). Apliiq fetches the image from a URL you " +
        "supply — it does not accept file bytes — so the image must already be hosted somewhere " +
        "publicly reachable over https. Returns the artwork Id, which is what order and product " +
        "calls reference.",
      inputSchema: {
        imagePath: z
          .string()
          .url()
          .describe(
            "Publicly reachable https:// URL of the artwork image. Apliiq fetches it server-side, " +
              "so it must not require authentication.",
          ),
        name: z
          .string()
          .optional()
          .describe(
            `Display name for the artwork, max ${MAX_ARTWORK_NAME_LENGTH} characters. ` +
              "Defaults to the filename in the URL.",
          ),
      },
    },
    async ({ imagePath, name }) => {
      try {
        return ok(await client.uploadArtwork(buildArtworkPayload(imagePath, name)), redact);
      } catch (error) {
        return fail(error, redact);
      }
    },
  );
}
