import { describe, it, expect, beforeEach } from "vitest";
import { MockAgent, setGlobalDispatcher } from "undici";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PisteClient } from "../src/piste-client.js";
import { PisteHttpClient } from "../src/http.js";
import type { Config } from "../src/config.js";
import { registerGetArticle } from "../src/tools/get-article.js";

/**
 * `getArticleWithIdAndNum` ne renvoie pas les articles ABROGE_DIFF (abrogation
 * différée) alors qu'ils sont encore en vigueur — ex. C.com. L441-10 (délais
 * de paiement), abrogé au 2027-01-01 mais applicable aujourd'hui. Ces tests
 * couvrent le repli via /search + /consult/getArticle. Fetch simulé via
 * `undici` MockAgent — aucun appel réseau réel, aucun identifiant PISTE requis.
 */

const CODE_DE_COMMERCE_LEGITEXT = "LEGITEXT000005634379";
const CODE_CIVIL_LEGITEXT = "LEGITEXT000006070721";

const config: Config = {
  clientId: "id",
  clientSecret: "secret",
  env: "production",
  oauthTokenUrl: "https://oauth.piste.gouv.fr/api/oauth/token",
  apiBaseUrl: "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app",
  cacheDir: "/tmp/test",
};

function makeAgent() {
  const agent = new MockAgent();
  agent.disableNetConnect();
  setGlobalDispatcher(agent);
  return agent;
}

function stubOAuth(agent: MockAgent) {
  agent
    .get("https://oauth.piste.gouv.fr")
    .intercept({ path: "/api/oauth/token", method: "POST" })
    .reply(200, { access_token: "tk", token_type: "Bearer", expires_in: 3600 })
    .persist();
}

function makeServer() {
  let handler: ((args: Record<string, string>) => Promise<{ isError?: boolean; content: { type: string; text: string }[] }>) | undefined;
  const server = {
    registerTool: (_name: string, _config: unknown, cb: typeof handler) => {
      handler = cb;
    },
  } as unknown as McpServer;
  return { server, getHandler: () => handler! };
}

