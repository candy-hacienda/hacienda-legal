import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildEurlexFormatCandidates,
  filterEurlexFormats,
  formatEurlexAvailableFormats,
} from "../src/eurlex/formats.js";
import type { EurlexAvailableFormat } from "../src/eurlex/types.js";

const fixture = JSON.parse(readFileSync(join(import.meta.dirname, "fixtures", "eurlex", "formats-gdpr.json"), "utf8")) as EurlexAvailableFormat[];

describe("EUR-Lex formats", () => {
  it("builds candidate URLs for known formats", () => {
    const candidates = buildEurlexFormatCandidates("32016R0679", "FRA");

    expect(candidates.map((candidate) => candidate.format)).toContain("xhtml");
    expect(candidates.map((candidate) => candidate.format)).toContain("pdf");
    expect(candidates[0]?.celexId).toBe("32016R0679");
  });

  it("filters formats by language and format", () => {
    expect(filterEurlexFormats(fixture, { language: "FRA", format: "pdf" })).toHaveLength(1);
  });

  it("formats available formats", () => {
    const output = formatEurlexAvailableFormats(fixture, "32016R0679", "2026-05-15T10:00:00.000Z");

    expect(output).toContain("# Formats EUR-Lex - 32016R0679");
    expect(output).toContain("application/pdf");
  });
});
