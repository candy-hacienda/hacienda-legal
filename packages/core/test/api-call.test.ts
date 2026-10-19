import { describe, expect, it, vi } from "vitest";
import { callLegifranceApiExpert } from "../src/tools/api-call.js";
import type { LegifranceRouteClient } from "../src/legifrance/route-client.js";

function textFrom(result: { content: { type: "text"; text: string }[] }): string {
  return result.content[0]!.text;
}

describe("callLegifranceApiExpert", () => {
  it("returns an MCP error for an unknown endpoint", async () => {
    const route = {
      call: vi.fn(),
    } as unknown as LegifranceRouteClient;

    const result = await callLegifranceApiExpert(route, { endpoint: "unknown.endpoint" });

    expect(result.isError).toBe(true);
    expect(textFrom(result)).toMatch(/Unknown Legifrance endpoint key/);
    expect(route.call).not.toHaveBeenCalled();
  });

  it("passes body and bypassCache to route.call for consult.getArticle", async () => {
    const route = {
      call: vi.fn(async () => ({ article: { id: "LEGIARTI000006419320" } })),
    } as unknown as LegifranceRouteClient;
    const body = { id: "LEGIARTI000006419320" };

    const result = await callLegifranceApiExpert(route, {
      endpoint: "consult.getArticle",
      body,
      bypassCache: true,
    });

    expect(result.isError).toBeUndefined();
    expect(route.call).toHaveBeenCalledWith("consult.getArticle", {
      body,
      bypassCache: true,
      pathParams: undefined,
      query: undefined,
    });
    expect(JSON.parse(textFrom(result))).toEqual({
      endpoint: {
        key: "consult.getArticle",
        path: "/consult/getArticle",
        status: "supported",
      },
      data: { article: { id: "LEGIARTI000006419320" } },
    });
  });

  it("accepts a registered endpoint path and calls route.call with the endpoint key", async () => {
    const route = {
      call: vi.fn(async () => ({ article: { id: "LEGIARTI000006419320" } })),
    } as unknown as LegifranceRouteClient;
    const body = { id: "LEGIARTI000006419320" };

    const result = await callLegifranceApiExpert(route, {
      endpoint: "/consult/getArticle",
      body,
    });

    expect(result.isError).toBeUndefined();
    expect(route.call).toHaveBeenCalledWith("consult.getArticle", {
      body,
      bypassCache: undefined,
      pathParams: undefined,
      query: undefined,
    });
    expect(JSON.parse(textFrom(result))).toEqual({
      endpoint: {
        key: "consult.getArticle",
        path: "/consult/getArticle",
        status: "supported",
      },
      data: { article: { id: "LEGIARTI000006419320" } },
    });
  });

  it("rejects a provided method when it does not match the registry", async () => {
    const route = {
      call: vi.fn(),
    } as unknown as LegifranceRouteClient;

    const result = await callLegifranceApiExpert(route, {
      endpoint: "/consult/getArticle",
      method: "GET",
      body: { id: "LEGIARTI000006419320" },
    });

    expect(result.isError).toBe(true);
    expect(textFrom(result)).toMatch(/Method mismatch/);
    expect(route.call).not.toHaveBeenCalled();
  });

  it("accepts raw and rawOutput flags explicitly while returning the same JSON envelope", async () => {
    const route = {
      call: vi.fn(async () => ({ article: { id: "LEGIARTI000006419320" } })),
    } as unknown as LegifranceRouteClient;

    const result = await callLegifranceApiExpert(route, {
      endpoint: "consult.getArticle",
      method: "POST",
      raw: true,
      rawOutput: true,
      body: { id: "LEGIARTI000006419320" },
    });

    expect(result.isError).toBeUndefined();
    expect(route.call).toHaveBeenCalledWith("consult.getArticle", {
      body: { id: "LEGIARTI000006419320" },
      bypassCache: undefined,
      pathParams: undefined,
      query: undefined,
    });
    expect(JSON.parse(textFrom(result))).toEqual({
      endpoint: {
        key: "consult.getArticle",
        path: "/consult/getArticle",
        status: "supported",
      },
      raw: true,
      rawOutput: true,
      data: { article: { id: "LEGIARTI000006419320" } },
    });
  });

  it("passes pathParams to route.call for chrono.hasTextCid", async () => {
    const route = {
      call: vi.fn(async () => ({ exists: true })),
    } as unknown as LegifranceRouteClient;
    const pathParams = { textCid: "LEGITEXT000006070721" };

    const result = await callLegifranceApiExpert(route, {
      endpoint: "chrono.hasTextCid",
      pathParams,
    });

    expect(result.isError).toBeUndefined();
    expect(route.call).toHaveBeenCalledWith("chrono.hasTextCid", {
      body: undefined,
      bypassCache: undefined,
      pathParams,
      query: undefined,
    });
    expect(JSON.parse(textFrom(result))).toEqual({
      endpoint: {
        key: "chrono.hasTextCid",
        path: "/chrono/textCid/{textCid}",
        status: "experimental",
      },
      data: { exists: true },
    });
  });
});
