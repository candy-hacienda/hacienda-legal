import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildEurlexRelationsQuery,
  formatEurlexRelations,
  mapEurlexRelations,
} from "../src/eurlex/citations.js";

const fixture = JSON.parse(readFileSync(join(import.meta.dirname, "fixtures", "eurlex", "citations-gdpr.json"), "utf8"));

describe("EUR-Lex citations and relations", () => {
  it("builds relation queries without exposing arbitrary SPARQL", () => {
    const query = buildEurlexRelationsQuery({ celexId: "32016R0679", direction: "both", relation: "amended_by", language: "FRA", limit: 25 });

    expect(query).toContain("32016R0679");
    expect(query).toContain("amended_by");
    expect(query).toContain("LIMIT 25");
    expect(query).not.toContain("SELECT *");
  });

  it("maps relation bindings to typed relations", () => {
    const relations = mapEurlexRelations(fixture, "FRA");

    expect(relations).toHaveLength(2);
    expect(relations[0]).toMatchObject({
      kind: "amended_by",
      sourceCelexId: "32016R0679",
      targetCelexId: "32018R1725",
    });
  });

  it("formats relation tables", () => {
    const output = formatEurlexRelations(mapEurlexRelations(fixture, "FRA"), "32016R0679", "2026-05-15T10:00:00.000Z");

    expect(output).toContain("# Relations EUR-Lex - 32016R0679");
    expect(output).toContain("amended_by");
    expect(output).toContain("32018R1725");
  });
});
