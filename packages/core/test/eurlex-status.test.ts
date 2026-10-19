import { describe, expect, it } from "vitest";
import { defaultEurlexStatusUnavailable, probeEurlexStatusFromResponses } from "../src/eurlex/status.js";

describe("EUR-Lex status diagnostics", () => {
  it("reports ok when both probes pass", () => {
    expect(
      probeEurlexStatusFromResponses({
        sparql: { statusCode: 200 },
        cellar: { statusCode: 200, contentType: "application/xhtml+xml" },
      }),
    ).toMatchObject({ network: "ok", canSearch: true, canReadDocument: true, recommendation: "utilisable" });
  });

  it("reports partial when only search passes", () => {
    expect(
      probeEurlexStatusFromResponses({
        sparql: { statusCode: 200 },
        cellar: { statusCode: 503, error: "still down" },
      }),
    ).toMatchObject({ network: "partiel", canSearch: true, canReadDocument: false, recommendation: "consultation à revoir" });
  });

  it("reports error when no probe passes", () => {
    expect(
      probeEurlexStatusFromResponses({
        sparql: { statusCode: 500, error: "sparql down" },
        cellar: { error: "socket closed" },
      }),
    ).toMatchObject({ network: "erreur", canSearch: false, canReadDocument: false });
  });

  it("builds an unavailable status from an exception", () => {
    expect(defaultEurlexStatusUnavailable(new Error("socket closed"))).toMatchObject({
      network: "erreur",
      canSearch: false,
      canReadDocument: false,
      lastError: "socket closed",
    });
  });
});
