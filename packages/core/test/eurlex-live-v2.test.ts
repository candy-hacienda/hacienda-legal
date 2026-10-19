import { describe, expect, it } from "vitest";
import { EurlexClient } from "../src/eurlex/client.js";
import { buildEurlexFormatCandidates } from "../src/eurlex/formats.js";

const runLive = process.env.EURLEX_LIVE_TESTS === "1";
const maybeDescribe = runLive ? describe : describe.skip;

maybeDescribe("EUR-Lex V2 live smoke", () => {
  it("queries consolidated versions for GDPR", async () => {
    const client = new EurlexClient();
    const versions = await client.consolidatedVersions("32016R0679", "FRA");

    expect(Array.isArray(versions)).toBe(true);
  }, 30_000);

  it("queries relations for GDPR", async () => {
    const client = new EurlexClient();
    const relations = await client.relations({ celexId: "32016R0679", language: "FRA", limit: 5 });

    expect(Array.isArray(relations)).toBe(true);
  }, 30_000);

  it("builds format candidates without network", () => {
    expect(buildEurlexFormatCandidates("32016R0679", "FRA").length).toBeGreaterThan(0);
  });
});
