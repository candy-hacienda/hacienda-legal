import { describe, expect, it, vi } from "vitest";
import { fillPathParams, LegifranceRouteClient } from "../src/legifrance/route-client.js";
import type { PisteHttpClient } from "../src/http.js";

function mockHttp(): Pick<PisteHttpClient, "get" | "post"> {
  return {
    get: vi.fn(async () => ({ ok: true })),
    post: vi.fn(async () => ({ ok: true })),
  };
}

describe("fillPathParams", () => {
  it("fills templated path parameters", () => {
    expect(fillPathParams("/chrono/textCid/{textCid}", { textCid: "LEGITEXT000006070721" })).toBe(
      "/chrono/textCid/LEGITEXT000006070721",
    );
  });

  it("throws when a templated path parameter is missing", () => {
    expect(() => fillPathParams("/chrono/textCid/{textCid}", {})).toThrow(/Missing path param textCid/);
  });
});

describe("LegifranceRouteClient", () => {
  it("calls GET endpoints with a filled path and endpoint TTL", async () => {
    const http = mockHttp();
    const client = new LegifranceRouteClient(http as PisteHttpClient);

    await client.call("chrono.hasTextCid", {
      pathParams: { textCid: "LEGITEXT000006070721" },
    });

    expect(http.get).toHaveBeenCalledWith("/chrono/textCid/LEGITEXT000006070721", { ttlMs: 86400000 });
    expect(http.post).not.toHaveBeenCalled();
  });

  it("calls POST endpoints with body, bypass cache option, and endpoint TTL", async () => {
    const http = mockHttp();
    const client = new LegifranceRouteClient(http as PisteHttpClient);
    const body = { id: "LEGIARTI000006419320" };

    await client.call("consult.getArticle", {
      body,
      bypassCache: true,
    });

    expect(http.post).toHaveBeenCalledWith("/consult/getArticle", body, {
      bypassCache: true,
      ttlMs: 86400000,
    });
    expect(http.get).not.toHaveBeenCalled();
  });

  it("calls POST endpoints with an empty object when body is omitted", async () => {
    const http = mockHttp();
    const client = new LegifranceRouteClient(http as PisteHttpClient);

    await client.call("consult.getArticle");

    expect(http.post).toHaveBeenCalledWith("/consult/getArticle", {}, { ttlMs: 86400000 });
    expect(http.get).not.toHaveBeenCalled();
  });

  it("rejects unknown endpoint keys", async () => {
    const client = new LegifranceRouteClient(mockHttp() as PisteHttpClient);

    await expect(client.call("unknown.endpoint")).rejects.toThrow(/Unknown Legifrance endpoint key/);
  });
});
