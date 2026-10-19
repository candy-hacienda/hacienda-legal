import { describe, expect, it } from "vitest";
import { BOSS_HOME_URL } from "../src/boss/client.js";
import { defaultBossStatusUnavailable, diagnoseBossProbeError, probeBossStatusFromResponses } from "../src/boss/status.js";

describe("probeBossStatusFromResponses", () => {
  it("recommends usable when robots and homepage are readable HTML", () => {
    const status = probeBossStatusFromResponses({
      homeUrl: BOSS_HOME_URL,
      robots: { statusCode: 200, text: "User-agent: *\nAllow: /" },
      homepage: { statusCode: 200, contentType: "text/html; charset=utf-8", text: "<html><body>BOSS</body></html>" },
      cacheEntries: 2,
    });

    expect(status).toEqual({
      network: "ok",
      robots: { status: "lu" },
      canReadHtml: true,
      cacheEntries: 2,
      lastError: null,
      recommendation: "utilisable",
      homeUrl: BOSS_HOME_URL,
    });
  });

  it("recommends robots unavailable when robots response is missing or empty", () => {
    const status = probeBossStatusFromResponses({
      homeUrl: BOSS_HOME_URL,
      robots: { statusCode: 503, text: "User-agent: *\nAllow: /", error: "robots unavailable" },
      homepage: { statusCode: 200, contentType: "text/html", text: "<html></html>" },
      cacheEntries: 0,
    });

    expect(status.recommendation).toBe("robots indisponible");
    expect(status.network).toBe("ok");
    expect(status.robots.status).toBe("indisponible");
    expect(status.canReadHtml).toBe(true);
    expect(status.lastError).toContain("robots unavailable");
  });

  it("marks robots forbidden when robots disallows the homepage", () => {
    const status = probeBossStatusFromResponses({
      homeUrl: BOSS_HOME_URL,
      robots: { statusCode: 200, text: "User-agent: *\nDisallow: /" },
      homepage: { statusCode: 200, contentType: "text/html", text: "<html></html>" },
      cacheEntries: 0,
    });

    expect(status.recommendation).toBe("crawl bloqué");
    expect(status.network).toBe("ok");
    expect(status.robots.status).toBe("interdit");
    expect(status.lastError).toBeNull();
  });

  it("stores response error text in lastError", () => {
    const status = probeBossStatusFromResponses({
      homeUrl: BOSS_HOME_URL,
      robots: { statusCode: 200, text: "User-agent: *\nAllow: /", error: "robots warning" },
      homepage: { statusCode: 500, contentType: "text/plain", text: "upstream failure", error: "homepage failed" },
      cacheEntries: 1,
    });

    expect(status.lastError).toContain("robots warning");
    expect(status.lastError).toContain("homepage failed");
    expect(status.recommendation).toBe("parser à revoir");
  });

  it("does not recommend usable when robots has a non-2xx error", () => {
    const status = probeBossStatusFromResponses({
      homeUrl: BOSS_HOME_URL,
      robots: { statusCode: 404, text: "not found" },
      homepage: { statusCode: 200, contentType: "text/html", text: "<html></html>" },
      cacheEntries: 0,
    });

    expect(status.robots.status).toBe("erreur");
    expect(status.recommendation).toBe("robots indisponible");
  });
});

describe("diagnoseBossProbeError", () => {
  it("identifies ECONNRESET as a blocked network", () => {
    expect(diagnoseBossProbeError(Object.assign(new Error("read ECONNRESET"), { code: "ECONNRESET" }))).toContain(
      "réseau bloqué",
    );
  });
});

describe("defaultBossStatusUnavailable", () => {
  it("returns a network blocked status for ECONNRESET", () => {
    const status = defaultBossStatusUnavailable(new Error("read ECONNRESET"));

    expect(status).toEqual({
      network: "bloqué",
      robots: { status: "indisponible" },
      canReadHtml: false,
      cacheEntries: 0,
      lastError: expect.stringContaining("réseau bloqué"),
      recommendation: "réseau bloqué",
      homeUrl: BOSS_HOME_URL,
    });
  });
});
