import { describe, expect, it } from "vitest";
import { formatEurlexLifecycle, mergeEurlexLifecycle } from "../src/eurlex/versions.js";
import type { EurlexConsolidatedVersion, EurlexRelation } from "../src/eurlex/types.js";

describe("EUR-Lex lifecycle versions", () => {
  it("merges initial act, consolidations and relations into a lifecycle view", () => {
    const consolidations: EurlexConsolidatedVersion[] = [
      {
        celexId: "02016R0679-20180525",
        baseCelexId: "32016R0679",
        dateVersion: "2018-05-25",
        language: "FRA",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02016R0679-20180525",
      },
    ];
    const relations: EurlexRelation[] = [
      {
        kind: "amended_by",
        sourceCelexId: "32016R0679",
        targetCelexId: "32018R1725",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32018R1725",
      },
    ];

    const lifecycle = mergeEurlexLifecycle({ celexId: "32016R0679", language: "FRA", consolidations, relations });

    expect(lifecycle.initialAct.celexId).toBe("32016R0679");
    expect(lifecycle.consolidations).toHaveLength(1);
    expect(lifecycle.relations).toHaveLength(1);
  });

  it("formats lifecycle output", () => {
    const lifecycle = mergeEurlexLifecycle({ celexId: "32016R0679", language: "FRA", consolidations: [], relations: [] });
    const output = formatEurlexLifecycle(lifecycle, "2026-05-15T10:00:00.000Z");

    expect(output).toContain("# Cycle de vie EUR-Lex - 32016R0679");
    expect(output).toContain("Acte initial");
  });
});
