import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildConsolidatedVersionsQuery,
  findNearestConsolidatedVersion,
  formatEurlexConsolidatedVersions,
  mapConsolidatedVersions,
} from "../src/eurlex/consolidated.js";

const fixture = JSON.parse(
  readFileSync(join(import.meta.dirname, "fixtures", "eurlex", "consolidated-gdpr.json"), "utf8"),
) as unknown;

describe("EUR-Lex consolidated versions", () => {
  it("builds a typed SPARQL query for consolidated versions", () => {
    const query = buildConsolidatedVersionsQuery("32016R0679", "FRA");

    expect(query).toContain("32016R0679");
    expect(query).toContain("act_consolidated_consolidates_resource_legal");
    expect(query).toContain("cdm:expression_title");
    expect(query).not.toContain("SELECT *");
  });

  it("maps consolidated versions and finds the nearest version", () => {
    const versions = mapConsolidatedVersions(fixture, "32016R0679", "FRA");

    expect(versions).toHaveLength(2);
    expect(versions[0]).toMatchObject({ celexId: "02016R0679-20160504", baseCelexId: "32016R0679" });
    expect(findNearestConsolidatedVersion(versions, "2018-01-01")?.celexId).toBe("02016R0679-20160504");
    expect(findNearestConsolidatedVersion(versions, "2018-06-01")?.celexId).toBe("02016R0679-20180525");
  });

  it("formats consolidated versions as Markdown", () => {
    const versions = mapConsolidatedVersions(fixture, "32016R0679", "FRA");
    const output = formatEurlexConsolidatedVersions(versions, "32016R0679", "2026-05-15T10:00:00.000Z");

    expect(output).toContain("# Versions consolidées EUR-Lex - 32016R0679");
    expect(output).toContain("02016R0679-20180525");
    expect(output).toContain("Consulté le 2026-05-15T10:00:00.000Z");
  });
});
