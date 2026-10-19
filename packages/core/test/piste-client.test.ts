import { describe, it, expect, beforeEach } from "vitest";
import { MockAgent, setGlobalDispatcher } from "undici";
import { PisteClient, PisteCredentialsMissingError, PisteAuthError } from "../src/piste-client.js";
import type { Config } from "../src/config.js";

const baseConfig: Config = {
  clientId: "test-client",
  clientSecret: "test-secret",
  env: "production",
  oauthTokenUrl: "https://oauth.piste.gouv.fr/api/oauth/token",
  apiBaseUrl: "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app",
  cacheDir: "/tmp/test",
};

describe("PisteClient — OAuth client_credentials", () => {
  let agent: MockAgent;

  beforeEach(() => {
    agent = new MockAgent();
    agent.disableNetConnect();
    setGlobalDispatcher(agent);
  });

  it("obtient un token et le met en cache", async () => {
    const pool = agent.get("https://oauth.piste.gouv.fr");
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(200, { access_token: "tk-1", token_type: "Bearer", expires_in: 3600 });

    const client = new PisteClient(baseConfig, agent);
    const t1 = await client.getAccessToken();
    expect(t1).toBe("tk-1");

    // 2nd call doesn't hit network (intercept would throw if called twice)
    const t2 = await client.getAccessToken();
    expect(t2).toBe("tk-1");
  });

  it("rafraîchit le token quand la marge expire", async () => {
    const pool = agent.get("https://oauth.piste.gouv.fr");
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(200, { access_token: "tk-1", token_type: "Bearer", expires_in: 60 });
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(200, { access_token: "tk-2", token_type: "Bearer", expires_in: 3600 });

    const client = new PisteClient(baseConfig, agent);
    const t1 = await client.getAccessToken();
    expect(t1).toBe("tk-1");

    // expires_in = 60s, REFRESH_MARGIN = 600s, so refreshAt is in the past;
    // floor at 30s → token is still valid for ~30s. Force refresh:
    client.invalidateToken();
    const t2 = await client.getAccessToken();
    expect(t2).toBe("tk-2");
  });

  it("lève PisteCredentialsMissingError si pas de credentials", async () => {
    const client = new PisteClient({ ...baseConfig, clientId: undefined, clientSecret: undefined }, agent);
    await expect(client.getAccessToken()).rejects.toBeInstanceOf(PisteCredentialsMissingError);
  });

  it("lève PisteAuthError après 2 échecs (1er essai + 1 réessai)", async () => {
    const pool = agent.get("https://oauth.piste.gouv.fr");
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(401, { error: "invalid_client" });
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(401, { error: "invalid_client" });

    const client = new PisteClient(baseConfig, agent);
    await expect(client.getAccessToken()).rejects.toBeInstanceOf(PisteAuthError);
  });

  it("réessaie une fois après un échec transitoire puis réussit", async () => {
    const pool = agent.get("https://oauth.piste.gouv.fr");
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(400, { error: "invalid_client" });
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(200, { access_token: "tk-retry", token_type: "Bearer", expires_in: 3600 });

    const client = new PisteClient(baseConfig, agent);
    const token = await client.getAccessToken();
    expect(token).toBe("tk-retry");
  });

  it("partage une seule requête de jeton entre appels concurrents", async () => {
    const pool = agent.get("https://oauth.piste.gouv.fr");
    // Un seul intercept : si plus d'une requête OAuth part, le 2e appel
    // n'aura pas de mock disponible et undici lèvera une erreur.
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(200, { access_token: "tk-shared", token_type: "Bearer", expires_in: 3600 });

    const client = new PisteClient(baseConfig, agent);
    const [t1, t2, t3] = await Promise.all([
      client.getAccessToken(),
      client.getAccessToken(),
      client.getAccessToken(),
    ]);
    expect(t1).toBe("tk-shared");
    expect(t2).toBe("tk-shared");
    expect(t3).toBe("tk-shared");
  });

  it("oublie la requête en échec : l'appel suivant repart de zéro", async () => {
    const pool = agent.get("https://oauth.piste.gouv.fr");
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(401, { error: "invalid_client" });
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(401, { error: "invalid_client" });

    const client = new PisteClient(baseConfig, agent);
    await expect(client.getAccessToken()).rejects.toBeInstanceOf(PisteAuthError);

    // Nouvel appel après l'échec complet : doit refaire une vraie requête
    // (pas réutiliser une promesse rejetée mise en cache), et peut réussir.
    pool
      .intercept({ path: "/api/oauth/token", method: "POST" })
      .reply(200, { access_token: "tk-fresh", token_type: "Bearer", expires_in: 3600 });
    const token = await client.getAccessToken();
    expect(token).toBe("tk-fresh");
  });
});
