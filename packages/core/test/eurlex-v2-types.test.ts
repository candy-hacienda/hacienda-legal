import { describe, expect, it } from "vitest";
import {
  buildEurlexV2CacheKey,
  type EurlexAvailableFormat,
  type EurlexConsolidatedVersion,
  type EurlexEurovocConcept,
  type EurlexRelation,
} from "../src/eurlex/types.js";

describe("EUR-Lex V2 shared types", () => {
  it("models consolidated versions, relations, EuroVoc and formats", () => {
    const version: EurlexConsolidatedVersion = {
      celexId: "02016R0679-20160504",
      baseCelexId: "32016R0679",
      dateVersion: "2016-05-04",
      language: "FRA",
      url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02016R0679-20160504",
      title: "RGPD consolidé",
    };
    const relation: EurlexRelation = {
      kind: "amended_by",
      sourceCelexId: "32016R0679",
      targetCelexId: "32018R1725",
      title: "Acte modificateur",
      date: "2018-10-23",
      url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32018R1725",
    };
    const concept: EurlexEurovocConcept = {
      id: "1234",
      label: "protection des données",
      language: "FRA",
      uri: "http://eurovoc.europa.eu/1234",
    };
    const format: EurlexAvailableFormat = {
      celexId: "32016R0679",
      language: "FRA",
      format: "xhtml",
      url: "https://publications.europa.eu/resource/cellar/gdpr/full",
      contentType: "application/xhtml+xml",
    };

    expect(version.baseCelexId).toBe("32016R0679");
    expect(relation.kind).toBe("amended_by");
    expect(concept.uri).toBe("http://eurovoc.europa.eu/1234");
    expect(format.format).toBe("xhtml");
  });

  it("builds stable V2 cache keys", () => {
    expect(buildEurlexV2CacheKey("citations", ["32016R0679", "both", "FRA"])).toBe(
      "eurlex:citations:32016R0679:both:FRA",
    );
  });
});
