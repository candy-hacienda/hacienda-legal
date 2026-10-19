import { MockAgent } from "undici";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EurlexClient, buildSearchQuery } from "../src/eurlex/client.js";

/**
 * Relevé en réel le 2026-10-06 : sur 40 recherches types, 19 plantaient et 50 CELEX
 * sur 200 renvoyés par EUR-Lex n'étaient pas des CELEX d'acte (rectificatifs
 * `32016R0679R%2802%29`, `62024CJ0798_RES`, `62024TJ0585_INF`, références JO
 * `C%2F2026%2F04668`…). Un seul de ces identifiants faisait échouer toute la recherche.
 */
let mockAgent: MockAgent;
beforeEach(() => {
  mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
});
afterEach(async () => {
  await mockAgent.close();
});

const binding = (celex: string, over: Record<string, string> = {}) => ({
  celex: { value: celex },
  title: { value: `Titre ${celex}` },
  date: { value: "2024-05-01" },
  ...Object.fromEntries(Object.entries(over).map(([k, v]) => [k, { value: v }])),
});

function stubSparql(bindings: unknown[]) {
  mockAgent
    .get("https://publications.europa.eu")
    .intercept({ method: "GET", path: /\/webapi\/rdf\/sparql\?/ })
    .reply(200, JSON.stringify({ results: { bindings } }), {
      headers: { "content-type": "application/sparql-results+json" },
    });
}

