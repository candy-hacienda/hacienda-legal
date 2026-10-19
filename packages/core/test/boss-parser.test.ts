import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseBossDocument } from "../src/boss/parser.js";

const fixturesDir = join(import.meta.dirname, "fixtures", "boss");
const fixture = readFileSync(join(fixturesDir, "avantages-en-nature.html"), "utf8");
const sourceUrl = "https://boss.gouv.fr/portail/accueil/autres-elements-de-remuneration/avantages-en-nature.html";
const retrievedAt = "2026-05-14T18:00:00.000Z";

describe("parseBossDocument", () => {
  it("extracts metadata, breadcrumb, sections, and normalized main text from BOSS HTML", () => {
    const document = parseBossDocument(fixture, sourceUrl, retrievedAt);

    expect(document).toMatchObject({
      id: "avantages-en-nature",
      title: "Avantages en nature",
      canonicalUrl: sourceUrl,
      retrievedAt,
    });
    expect(document.breadcrumb).toContain("Autres éléments de rémunération");
    expect(document.sections).toContainEqual({
      id: "titre-chapitre-1",
      heading: "Chapitre 1 - Principes généraux",
      text: "Les avantages en nature sont soumis à cotisations sociales.",
    });
    expect(document.text).toContain("soumis à cotisations sociales");
  });

  it("falls back to the source URL and cleaned title tag when canonical and h1 are missing", () => {
    const document = parseBossDocument("<html><head><title>Accueil - Boss.gouv.fr</title></head><body><main><p>Texte</p></main></body></html>", sourceUrl, retrievedAt);

    expect(document.title).toBe("Accueil");
    expect(document.canonicalUrl).toBe(sourceUrl);
  });

  it("converts h1 inline markup and entities to plain text", () => {
    const document = parseBossDocument("<html><body><main><h1><span>Avantages &amp; nature</span></h1></main></body></html>", sourceUrl, retrievedAt);

    expect(document.title).toBe("Avantages & nature");
    expect(document.title).not.toContain("<span>");
  });

  it("decodes common French HTML entities", () => {
    const document = parseBossDocument(
      "<html><body><main><h1>R&eacute;mun&eacute;ration</h1><p>L&rsquo;employeur &agrave; ses salari&eacute;s.</p></main></body></html>",
      sourceUrl,
      retrievedAt,
    );

    expect(document.title).toBe("Rémunération");
    expect(document.text).toContain("L’employeur à ses salariés.");
  });
});
