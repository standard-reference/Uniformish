/**
 * Signing tests.
 *
 * The expected digests below were produced with OpenSSL, NOT with this
 * codebase, so the test actually pins the algorithm instead of agreeing with
 * whatever the implementation happens to do:
 *
 *   printf '%s' 'testapp1700000000abc123' \
 *     | openssl dgst -sha256 -hmac 'shhh' -binary | base64
 *
 * If you change `signRequest`, regenerate these with openssl by hand. Do not
 * paste in what the new implementation prints.
 */

import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { signRequest, type ApliiqCredentials } from "../src/apliiq-client.js";

const CREDENTIALS: ApliiqCredentials = { appId: "testapp", sharedSecret: "shhh" };
const RTS = "1700000000";
const STATE = "abc123";

const SIG_EMPTY_BODY = "0jW+M6/9HjINtt9HdZoK2OLvRgna+Hn+fHm0mht92Qo=";
const SIG_WITH_BODY = "21zSvkYQ2zbZdTGRNFc5Ghit/j2FIyOxnYkkTD7Zr0w=";

describe("signRequest", () => {
  it("matches the OpenSSL digest for an empty body", () => {
    const { sig } = signRequest(CREDENTIALS, "", { rts: RTS, state: STATE });
    assert.equal(sig, SIG_EMPTY_BODY);
  });

  it("treats a missing body identically to an empty string", () => {
    const omitted = signRequest(CREDENTIALS, undefined, { rts: RTS, state: STATE });
    assert.equal(omitted.sig, SIG_EMPTY_BODY);
  });

  it("matches the OpenSSL digest when a body is base64'd into the message", () => {
    const { sig } = signRequest(CREDENTIALS, '{"a":1}', { rts: RTS, state: STATE });
    assert.equal(sig, SIG_WITH_BODY);
  });

  it("produces a different signature for a different body", () => {
    const a = signRequest(CREDENTIALS, '{"a":1}', { rts: RTS, state: STATE });
    const b = signRequest(CREDENTIALS, '{"a":2}', { rts: RTS, state: STATE });
    assert.notEqual(a.sig, b.sig);
  });

  it("formats the header as x-apliiq-auth RTS:SIG:APPID:STATE", () => {
    const { header } = signRequest(CREDENTIALS, "", { rts: RTS, state: STATE });
    assert.equal(header, `x-apliiq-auth ${RTS}:${SIG_EMPTY_BODY}:testapp:${STATE}`);

    // Field order is load-bearing and easy to transpose, so assert positionally too.
    const [scheme, payload] = header.split(" ");
    assert.equal(scheme, "x-apliiq-auth");
    const parts = (payload ?? "").split(":");
    assert.equal(parts.length, 4);
    assert.equal(parts[0], RTS);
    assert.equal(parts[2], "testapp");
    assert.equal(parts[3], STATE);
  });

  it("never emits the shared secret in any field", () => {
    const parts = signRequest(CREDENTIALS, '{"a":1}');
    for (const value of [parts.sig, parts.header, parts.rts, parts.state]) {
      assert.ok(!value.includes(CREDENTIALS.sharedSecret), `secret leaked into: ${value}`);
    }
  });

  it("generates a fresh nonce per call, so signatures are not replayable", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      seen.add(signRequest(CREDENTIALS).state);
    }
    assert.equal(seen.size, 200);
  });

  it("defaults rts to the current time in whole seconds", () => {
    const before = Math.floor(Date.now() / 1000);
    const { rts } = signRequest(CREDENTIALS);
    const after = Math.floor(Date.now() / 1000);

    assert.match(rts, /^\d+$/, "rts must be Unix seconds, not milliseconds or ISO");
    const parsed = Number(rts);
    assert.ok(parsed >= before && parsed <= after, `rts ${parsed} outside [${before}, ${after}]`);
  });

  it("changes the signature when only the secret differs", () => {
    const a = signRequest(CREDENTIALS, "", { rts: RTS, state: STATE });
    const b = signRequest({ appId: "testapp", sharedSecret: "shhh2" }, "", { rts: RTS, state: STATE });
    assert.notEqual(a.sig, b.sig);
  });
});