describe("EUR-Lex — CELEX non conformes dans les résultats", () => {
  it("ne plante pas et écarte les identifiants qui ne sont pas des CELEX d'acte", async () => {
    stubSparql([
      binding("32016R0679"),
      binding("32016R0679R%2802%29"),
      binding("62024CJ0798_RES"),
      binding("62024TJ0585_INF"),
      binding("C%2F2026%2F04668"),
      binding("72019L1023LUX_202606116"),
      binding("32019L1023"),
    ]);

    const response = await new EurlexClient(mockAgent).search({ query: "protection des données" });

    expect(response.results.map((r) => r.celexId)).toEqual(["32016R0679", "32019L1023"]);
  });

  it("garde les CELEX consolidés (suffixe -AAAAMMJJ) et les arrêts (CJ, TJ)", async () => {
    stubSparql([binding("02016R0679-20160504"), binding("62014CJ0131"), binding("62018TJ0161")]);

    const response = await new EurlexClient(mockAgent).search({ query: "x" });

    expect(response.results.map((r) => r.celexId)).toEqual(["02016R0679-20160504", "62014CJ0131", "62018TJ0161"]);
  });

  it("demande à EUR-Lex de ne renvoyer que des CELEX conformes (pas de places perdues sur du bruit)", () => {
    const query = buildSearchQuery({ query: "x" });

    expect(query).toMatch(/FILTER\(REGEX\(\?celex, "\^\[0-9\]\[0-9A-Z\]\{4,\}/);
  });
});

describe("EUR-Lex — type d'acte", () => {
  it("déduit le type du CELEX quand le type SPARQL n'est pas fourni (cas réel : toujours « any »)", async () => {
    stubSparql([
      binding("32016R0679"),
      binding("32019L1023"),
      binding("32026D0179"),
      binding("62014CJ0131"),
      binding("52024DC0357"),
    ]);

    const response = await new EurlexClient(mockAgent).search({ query: "x" });

    expect(response.results.map((r) => r.resourceType)).toEqual([
      "regulation",
      "directive",
      "decision",
      "case-law",
      "any",
    ]);
  });

  it("lit le type dans la valeur réelle de cdm:work_has_resource-type (…/resource-type/REG)", async () => {
    stubSparql([binding("32016R0679", { type: "http://publications.europa.eu/resource/authority/resource-type/REG" })]);

    const response = await new EurlexClient(mockAgent).search({ query: "x" });

    expect(response.results[0]?.resourceType).toBe("regulation");
  });

  it("la requête demande le type par le prédicat qui existe réellement", () => {
    const query = buildSearchQuery({ query: "x" });

    expect(query).toContain("cdm:work_has_resource-type");
  });
});

describe("EUR-Lex — prédicats SPARQL réels (relevés le 2026-10-06)", () => {
  it("relations : « amends / amended_by » passent par resource_legal_amends_resource_legal, pas par les consolidations", async () => {
    const { buildEurlexRelationsQuery } = await import("../src/eurlex/citations.js");
    const query = buildEurlexRelationsQuery({ celexId: "32017L1132", direction: "both" });

    expect(query).toContain('(cdm:resource_legal_amends_resource_legal "amends")');
    expect(query).toContain('(cdm:resource_legal_amends_resource_legal "amended_by")');
    expect(query).not.toContain('(cdm:act_consolidated_consolidates_resource_legal "amended_by")');
    expect(query).not.toContain('(cdm:act_consolidated_based_on_resource_legal "amended_by")');
  });

  it("relations : « cites / cited_by » existent (work_cites_work)", async () => {
    const { buildEurlexRelationsQuery } = await import("../src/eurlex/citations.js");
    const query = buildEurlexRelationsQuery({ celexId: "32019L1023", direction: "both" });

    expect(query).toContain('(cdm:work_cites_work "cites")');
    expect(query).toContain('(cdm:work_cites_work "cited_by")');
  });

  it("EuroVoc : prédicat réel work_is_about_concept_eurovoc", async () => {
    const { buildEurovocQuery } = await import("../src/eurlex/eurovoc.js");

    expect(buildEurovocQuery({ celexId: "32016R0679" })).toContain("cdm:work_is_about_concept_eurovoc");
  });

  it("versions consolidées : ne garde que les consolidations de l'acte demandé", async () => {
    const { mapConsolidatedVersions } = await import("../src/eurlex/consolidated.js");
    const response = {
      results: {
        bindings: [
          { celex: { value: "02017L1132-20220812" }, dateVersion: { value: "2022-08-12" } },
          { celex: { value: "02014L0059-20200107" }, dateVersion: { value: "2020-01-07" } },
          { celex: { value: "01982L0891-20190717" }, dateVersion: { value: "2019-07-17" } },
          { celex: { value: "02017L1132-20190731" }, dateVersion: { value: "2019-07-31" } },
        ],
      },
    };

    const versions = mapConsolidatedVersions(response, "32017L1132");

    expect(versions.map((v) => v.celexId)).toEqual(["02017L1132-20220812", "02017L1132-20190731"]);
  });
});

describe("EUR-Lex — EuroVoc d'un acte donné", () => {
  it("lie directement l'acte demandé au lieu de balayer tous les actes (sinon délai dépassé)", async () => {
    const { buildEurovocQuery } = await import("../src/eurlex/eurovoc.js");
    const query = buildEurovocQuery({ celexId: "32016R0679" });

    expect(query).toContain("?work owl:sameAs <http://publications.europa.eu/resource/celex/32016R0679>");
    expect(query).not.toContain("STRSTARTS(STR(?celexUri)");
  });
});

describe("EUR-Lex — langue des étiquettes EuroVoc", () => {
  it("filtre sur le code de langue à 2 lettres des étiquettes SKOS (fr, en, de), pas sur « fra »", async () => {
    const { buildEurovocQuery } = await import("../src/eurlex/eurovoc.js");

    expect(buildEurovocQuery({ celexId: "32016R0679", language: "FRA" })).toContain('FILTER(LANG(?label) = "fr")');
    expect(buildEurovocQuery({ celexId: "32016R0679", language: "ENG" })).toContain('FILTER(LANG(?label) = "en")');
    expect(buildEurovocQuery({ celexId: "32016R0679", language: "DEU" })).toContain('FILTER(LANG(?label) = "de")');
  });
});
