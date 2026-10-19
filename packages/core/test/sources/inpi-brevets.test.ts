import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  InpiBrevetSchema,
  InpiBrevetSearchResponseSchema,
  InpiBrevetsClient,
  InpiBrevetsCredentialsMissingError,
} from "../../src/sources/inpi-brevets.js";

describe("InpiBrevetSchema", () => {
  it("parse une réponse de recherche brevets", () => {
    const raw = JSON.parse(
      readFileSync(
        new URL("../fixtures/inpi/search-graphene-filtration.json", import.meta.url),
        "utf8"
      )
    );
    const parsed = InpiBrevetSearchResponseSchema.parse(raw);
    expect(parsed.resultats.length).toBeGreaterThan(0);
    const first = parsed.resultats[0];
    const second = InpiBrevetSchema.parse(first);
    expect(second.numero).toMatch(/^[A-Z]{2}\d+/);
    expect(Array.isArray(second.classificationCIB)).toBe(true);
    expect(second.classificationCIB.length).toBeGreaterThan(0);
    expect(["FR", "EP", "PCT", "CCP"]).toContain(second.type);
  });
});

describe("InpiBrevetsClient", () => {
  it("sans credentials lève InpiBrevetsCredentialsMissingError", () => {
    expect(() => new InpiBrevetsClient({ login: "", password: "" })).toThrow(
      InpiBrevetsCredentialsMissingError
    );
  });

  it("authenticate réutilise le token tant que non expiré", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({ access_token: "tok-brevets", expires_in: 3600 }),
        { status: 200 }
      )
    );
    const client = new InpiBrevetsClient({
      login: "user",
      password: "pwd",
      fetch: fetchMock as unknown as typeof fetch,
    });
    await client.authenticate();
    await client.authenticate();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("searchBrevets retourne les résultats parsés", async () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL("../fixtures/inpi/search-graphene-filtration.json", import.meta.url),
        "utf8"
      )
    );
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/services/sso/login")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 3600 }));
      }
      return new Response(JSON.stringify(fixture));
    });
    const client = new InpiBrevetsClient({
      login: "u",
      password: "p",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const out = await client.searchBrevets({
      query: "graphène filtration",
      classificationCIB: ["B01D 71/02"],
    });
    expect(out.resultats.length).toBeGreaterThan(0);
    expect(out.total).toBeGreaterThanOrEqual(out.resultats.length);
  });

  it("getBrevetDetails parse les revendications et l'historique", async () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL("../fixtures/inpi/details-brevet-fr2700123.json", import.meta.url),
        "utf8"
      )
    );
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/services/sso/login")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 3600 }));
      }
      return new Response(JSON.stringify(fixture));
    });
    const client = new InpiBrevetsClient({
      login: "u",
      password: "p",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const out = await client.getBrevetDetails("FR2700123");
    expect(out.numero).toBe("FR2700123");
    expect(out.revendications.length).toBeGreaterThan(0);
    expect(out.historique.length).toBeGreaterThan(0);
    expect(out.statut).toBe("delivree");
  });
});
