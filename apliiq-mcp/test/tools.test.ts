import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { createRedactor } from "../src/tools.js";

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
