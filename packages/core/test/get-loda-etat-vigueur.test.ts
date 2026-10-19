import { describe, it, expect, beforeEach } from "vitest";
import { MockAgent, setGlobalDispatcher } from "undici";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PisteClient } from "../src/piste-client.js";
import { PisteHttpClient } from "../src/http.js";
import type { Config } from "../src/config.js";
import { registerGetLoda } from "../src/tools/get-loda.js";
import { registerGetCode } from "../src/tools/get-code.js";

/**
 * Formes réelles relevées sur PISTE le 2026-10-06 : `/consult/lawDecree` et
 * `/consult/legi/tableMatieres` ne portent PAS `etat`/`dateDebut`/`dateFin` mais
 * `jurisState`, `dateDebutVersion`, `dateFinVersion` et `textAbroge`. Sans eux,
 * un texte abrogé ou à abrogation différée n'était pas signalé.
 */
const config: Config = {
  clientId: "id",
  clientSecret: "secret",
  env: "production",
  oauthTokenUrl: "https://oauth.piste.gouv.fr/api/oauth/token",
  apiBaseUrl: "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app",
  cacheDir: "/tmp/test",
};
const BASE = "/dila/legifrance/lf-engine-app";

type Handler = (args: Record<string, string>) => Promise<{ isError?: boolean; content: { type: string; text: string }[] }>;

function setup(path: string, reply: unknown, register: typeof registerGetLoda | typeof registerGetCode) {
  const agent = new MockAgent();
  agent.disableNetConnect();
  setGlobalDispatcher(agent);
  agent
    .get("https://oauth.piste.gouv.fr")
    .intercept({ path: "/api/oauth/token", method: "POST" })
    .reply(200, { access_token: "tk", token_type: "Bearer", expires_in: 3600 })
    .persist();
  agent.get("https://api.piste.gouv.fr").intercept({ path: `${BASE}${path}`, method: "POST" }).reply(200, reply);
  const http = new PisteHttpClient(config, new PisteClient(config, agent), { dispatcher: agent });
  let handler: Handler | undefined;
  const server = { registerTool: (_n: string, _c: unknown, cb: Handler) => { handler = cb; } } as unknown as McpServer;
  register(server, http);
  return handler!;
}

const lawDecree = (over: Record<string, unknown>) => ({
  id: "LEGITEXT000006068624_01-10-2026",
  cid: "JORFTEXT000000886460",
  title: "Loi n° 78-17 du 6 janvier 1978",
  nature: "LOI",
  etat: null,
  jurisState: "Vigueur",
  dateDebutVersion: "2026-10-01",
  dateFinVersion: "2027-11-26",
  textAbroge: false,
  sections: [],
  articles: [],
  ...over,
});

describe("legifrance_get_loda — état juridique et vigueur", () => {
  let text: (r: Awaited<ReturnType<Handler>>) => string;
  beforeEach(() => {
    text = (r) => r.content[0]!.text;
  });

  it("affiche l'état et la date de début de version d'un texte en vigueur", async () => {
    const h = setup("/consult/lawDecree", lawDecree({}), registerGetLoda);
    const out = text(await h({ textId: "JORFTEXT000000886460", date: "2026-10-06" }));
    expect(out).toContain("Vigueur");
    expect(out).toContain("2026-10-01");
    expect(out).not.toContain("ABROGÉ");
  });

  it("signale clairement un texte abrogé", async () => {
    const h = setup(
      "/consult/lawDecree",
      lawDecree({ jurisState: "Abroge", textAbroge: true, dateFinVersion: "2005-12-31" }),
      registerGetLoda,
    );
    const out = text(await h({ textId: "JORFTEXT000000886460", date: "2026-10-06" }));
    expect(out).toContain("ABROGÉ");
    expect(out).toContain("2005-12-31");
  });

  it("signale l'abrogation différée d'un texte encore en vigueur", async () => {
    const h = setup(
      "/consult/lawDecree",
      lawDecree({ jurisState: "Vigueur_diff", dateFinVersion: "2027-01-01" }),
      registerGetLoda,
    );
    const out = text(await h({ textId: "LEGITEXT000006069414", date: "2026-10-06" }));
    expect(out).toContain("2027-01-01");
    expect(out).toMatch(/abrogation|fin de version|jusqu'au/i);
  });

  it("n'invente pas de fin de vigueur quand dateFinVersion est la date « sans fin » (2999)", async () => {
    const h = setup("/consult/lawDecree", lawDecree({ dateFinVersion: "2999-01-01" }), registerGetLoda);
    const out = text(await h({ textId: "JORFTEXT000000886460", date: "2026-10-06" }));
    expect(out).not.toContain("2999");
  });
});

describe("legifrance_get_code — date de début de version", () => {
  it("affiche « en vigueur depuis » à partir de dateDebutVersion", async () => {
    const h = setup(
      "/consult/legi/tableMatieres",
      {
        title: "Code de commerce",
        nature: "CODE",
        etat: "VIGUEUR",
        jurisState: "Vigueur",
        dateDebutVersion: "2026-10-01",
        dateFinVersion: "2027-01-01",
        sections: [],
        articles: [],
      },
      registerGetCode,
    );
    const out = (await h({ code: "Code de commerce", date: "2026-10-06" })).content[0]!.text;
    expect(out).toMatch(/vigueur/i);
    expect(out).toContain("2026-10-01");
  });
});
