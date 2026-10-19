import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ENDPOINTS,
  getEndpoint,
  listEndpoints,
  nonPingEndpoints,
} from "../src/legifrance/endpoints.js";

const swagger = JSON.parse(
  readFileSync(resolve(__dirname, "../../../docs/Légifrance.json"), "utf-8"),
) as { paths: Record<string, unknown> };

const pingPaths = new Set([
  "/chrono/ping",
  "/consult/ping",
  "/list/ping",
  "/search/ping",
  "/suggest/ping",
]);

function swaggerNonPingPaths(): string[] {
  return Object.keys(swagger.paths)
    .filter((path) => !pingPaths.has(path))
    .sort();
}

describe("Legifrance endpoint registry", () => {
  it("contains every non-ping route from the local Swagger inventory", () => {
    expect(nonPingEndpoints()).toHaveLength(63);
    expect(nonPingEndpoints().map((endpoint) => endpoint.path).sort()).toEqual(swaggerNonPingPaths());
    expect(getEndpoint("chrono.textCid").path).toBe("/chrono/textCid");
    expect(getEndpoint("consult.legiPart").path).toBe("/consult/legiPart");
    expect(getEndpoint("list.bodmr").path).toBe("/list/bodmr");
    expect(getEndpoint("search.canonicalArticleVersion").path).toBe("/search/canonicalArticleVersion");
    expect(getEndpoint("suggest.acco").path).toBe("/suggest/acco");
  });

  it("does not expose ping routes as supported capabilities", () => {
    const paths = listEndpoints().map((endpoint) => endpoint.path);
    expect(paths).not.toContain("/chrono/ping");
    expect(paths).not.toContain("/consult/ping");
    expect(paths).not.toContain("/list/ping");
    expect(paths).not.toContain("/search/ping");
    expect(paths).not.toContain("/suggest/ping");
  });

  it("assigns review-sensitive routes to explicit domains", () => {
    expect(getEndpoint("list.bodmr")).toMatchObject({ domain: "BODMR", family: "list" });
    expect(getEndpoint("consult.legiPart")).toMatchObject({ domain: "LEGI", family: "consult" });
    expect(getEndpoint("list.questionsEcritesParlementaires")).toMatchObject({
      domain: "parliamentary",
      family: "list",
    });
  });

  it("marks diagnostic and expert routes deliberately", () => {
    expect(getEndpoint("misc.commitId").status).toBe("supported");
    expect(getEndpoint("consult.legiTableMatieres").status).toBe("supported");
    expect(getEndpoint("consult.code").status).toBe("expert-only");
    expect(getEndpoint("consult.codeTableMatieres").status).toBe("expert-only");
    expect(ENDPOINTS.every((endpoint) => endpoint.status)).toBe(true);
  });

  it("does not allow returned endpoint objects to mutate the registry", () => {
    const endpoint = getEndpoint("list.bodmr");
    (endpoint as { domain: string }).domain = "system";

    expect(getEndpoint("list.bodmr")).toMatchObject({ domain: "BODMR", family: "list" });
  });
});
