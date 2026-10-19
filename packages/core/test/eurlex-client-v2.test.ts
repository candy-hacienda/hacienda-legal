import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MockAgent } from "undici";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EurlexClient } from "../src/eurlex/client.js";

const fixturesDir = join(import.meta.dirname, "fixtures", "eurlex");
const consolidatedFixture = readFileSync(join(fixturesDir, "consolidated-gdpr.json"), "utf8");
const citationsFixture = readFileSync(join(fixturesDir, "citations-gdpr.json"), "utf8");
const eurovocFixture = readFileSync(join(fixturesDir, "eurovoc-gdpr.json"), "utf8");

let mockAgent: MockAgent;

beforeEach(() => {
  mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
});

afterEach(async () => {
  await mockAgent.close();
});

describe("EUR-Lex client V2 methods", () => {
  it("fetches consolidated versions", async () => {
    mockAgent.get("https://publications.europa.eu").intercept({ method: "GET", path: /\/webapi\/rdf\/sparql\?/ }).reply(200, consolidatedFixture);

    const client = new EurlexClient(mockAgent);
    const versions = await client.consolidatedVersions("32016R0679", "FRA");

    expect(versions).toHaveLength(2);
  });

  it("fetches relations", async () => {
    mockAgent.get("https://publications.europa.eu").intercept({ method: "GET", path: /\/webapi\/rdf\/sparql\?/ }).reply(200, citationsFixture);

    const client = new EurlexClient(mockAgent);
    const relations = await client.relations({ celexId: "32016R0679", language: "FRA" });

    expect(relations[0]?.kind).toBe("amended_by");
  });

  it("fetches EuroVoc concepts", async () => {
    mockAgent.get("https://publications.europa.eu").intercept({ method: "GET", path: /\/webapi\/rdf\/sparql\?/ }).reply(200, eurovocFixture);

    const client = new EurlexClient(mockAgent);
    const concepts = await client.eurovoc({ celexId: "32016R0679", language: "FRA" });

    expect(concepts.map((concept) => concept.label)).toContain("protection des données");
  });
});
