import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  EspacenetClient,
  EspacenetCredentialsMissingError,
} from "../../src/sources/espacenet.js";

describe("EspacenetClient", () => {
  it("sans credentials lève EspacenetCredentialsMissingError", () => {
    expect(() => new EspacenetClient({ consumerKey: "", consumerSecret: "" })).toThrow(
      EspacenetCredentialsMissingError
    );
  });

  it("authenticate réutilise le token tant que non expiré", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({ access_token: "ops-tok", expires_in: 1200 }),
        { status: 200 }
      )
    );
    const client = new EspacenetClient({
      consumerKey: "k",
      consumerSecret: "s",
      fetch: fetchMock as unknown as typeof fetch,
    });
    await client.authenticate();
    await client.authenticate();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // Vérifie qu'on envoie bien le header Basic auth
    const call = fetchMock.mock.calls[0];
    const init = call[1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toMatch(/^Basic /);
  });

  it("search retourne les résultats parsés", async () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL("../fixtures/espacenet/search-graphene.json", import.meta.url),
        "utf8"
      )
    );
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/auth/accesstoken")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 1200 }));
      }
      return new Response(JSON.stringify(fixture));
    });
    const client = new EspacenetClient({
      consumerKey: "k",
      consumerSecret: "s",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const out = await client.search({ query: "graphene", cib: ["B01D 71/02"], limite: 10 });
    expect(out.resultats.length).toBeGreaterThan(0);
    expect(out.totalCount).toBeGreaterThanOrEqual(out.resultats.length);
  });

  it("getBrevetDetails parse la fiche biblio", async () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL("../fixtures/espacenet/details-ep1234567.json", import.meta.url),
        "utf8"
      )
    );
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/auth/accesstoken")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 1200 }));
      }
      return new Response(JSON.stringify(fixture));
    });
    const client = new EspacenetClient({
      consumerKey: "k",
      consumerSecret: "s",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const out = await client.getBrevetDetails("EP1234567");
    expect(out.numero).toBe("EP1234567");
    expect(out.classificationCIB.length).toBeGreaterThan(0);
    expect(out.urlEspacenet).toMatch(/^https:\/\//);
  });
});
