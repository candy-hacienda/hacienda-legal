import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  InpiMarqueSchema,
  InpiClient,
  InpiCredentialsMissingError,
  InpiPublicationRecenteSchema,
} from "../../src/sources/inpi-marques.js";

describe("InpiMarqueSchema", () => {
  it("parse une réponse de détails INPI", () => {
    const raw = JSON.parse(
      readFileSync(
        new URL("../fixtures/inpi/details-marque-fr-1234567.json", import.meta.url),
        "utf8"
      )
    );
    const parsed = InpiMarqueSchema.parse(raw);
    expect(typeof parsed.numero).toBe("string");
    expect(Array.isArray(parsed.classes)).toBe(true);
    expect(parsed.titulaire.length).toBeGreaterThan(0);
  });
});

describe("InpiClient", () => {
  it("authenticate réutilise le token tant que non expiré", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({ access_token: "tok-1", expires_in: 3600 }),
        { status: 200 }
      )
    );
    const client = new InpiClient({
      login: "user",
      password: "pwd",
      fetch: fetchMock as unknown as typeof fetch,
    });
    await client.authenticate();
    await client.authenticate();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("sans credentials lève InpiCredentialsMissingError", () => {
    expect(() => new InpiClient({ login: "", password: "" })).toThrow(
      InpiCredentialsMissingError
    );
  });

  it("searchMarques retourne les résultats parsés", async () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL("../fixtures/inpi/search-apexleaf-class25.json", import.meta.url),
        "utf8"
      )
    );
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/services/sso/login")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 3600 }));
      }
      return new Response(JSON.stringify(fixture));
    });
    const client = new InpiClient({
      login: "u",
      password: "p",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const out = await client.searchMarques({ query: "APEXLEAF", classes: ["25"] });
    expect(out.resultats.length).toBeGreaterThan(0);
    expect(out.total).toBeGreaterThanOrEqual(out.resultats.length);
  });

  it("getMarqueDetails parse les oppositions et l'historique", async () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL("../fixtures/inpi/details-marque-fr-1234567.json", import.meta.url),
        "utf8"
      )
    );
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/services/sso/login")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 3600 }));
      }
      return new Response(JSON.stringify(fixture));
    });
    const client = new InpiClient({
      login: "u",
      password: "p",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const out = await client.getMarqueDetails("FR1234567");
    expect(out.numero).toBe(fixture.numero);
    expect(out.oppositions.length).toBeGreaterThan(0);
    expect(out.historique.length).toBeGreaterThan(0);
  });
});

describe("InpiPublicationRecenteSchema", () => {
  it("parse une publication récente avec dateOpposition_limite calculée", () => {
    const raw = {
      numero: "FR4123456",
      signe: "APEXLEAVE",
      classes: ["25"],
      titulaire: "Concurrent SAS",
      datePublication: "2026-05-09",
      dateOpposition_limite: "2026-07-09",
      urlSource: "https://data.inpi.fr/marques/FR4123456",
    };
    const parsed = InpiPublicationRecenteSchema.parse(raw);
    expect(parsed.numero).toBe("FR4123456");
    expect(parsed.dateOpposition_limite).toBe("2026-07-09");
  });
});

describe("InpiClient.marquesPublicationsRecentes", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-09T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calcule la fenêtre + appelle l'endpoint avec les bons params", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/services/sso/login")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 3600 }));
      }
      expect(url).toContain("/services/marques/publications");
      expect(url).toContain("since=2026-05-11");
      expect(url).toContain("classes=25");
      return new Response(JSON.stringify({
        publications: [{
          numero: "FR4123456",
          signe: "APEXLEAVE",
          classes: ["25"],
          titulaire: "Concurrent SAS",
          datePublication: "2026-05-11",
          dateOpposition_limite: "2026-07-11",
          urlSource: "https://data.inpi.fr/marques/FR4123456",
        }],
        total: 1,
        dateMaxBase: "2026-06-09",
      }));
    });
    const client = new InpiClient({
      login: "u", password: "p",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const out = await client.marquesPublicationsRecentes({
      since: "2026-05-11",
      classes: ["25"],
    });
    expect(out.publications).toHaveLength(1);
    expect(out.publications[0].dateOpposition_limite).toBe("2026-07-11");
  });

  it("refuse une fenêtre > 30 jours", async () => {
    const client = new InpiClient({
      login: "u", password: "p",
      fetch: vi.fn() as unknown as typeof fetch,
    });
    await expect(
      client.marquesPublicationsRecentes({ since: "2026-05-09" })
    ).rejects.toThrow(/fenêtre|30 jours/);
  });
});
