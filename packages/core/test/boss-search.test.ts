import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildBossOfficialSearchUrl,
  parseBossSearchResults,
  searchBossOfficial,
} from "../src/boss/search.js";

const fixturesDir = join(import.meta.dirname, "fixtures", "boss");
const fixture = readFileSync(join(fixturesDir, "search-avantages-en-nature.html"), "utf8");

describe("BOSS official search", () => {
  it("builds the official BOSS search URL from user terms", () => {
    const url = buildBossOfficialSearchUrl("avantages en nature");

    expect(url.href).toContain("/portail/accueil/resultats-de-votre-recherche.html");
    expect(url.searchParams.get("src_originSiteKey")).toBe("siteboss");
    expect(url.searchParams.get("src_terms[0].term")).toBe("avantages en nature");
    expect(url.searchParams.get("src_terms[0].fields.siteContent")).toBe("true");
  });

  it("parses and normalizes BOSS result links from the official results page", () => {
    const hits = parseBossSearchResults(fixture, {
      query: "avantages en nature",
      pageSize: 10,
      retrievedAt: "2026-05-15T10:00:00.000Z",
    });

    expect(hits).toHaveLength(2);
    expect(hits[0]).toMatchObject({
      source: "BOSS",
      title: "Avantages en nature",
      url: "https://boss.gouv.fr/portail/accueil/autres-elements-de-remuneration/avantages-en-nature.html#titre-chapitre-6---avantages-en-nature",
      retrievedAt: "2026-05-15T10:00:00.000Z",
    });
    expect(hits[0]!.excerpt).toContain("Autres éléments de rémunération");
    expect(hits[1]!.url).toBe(
      "https://boss.gouv.fr/portail/accueil/autres-elements-de-remuneration/avantages-en-nature.html",
    );
  });

  it("fetches the official BOSS search page through an injected fetcher", async () => {
    const requests: { url: string; method: string | undefined; body: string | undefined }[] = [];
    const response = await searchBossOfficial(
      { query: "avantages en nature", pageSize: 1 },
      async (url, options) => {
        requests.push({ url, method: options?.method, body: options?.body });

        return {
          url,
          statusCode: 200,
          contentType: "text/html; charset=utf-8",
          text: fixture,
        };
      },
    );

    expect(requests).toEqual([
      expect.objectContaining({
        url: "https://boss.gouv.fr/portail/accueil/resultats-de-votre-recherche.html",
        method: "POST",
        body: expect.stringContaining("src_terms%5B0%5D.term=avantages+en+nature"),
      }),
    ]);
    expect(response.hits).toHaveLength(1);
    expect(response.searchUrl).toContain("src_terms%5B0%5D.term=avantages+en+nature");
  });
});