describe("legifrance_get_article — repli ABROGE_DIFF quand getArticleWithIdAndNum renvoie null", () => {
  let agent: MockAgent;
  let pool: ReturnType<MockAgent["get"]>;
  let http: PisteHttpClient;

  beforeEach(() => {
    agent = makeAgent();
    stubOAuth(agent);
    pool = agent.get("https://api.piste.gouv.fr");
    const auth = new PisteClient(config, agent);
    http = new PisteHttpClient(config, auth, { dispatcher: agent });
  });

  it("retrouve la version ABROGE_DIFF en vigueur via /search puis /consult/getArticle", async () => {
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticleWithIdAndNum", method: "POST" })
      .reply(200, { article: null });
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/search", method: "POST" })
      .reply(200, {
        results: [
          {
            sections: [
              {
                extracts: [{ id: "LEGIARTI000038414392", num: "L441-10", legalStatus: "ABROGE_DIFF" }],
              },
            ],
          },
        ],
      });
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticle", method: "POST" })
      .reply(200, {
        article: {
          id: "LEGIARTI000038414392",
          num: "L441-10",
          texte: "Tout professionnel... (texte de l'article)",
          etat: "ABROGE_DIFF",
          dateDebut: "2019-04-26",
          dateFin: "2027-01-01",
          cidTexte: CODE_DE_COMMERCE_LEGITEXT,
        },
      });

    const { server, getHandler } = makeServer();
    registerGetArticle(server, http);
    const res = await getHandler()({ code: "Code de commerce", num: "L441-10" });

    expect(res.isError).toBeUndefined();
    const text = res.content[0]!.text;
    expect(text).toContain("Article L441-10");
    expect(text).toContain("⚠️");
    expect(text).toContain("2027-01-01");
    expect(text).toContain("Tout professionnel");
  });

  it("atteint la version ABROGE_DIFF même au-delà de la borne, en écartant d'abord les versions MODIFIE", async () => {
    // Forme réelle observée pour L441-10 (2026-09-28) : la version utile est le
    // 7e extrait, après des versions historiques MODIFIE d'autres codes.
    const modifie = Array.from({ length: 6 }, (_, i) => ({
      id: `LEGIARTI00000000000${i}`,
      num: "L441-10",
      legalStatus: "MODIFIE",
    }));
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticleWithIdAndNum", method: "POST" })
      .reply(200, { article: null });
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/search", method: "POST" })
      .reply(200, {
        results: [
          {
            sections: [
              {
                extracts: [
                  ...modifie,
                  { id: "LEGIARTI000038414392", num: "L441-10", legalStatus: "ABROGE_DIFF" },
                ],
              },
            ],
          },
        ],
      });
    // Seul l'identifiant ABROGE_DIFF est servi : consulter une version MODIFIE
    // (ancien comportement, borne atteinte avant le 7e extrait) ferait échouer le test.
    pool
      .intercept({
        path: "/dila/legifrance/lf-engine-app/consult/getArticle",
        method: "POST",
        body: (b) => b.includes("LEGIARTI000038414392"),
      })
      .reply(200, {
        article: {
          id: "LEGIARTI000038414392",
          num: "L441-10",
          texte: "Tout professionnel... (texte de l'article)",
          etat: "ABROGE_DIFF",
          dateDebut: 1556236800000, // forme réelle : epoch ms
          dateFin: 1798761600000,
          cidTexte: null,
          textTitles: [{ cid: CODE_DE_COMMERCE_LEGITEXT }],
        },
      });

    const { server, getHandler } = makeServer();
    registerGetArticle(server, http);
    const res = await getHandler()({ code: "Code de commerce", num: "L441-10" });

    expect(res.isError).toBeUndefined();
    expect(res.content[0]!.text).toContain("2027-01-01");
  });

  it("refait la recherche quand la première omet la version en vigueur (/search non déterministe)", async () => {
    // Vu en réel le 2026-09-29 : une réponse /search pour L441-10 sans la version ABROGE_DIFF.
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticleWithIdAndNum", method: "POST" })
      .reply(200, { article: null });
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/search", method: "POST" })
      .reply(200, {
        results: [{ sections: [{ extracts: [{ id: "LEGIARTI000006825372", num: "L441-10", legalStatus: "MODIFIE" }] }] }],
      });
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/search", method: "POST" })
      .reply(200, {
        results: [
          { sections: [{ extracts: [{ id: "LEGIARTI000038414392", num: "L441-10", legalStatus: "ABROGE_DIFF" }] }] },
        ],
      });
    pool
      .intercept({
        path: "/dila/legifrance/lf-engine-app/consult/getArticle",
        method: "POST",
        body: (b) => b.includes("LEGIARTI000038414392"),
      })
      .reply(200, {
        article: {
          id: "LEGIARTI000038414392",
          num: "L441-10",
          texte: "Tout professionnel... (texte de l'article)",
          etat: "ABROGE_DIFF",
          dateDebut: 1556236800000,
          dateFin: 1798761600000,
          cidTexte: null,
          textTitles: [{ cid: CODE_DE_COMMERCE_LEGITEXT }],
        },
      });

    const { server, getHandler } = makeServer();
    registerGetArticle(server, http);
    const res = await getHandler()({ code: "Code de commerce", num: "L441-10" });

    expect(res.isError).toBeUndefined();
    expect(res.content[0]!.text).toContain("2027-01-01");
  });

  it("atteint la version en vigueur au-delà des 5 premiers candidats VIGUEUR d'autres codes (revue Sourcery)", async () => {
    // Un numéro d'article commun peut être en vigueur (donc non filtré par
    // NOT_IN_FORCE_STATUSES) dans plus de 5 autres codes avant celui demandé.
    // Comme un extrait ne porte pas son LEGITEXT, il faut confirmer chaque
    // candidat par /consult/getArticle — sans plafonner en dessous de la
    // taille de la page /search (20), sous peine d'écarter la bonne version.
    const autresCodesEnVigueur = Array.from({ length: 8 }, (_, i) => ({
      id: `LEGIARTI0000000AUTRE${i}`,
      num: "L441-10",
      legalStatus: "VIGUEUR",
    }));
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticleWithIdAndNum", method: "POST" })
      .reply(200, { article: null });
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/search", method: "POST" })
      .reply(200, {
        results: [
          {
            sections: [
              {
                extracts: [
                  ...autresCodesEnVigueur,
                  { id: "LEGIARTI000038414392", num: "L441-10", legalStatus: "ABROGE_DIFF" },
                ],
              },
            ],
          },
        ],
      });
    for (const autre of autresCodesEnVigueur) {
      pool
        .intercept({
          path: "/dila/legifrance/lf-engine-app/consult/getArticle",
          method: "POST",
          body: (b) => b.includes(autre.id),
        })
        .reply(200, {
          article: {
            id: autre.id,
            num: "L441-10",
            texte: "Version en vigueur d'un autre code, sans rapport.",
            etat: "VIGUEUR",
            dateDebut: "2020-01-01",
            dateFin: null,
            cidTexte: CODE_CIVIL_LEGITEXT,
          },
        });
    }
    pool
      .intercept({
        path: "/dila/legifrance/lf-engine-app/consult/getArticle",
        method: "POST",
        body: (b) => b.includes("LEGIARTI000038414392"),
      })
      .reply(200, {
        article: {
          id: "LEGIARTI000038414392",
          num: "L441-10",
          texte: "Tout professionnel... (texte de l'article)",
          etat: "ABROGE_DIFF",
          dateDebut: "2019-04-26",
          dateFin: "2027-01-01",
          cidTexte: CODE_DE_COMMERCE_LEGITEXT,
        },
      });

    const { server, getHandler } = makeServer();
    registerGetArticle(server, http);
    const res = await getHandler()({ code: "Code de commerce", num: "L441-10" });

    expect(res.isError).toBeUndefined();
    expect(res.content[0]!.text).toContain("2027-01-01");
  });

  it("écarte un candidat appartenant à un autre code (LEGITEXT différent)", async () => {
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticleWithIdAndNum", method: "POST" })
      .reply(200, { article: null });
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/search", method: "POST" })
      .reply(200, {
        results: [
          {
            sections: [{ extracts: [{ id: "LEGIARTI999999999", num: "L441-10" }] }],
          },
        ],
      }).times(2); // second essai de recherche (FALLBACK_SEARCH_ATTEMPTS)
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticle", method: "POST" })
      .reply(200, {
        article: {
          id: "LEGIARTI999999999",
          num: "L441-10",
          texte: "Un autre article portant le même numéro dans un autre code.",
          etat: "VIGUEUR",
          dateDebut: "2020-01-01",
          dateFin: null,
          cidTexte: CODE_CIVIL_LEGITEXT,
        },
      }).times(2); // second essai de recherche (FALLBACK_SEARCH_ATTEMPTS)

    const { server, getHandler } = makeServer();
    registerGetArticle(server, http);
    const res = await getHandler()({ code: "Code de commerce", num: "L441-10" });

    expect(res.isError).toBe(true);
    expect(res.content[0]!.text).toContain("introuvable");
  });

  it("renvoie « introuvable » si aucune version candidate n'est en vigueur aujourd'hui", async () => {
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticleWithIdAndNum", method: "POST" })
      .reply(200, { article: null });
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/search", method: "POST" })
      .reply(200, {
        results: [
          {
            sections: [{ extracts: [{ id: "LEGIARTI000038414392", num: "L441-10" }] }],
          },
        ],
      }).times(2); // second essai de recherche (FALLBACK_SEARCH_ATTEMPTS)
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticle", method: "POST" })
      .reply(200, {
        article: {
          id: "LEGIARTI000038414392",
          num: "L441-10",
          texte: "Version historique, abrogée sans effet différé.",
          etat: "ABROGE",
          dateDebut: "2008-01-01",
          dateFin: "2019-04-26",
          cidTexte: CODE_DE_COMMERCE_LEGITEXT,
        },
      }).times(2); // second essai de recherche (FALLBACK_SEARCH_ATTEMPTS)

    const { server, getHandler } = makeServer();
    registerGetArticle(server, http);
    const res = await getHandler()({ code: "Code de commerce", num: "L441-10" });

    expect(res.isError).toBe(true);
    expect(res.content[0]!.text).toContain("introuvable");
  });

  it("chemin normal inchangé : ne déclenche pas le repli quand l'article est trouvé du premier coup", async () => {
    pool
      .intercept({ path: "/dila/legifrance/lf-engine-app/consult/getArticleWithIdAndNum", method: "POST" })
      .reply(200, {
        article: {
          id: "LEGIARTI000006901232",
          num: "L441-1",
          texte: "Texte de L441-1, en vigueur, trouvé directement.",
          etat: "VIGUEUR",
          dateDebut: "2019-04-26",
          dateFin: null,
          cidTexte: CODE_DE_COMMERCE_LEGITEXT,
        },
      });
    // Aucun intercept pour /search ou /consult/getArticle : un appel
    // inattendu ferait échouer le test (MockAgent avec disableNetConnect).

    const { server, getHandler } = makeServer();
    registerGetArticle(server, http);
    const res = await getHandler()({ code: "Code de commerce", num: "L441-1" });

    expect(res.isError).toBeUndefined();
    const text = res.content[0]!.text;
    expect(text).toContain("Article L441-1");
    expect(text).not.toContain("⚠️");
    expect(text).toContain("trouvé directement");
  });
});
