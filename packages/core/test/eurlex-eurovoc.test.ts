import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertEurovocUri,
  buildEurovocQuery,
  formatEurlexEurovocConcepts,
  mapEurovocConcepts,
} from "../src/eurlex/eurovoc.js";

const fixture = JSON.parse(readFileSync(join(import.meta.dirname, "fixtures", "eurlex", "eurovoc-gdpr.json"), "utf8"));

describe("EUR-Lex EuroVoc", () => {
  it("validates EuroVoc URIs", () => {
    expect(assertEurovocUri("http://eurovoc.europa.eu/1234")).toBe("http://eurovoc.europa.eu/1234");
    expect(() => assertEurovocUri("https://example.com/1234")).toThrow("URI EuroVoc invalide");
  });

  it("requires at least one query input", () => {
    expect(() => buildEurovocQuery({ language: "FRA" })).toThrow("au moins un critère");
  });

  it("builds query by CELEX and maps concepts", () => {
    const query = buildEurovocQuery({ celexId: "32016R0679", language: "FRA", limit: 20 });
    const concepts = mapEurovocConcepts(fixture, "FRA");

    expect(query).toContain("32016R0679");
    expect(query).toContain("LIMIT 20");
    expect(concepts).toEqual([
      { id: "1234", label: "protection des données", language: "FRA", uri: "http://eurovoc.europa.eu/1234" },
      { id: "5678", label: "vie privée", language: "FRA", uri: "http://eurovoc.europa.eu/5678" },
    ]);
  });

  it("formats concepts", () => {
    const output = formatEurlexEurovocConcepts(mapEurovocConcepts(fixture, "FRA"), "32016R0679", "2026-05-15T10:00:00.000Z");

    expect(output).toContain("# Concepts EuroVoc EUR-Lex - 32016R0679");
    expect(output).toContain("protection des données");
  });
});
