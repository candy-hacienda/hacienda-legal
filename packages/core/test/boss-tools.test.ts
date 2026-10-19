import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MockAgent, setGlobalDispatcher } from "undici";
import { afterEach, beforeEach } from "vitest";
import { describe, expect, it, vi } from "vitest";
import { parseBossDocument } from "../src/boss/parser.js";
import type { BossStatus } from "../src/boss/status.js";
import {
  buildBossStatusFromProbeResults,
  callBossGetDocument,
  callBossRecherche,
  callBossStatus,
  fetchBossDocumentForTool,
} from "../src/tools/boss.js";

const fixturesDir = join(import.meta.dirname, "fixtures", "boss");
const fixture = readFileSync(join(fixturesDir, "avantages-en-nature.html"), "utf8");
const sourceUrl = "https://boss.gouv.fr/portail/accueil/autres-elements-de-remuneration/avantages-en-nature.html";
const retrievedAt = "2026-05-14T18:00:00.000Z";

let mockAgent: MockAgent;

beforeEach(() => {
  mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
  setGlobalDispatcher(mockAgent);
});

afterEach(async () => {
  await mockAgent.close();
});

function textFrom(result: { content: { type: "text"; text: string }[] }): string {
  return result.content[0]!.text;
}

describe("BOSS MCP tools", () => {
  it("callBossStatus returns JSON status", async () => {
    const status: BossStatus = {
      homeUrl: "https://boss.gouv.fr/portail/accueil.html",
      network: "ok",
      robots: { status: "lu" },
      canReadHtml: true,
      cacheEntries: 0,
      lastError: null,
      recommendation: "utilisable",
    };

    const result = await callBossStatus(async () => status);

    expect(JSON.parse(textFrom(result))).toEqual(status);
  });

  it("preserves fulfilled robots diagnostics when homepage probe fails", () => {
    const status = buildBossStatusFromProbeResults({
      robots: {
        status: "fulfilled",
        value: {
          url: "https://boss.gouv.fr/robots.txt",
          statusCode: 200,
          contentType: "text/plain",
          text: "User-agent: *\nAllow: /\n",
        },
      },
      homepage: {
        status: "rejected",
        reason: new Error("fetch failed"),
      },
    });

    expect(status.robots.status).toBe("lu");
    expect(status.network).toMatch(/bloqué|erreur/);
    expect(status.lastError).toContain("fetch failed");
  });

  it("callBossRecherche searches the official BOSS engine first", async () => {
    const searcher = vi.fn().mockResolvedValue({
      searchUrl: "https://boss.gouv.fr/portail/accueil/resultats-de-votre-recherche.html",
      hits: [
        {
          source: "BOSS",
          id: "boss-live-avantages",
          title: "Avantages en nature",
          url: sourceUrl,
          retrievedAt,
          excerpt: "Résultat officiel du moteur de recherche BOSS.",
          score: 1,
        },
      ],
    });

    const result = await callBossRecherche([], { query: "avantages en nature" }, searcher);
    const text = textFrom(result);

    expect(searcher).toHaveBeenCalledWith({ query: "avantages en nature", pageSize: undefined, rubrique: undefined });
    expect(text).toContain("Avantages en nature");
    expect(text).toContain("Résultat officiel du moteur de recherche BOSS");
  });

  it("callBossRecherche falls back to supplied docs if official search fails", async () => {
    const document = parseBossDocument(fixture, sourceUrl, retrievedAt);
    const searcher = vi.fn().mockRejectedValue(new Error("search unavailable"));

    const result = await callBossRecherche([document], { query: "avantages cotisations" }, searcher);
    const text = textFrom(result);

    expect(text).toContain("Avantages en nature");
    expect(text).toContain("https://boss.gouv.fr/");
  });

  it("callBossRecherche reports live search failures when there is no local fallback", async () => {
    const result = await callBossRecherche([], { query: "cotisations" }, async () => {
      throw new Error("search unavailable");
    });

    expect(result.isError).toBe(true);
    expect(textFrom(result)).toContain("Erreur BOSS pendant la recherche");
  });

  it("callBossGetDocument calls injected fetcher and returns parsed formatted document", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      url: sourceUrl,
      statusCode: 200,
      contentType: "text/html; charset=utf-8",
      text: fixture,
    });

    const result = await callBossGetDocument(fetcher, { url: sourceUrl });
    const text = textFrom(result);

    expect(fetcher).toHaveBeenCalledWith(sourceUrl);
    expect(text).toContain("# Avantages en nature");
    expect(text).toContain("Chapitre 1 - Principes généraux");
    expect(text).toContain(sourceUrl);
  });

  it("callBossGetDocument returns MCP errors for non-html and HTTP failures", async () => {
    const nonHtmlFetcher = vi.fn().mockResolvedValue({
      url: sourceUrl,
      statusCode: 200,
      contentType: "application/json",
      text: "{}",
    });
    const httpErrorFetcher = vi.fn().mockResolvedValue({
      url: sourceUrl,
      statusCode: 500,
      contentType: "text/html",
      text: "<html><body>Erreur</body></html>",
    });

    await expect(callBossGetDocument(nonHtmlFetcher, { url: sourceUrl })).resolves.toMatchObject({ isError: true });
    await expect(callBossGetDocument(httpErrorFetcher, { url: sourceUrl })).resolves.toMatchObject({ isError: true });
  });

  it("fetchBossDocumentForTool checks robots before fetching the document", async () => {
    const pool = mockAgent.get("https://boss.gouv.fr");
    pool
      .intercept({ method: "GET", path: "/robots.txt" })
      .reply(200, "User-agent: *\nDisallow: /portail\n", { headers: { "content-type": "text/plain" } });

    await expect(fetchBossDocumentForTool(sourceUrl)).rejects.toThrow(/robots.txt BOSS bloque/);
  });

  it("fetchBossDocumentForTool allows an explicit URL fetch when robots is unavailable", async () => {
    const pool = mockAgent.get("https://boss.gouv.fr");
    pool.intercept({ method: "GET", path: "/robots.txt" }).reply(404, "<html>missing</html>", {
      headers: { "content-type": "text/html" },
    });
    pool.intercept({ method: "GET", path: "/portail/accueil/autres-elements-de-remuneration/avantages-en-nature.html" }).reply(200, fixture, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });

    const response = await fetchBossDocumentForTool(sourceUrl);

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Avantages en nature");
  });
});
