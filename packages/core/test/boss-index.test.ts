import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { formatBossDocument, formatBossSearchResults } from "../src/boss/format.js";
import { buildBossSearchIndex, searchBossIndex } from "../src/boss/index.js";
import { parseBossDocument } from "../src/boss/parser.js";

const fixturesDir = join(import.meta.dirname, "fixtures", "boss");
const fixture = readFileSync(join(fixturesDir, "avantages-en-nature.html"), "utf8");
const sourceUrl = "https://boss.gouv.fr/portail/accueil/autres-elements-de-remuneration/avantages-en-nature.html";
const retrievedAt = "2026-05-14T18:00:00.000Z";

describe("BOSS search index", () => {
  it("returns scored BOSS hits for normalized query tokens", () => {
    const document = parseBossDocument(fixture, sourceUrl, retrievedAt);
    const index = buildBossSearchIndex([document]);

    const hits = searchBossIndex(index, { query: "cotisations avantages" });

    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      source: "BOSS",
      id: "avantages-en-nature",
      title: "Avantages en nature",
      url: sourceUrl,
      retrievedAt,
    });
    expect(hits[0]?.score).toBeGreaterThan(0);
  });

  it("filters by rubrique against breadcrumb text", () => {
    const document = parseBossDocument(fixture, sourceUrl, retrievedAt);
    const index = buildBossSearchIndex([document]);

    expect(searchBossIndex(index, { query: "avantages", rubrique: "rémunération" })).toHaveLength(1);
    expect(searchBossIndex(index, { query: "avantages", rubrique: "cotisations" })).toHaveLength(0);
  });

  it("formats search results and documents with BOSS URL and consultation date", () => {
    const document = parseBossDocument(fixture, sourceUrl, retrievedAt);
    const [hit] = searchBossIndex(buildBossSearchIndex([document]), { query: "cotisations avantages" });

    expect(formatBossSearchResults([hit], "cotisations avantages")).toContain(sourceUrl);
    expect(formatBossSearchResults([hit], "cotisations avantages")).toContain("Consulté le 2026-05-14T18:00:00.000Z");
    expect(formatBossDocument(document)).toContain("Chapitre 1 - Principes généraux");
    expect(formatBossDocument(document)).toContain(sourceUrl);
  });

  it("formats documents with full extracted text even when sections exist", () => {
    const document = parseBossDocument(
      [
        "<html><body><main>",
        "<h1>Avantages en nature</h1>",
        "<p>Notice introductive importante.</p>",
        '<h2 id="section">Chapitre 1</h2>',
        "<p>Texte de section.</p>",
        "</main></body></html>",
      ].join(""),
      sourceUrl,
      retrievedAt,
    );

    const formatted = formatBossDocument(document);

    expect(formatted).toContain("## Texte intégral extrait");
    expect(formatted).toContain("Notice introductive importante.");
    expect(formatted).toContain("## Chapitre 1");
  });
});
