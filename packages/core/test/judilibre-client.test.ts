import { MockAgent, setGlobalDispatcher } from "undici";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { JudilibreClient, JudilibreCredentialsMissingError, JudilibreHttpError } from "../src/judilibre/client.js";

let mockAgent: MockAgent;

beforeEach(() => {
  mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
  setGlobalDispatcher(mockAgent);
});

afterEach(async () => {
  await mockAgent.close();
});

describe("JudilibreClient", () => {
  it("sends KeyId and query params to /search", async () => {
    const pool = mockAgent.get("https://api.piste.gouv.fr");
    pool
      .intercept({
        method: "GET",
        path: "/cassation/judilibre/v1.0/search?query=licenciement&page_size=5&page=0",
        headers: { KeyId: "secret-key" },
      })
      .reply(200, { results: [{ id: "abc", decision_datetime: "2024-01-02" }], total: 1 });

    const client = new JudilibreClient({
      env: "production",
      baseUrl: "https://api.piste.gouv.fr/cassation/judilibre/v1.0",
      keyId: "secret-key",
      keySource: "JUDILIBRE_KEY_ID",
    });

    const result = await client.search({ query: "licenciement", pageSize: 5, page: 0 });

    expect(result.total).toBe(1);
    expect(result.results[0]!.id).toBe("abc");
  });

  it("throws a friendly missing credentials error before network I/O", async () => {
    const client = new JudilibreClient({
      env: "production",
      baseUrl: "https://api.piste.gouv.fr/cassation/judilibre/v1.0",
      keyId: undefined,
      keySource: "none",
    });

    await expect(client.search({ query: "faute grave" })).rejects.toBeInstanceOf(JudilibreCredentialsMissingError);
  });

  it("wraps non-2xx responses with status and body preview", async () => {
    const pool = mockAgent.get("https://api.piste.gouv.fr");
    pool
      .intercept({
        method: "GET",
        path: "/cassation/judilibre/v1.0/decision?id=abc",
      })
      .reply(403, { message: "forbidden" });

    const client = new JudilibreClient({
      env: "production",
      baseUrl: "https://api.piste.gouv.fr/cassation/judilibre/v1.0",
      keyId: "secret-key",
      keySource: "JUDILIBRE_KEY_ID",
    });

    await expect(client.getDecision("abc")).rejects.toBeInstanceOf(JudilibreHttpError);
  });

  it("uses the official /decision?id=... endpoint for decisions", async () => {
    const pool = mockAgent.get("https://api.piste.gouv.fr");
    pool
      .intercept({
        method: "GET",
        path: "/cassation/judilibre/v1.0/decision?id=abc",
        headers: { KeyId: "secret-key" },
      })
      .reply(200, { id: "abc", text: "Texte intégral." });

    const client = new JudilibreClient({
      env: "production",
      baseUrl: "https://api.piste.gouv.fr/cassation/judilibre/v1.0",
      keyId: "secret-key",
      keySource: "JUDILIBRE_KEY_ID",
    });

    const result = await client.getDecision("abc");

    expect(result.id).toBe("abc");
  });
});
