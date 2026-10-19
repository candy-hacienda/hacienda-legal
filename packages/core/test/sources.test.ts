import { describe, expect, it } from "vitest";
import {
  BUSINESS_DATA_SOURCES,
  OFFICIAL_SOURCES,
  type BusinessDataCitation,
  type BusinessDataSource,
  type OfficialSource,
  type SourceCitation,
  type SourceSearchHit,
} from "../src/index.js";

describe("source proof types", () => {
  it("accepts the official source identifiers used by Hacienda", () => {
    const sources: OfficialSource[] = ["LEGIFRANCE", "BOFIP", "JUDILIBRE", "BOSS", "EURLEX"];
    expect(sources).toEqual(["LEGIFRANCE", "BOFIP", "JUDILIBRE", "BOSS", "EURLEX"]);
    expect(OFFICIAL_SOURCES).toEqual(["LEGIFRANCE", "BOFIP", "JUDILIBRE", "BOSS", "EURLEX"]);
  });

  it("models a proof citation and a search hit with official URLs", () => {
    const citation: SourceCitation = {
      source: "BOSS",
      title: "Avantages en nature",
      url: "https://boss.gouv.fr/portail/accueil/autres-elements-de-remuneration/avantages-en-nature.html",
      retrievedAt: "2026-05-14T18:00:00.000Z",
      status: "vérifié",
      tool: "boss_get_document",
    };
    const hit: SourceSearchHit = {
      source: "JUDILIBRE",
      id: "abc",
      title: "Cass. soc.",
      url: "https://www.courdecassation.fr/decision/abc",
      retrievedAt: "2026-05-14T18:00:00.000Z",
      score: 1,
    };

    expect(citation.status).toBe("vérifié");
    expect(hit.source).toBe("JUDILIBRE");
  });

  it("classifies Pappers as business data, not an official legal source", () => {
    expect(OFFICIAL_SOURCES).toEqual(["LEGIFRANCE", "BOFIP", "JUDILIBRE", "BOSS", "EURLEX"]);
    expect(BUSINESS_DATA_SOURCES).toEqual(["PAPPERS"]);

    const source = "PAPPERS" satisfies BusinessDataSource;
    const citation: BusinessDataCitation = {
      source,
      title: "Fiche entreprise Pappers",
      retrievedAt: "2026-05-15T10:00:00.000Z",
      status: "à vérifier",
      tool: "informations-entreprise",
      id: "552100554",
      fields: ["siren", "nom_entreprise"],
    };

    expect(citation.source).toBe("PAPPERS");
    expect(OFFICIAL_SOURCES).not.toContain("PAPPERS");
  });
});
