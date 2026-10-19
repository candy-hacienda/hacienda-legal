import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MockAgent } from "undici";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EurlexClient, buildSearchQuery, escapeSparqlString } from "../src/eurlex/client.js";

const fixturesDir = join(import.meta.dirname, "fixtures", "eurlex");
const searchFixture = readFileSync(join(fixturesDir, "search-ai-act.json"), "utf8");
const metadataFixture = readFileSync(join(fixturesDir, "metadata-gdpr.json"), "utf8");
const documentFixture = readFileSync(join(fixturesDir, "gdpr.xhtml"), "utf8");

let mockAgent: MockAgent;

beforeEach(() => {
  mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
});

afterEach(async () => {
  await mockAgent.close();
});

describe("EUR-Lex client", () => {
  it("escapes SPARQL strings", () => {
    expect(escapeSparqlString(String.raw`AI "Act" \ rules`)).toBe(String.raw`AI \"Act\" \\ rules`);
  });

  it("builds search queries with filters", () => {
    const query = buildSearchQuery({
      query: "intelligence artificielle",
      resourceType: "regulation",
      language: "FRA",
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
      limit: 5,
    });

    expect(query).toContain("'intelligence' AND 'artificielle'");
    expect(query).toContain("owl:sameAs");
    expect(query).toContain("cdm:expression_title");
    expect(query).toContain("bif:contains");
    expect(query).toContain('REGEX(?celex, "^3[0-9]{4}R")');
    expect(query).toContain("2024-01-01");
    expect(query).toContain("LIMIT 5");
  });

  it("searches Publications Office SPARQL and deduplicates CELEX identifiers", async () => {
    mockAgent
      .get("https://publications.europa.eu")
      .intercept({ method: "GET", path: /\/webapi\/rdf\/sparql\?/ })
      .reply(200, searchFixture, { headers: { "content-type": "application/sparql-results+json" } });

    const client = new EurlexClient(mockAgent);
    const response = await client.search({ query: "intelligence artificielle", language: "FRA", limit: 10 });

    expect(response.results).toHaveLength(1);
    expect(response.results[0]).toMatchObject({
      celexId: "32024R1689",
      title: "Règlement sur l'intelligence artificielle",
      resourceType: "regulation",
    });
  });

  it("fetches a CELEX document from the Cellar REST resource", async () => {
    mockAgent
      .get("https://publications.europa.eu")
      .intercept({ method: "GET", path: "/resource/celex/32016R0679" })
      .reply(200, documentFixture, { headers: { "content-type": "application/xhtml+xml" } });

    const client = new EurlexClient(mockAgent);
    const document = await client.fetchDocument("32016R0679", "FRA");

    expect(document).toContain("protection des personnes physiques");
  });

  it("follows Cellar REST redirects", async () => {
    mockAgent
      .get("https://publications.europa.eu")
      .intercept({ method: "GET", path: "/resource/celex/32016R0679" })
      .reply(303, "", { headers: { location: "https://publications.europa.eu/resource/cellar/gdpr/full" } });
    mockAgent
      .get("https://publications.europa.eu")
      .intercept({ method: "GET", path: "/resource/cellar/gdpr/full" })
      .reply(200, documentFixture, { headers: { "content-type": "application/xhtml+xml" } });

    const client = new EurlexClient(mockAgent);
    const document = await client.fetchDocument("32016R0679", "FRA");

    expect(document).toContain("protection des personnes physiques");
  });

  it("maps CELEX metadata from SPARQL bindings", async () => {
    mockAgent
      .get("https://publications.europa.eu")
      .intercept({ method: "GET", path: /\/webapi\/rdf\/sparql\?/ })
      .reply(200, metadataFixture, { headers: { "content-type": "application/sparql-results+json" } });

    const client = new EurlexClient(mockAgent);
    const metadata = await client.metadata("32016R0679", "FRA");

    expect(metadata).toMatchObject({
      celexId: "32016R0679",
      title: "Règlement général sur la protection des données",
      dateDocument: "2016-04-27",
      dateEffect: "2018-05-25",
      resourceType: "regulation",
    });
    expect(metadata.authors).toEqual(["Parlement européen", "Conseil de l'Union européenne"]);
    expect(metadata.eurovoc).toEqual(["protection des données", "vie privée"]);
    expect(metadata.directoryCodes).toEqual(["13.20.60.00"]);
  });
});
