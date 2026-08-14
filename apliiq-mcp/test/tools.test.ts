import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { buildArtworkPayload, createRedactor } from "../src/tools.js";
import { ApliiqError } from "../src/apliiq-client.js";

describe("createRedactor", () => {
  it("removes every occurrence of the shared secret", () => {
    const redact = createRedactor("s3cr3t");
    const output = redact("failed with s3cr3t and again s3cr3t");
    assert.ok(!output.includes("s3cr3t"));
    assert.equal(output.match(/\[REDACTED APLIIQ_SHARED_SECRET\]/g)?.length, 2);
  });

  it("leaves unrelated text untouched", () => {
    assert.equal(createRedactor("s3cr3t")("401 Unauthorized"), "401 Unauthorized");
  });

  it("is a no-op for an empty secret rather than corrupting every string", () => {
    // "".split("") would otherwise splice the marker between every character.
    assert.equal(createRedactor("")("hello"), "hello");
  });
});

/**
 * These pin the request shape documented on help.apliiq.com's Artwork API
 * page: exactly two fields, `Name` and `ImagePath`, both PascalCase, with an
 * https-only URL and a 50-character name limit.
 *
 * The field names matter more than they look. An earlier version of this tool
 * sent `fileName`/`name`/`fileContent` with the image base64-encoded, which is
 * a different API than the one Apliiq actually exposes — it fetches the image
 * from a URL rather than accepting bytes.
 */
describe("buildArtworkPayload", () => {
  const IMAGE = "https://cdn.example.com/art/logo.png";

  it("sends exactly the two documented PascalCase fields", () => {
    const payload = buildArtworkPayload(IMAGE, "logo");
    assert.deepEqual(payload, { Name: "logo", ImagePath: IMAGE });
    assert.deepEqual(Object.keys(payload).sort(), ["ImagePath", "Name"]);
  });

  it("defaults the name to the filename in the URL", () => {
    assert.equal(buildArtworkPayload(IMAGE).Name, "logo.png");
  });

  it("percent-decodes a derived name so it matches what the user sees", () => {
    assert.equal(
      buildArtworkPayload("https://cdn.example.com/art/spring%20drop.png").Name,
      "spring drop.png",
    );
  });

  it("falls back to a placeholder when the URL has no filename to derive from", () => {
    assert.equal(buildArtworkPayload("https://cdn.example.com/").Name, "artwork");
  });

  it("ignores query strings and fragments when deriving the name", () => {
    assert.equal(buildArtworkPayload(`${IMAGE}?v=2#preview`).Name, "logo.png");
  });

  it("rejects http:// — Apliiq documents the URL must be https", () => {
    assert.throws(
      () => buildArtworkPayload("http://cdn.example.com/art/logo.png"),
      (error: unknown) => error instanceof ApliiqError && /https:\/\//.test((error as Error).message),
    );
  });

  it("rejects a string that is not a URL at all", () => {
    assert.throws(() => buildArtworkPayload("./logo.png"), ApliiqError);
  });

  it("rejects a name over the documented 50-character limit", () => {
    assert.throws(
      () => buildArtworkPayload(IMAGE, "x".repeat(51)),
      (error: unknown) => error instanceof ApliiqError && /50-character/.test((error as Error).message),
    );
  });

  it("accepts a name at exactly the limit", () => {
    assert.equal(buildArtworkPayload(IMAGE, "x".repeat(50)).Name, "x".repeat(50));
  });

  it("applies the limit to a derived name too, not just an explicit one", () => {
    const longFile = `${"y".repeat(60)}.png`;
    assert.throws(() => buildArtworkPayload(`https://cdn.example.com/${longFile}`), ApliiqError);
  });
});
