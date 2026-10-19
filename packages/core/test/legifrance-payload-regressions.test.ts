import { describe, expect, it, vi } from "vitest";
import { registerGetCode } from "../src/tools/get-code.js";
import { registerGetJorf } from "../src/tools/get-jorf.js";

class FakeHttp {
  calls: { path: string; body: unknown }[] = [];

  constructor(private readonly response: unknown) {}

  async post(path: string, body: unknown): Promise<unknown> {
    this.calls.push({ path, body });
    return this.response;
  }
}

describe("Légifrance payload regressions from Swagger/live PISTE", () => {
  it("uses the documented table-of-contents endpoint for code summaries", async () => {
    const http = new FakeHttp({
      title: "Code civil",
      nature: "CODE",
      sections: [],
      articles: [],
    });
    const server = {
      registerTool: vi.fn(),
    };
    registerGetCode(server as never, http as never);
    const handler = server.registerTool.mock.calls[0]![2] as (args: never) => Promise<unknown>;

    await handler({ code: "Code civil", date: "2024-01-01" } as never);

    expect(http.calls).toEqual([
      {
        path: "/consult/legi/tableMatieres",
        body: {
          textId: "LEGITEXT000006070721",
          date: "2024-01-01",
          nature: "CODE",
        },
      },
    ]);
  });

  it("uses the legacy code table-of-contents endpoint only for section summaries", async () => {
    const http = new FakeHttp({
      title: "Code civil",
      nature: "CODE",
      sections: [],
      articles: [],
    });
    const server = {
      registerTool: vi.fn(),
    };
    registerGetCode(server as never, http as never);
    const handler = server.registerTool.mock.calls[0]![2] as (args: never) => Promise<unknown>;

    await handler({ code: "Code civil", date: "2024-01-01", sectionId: "LEGISCTA000006090271" } as never);

    expect(http.calls).toEqual([
      {
        path: "/consult/code/tableMatieres",
        body: {
          textId: "LEGITEXT000006070721",
          date: "2024-01-01",
          sctCid: "LEGISCTA000006090271",
        },
      },
    ]);
  });

  it("strips Légifrance search date suffixes before consulting JORF texts", async () => {
    const http = new FakeHttp({
      title: "Documents déposés",
      id: "JORFTEXT000054101509_01-01-2999",
      articles: [],
      sections: [],
    });
    const server = {
      registerTool: vi.fn(),
    };
    registerGetJorf(server as never, http as never);
    const handler = server.registerTool.mock.calls[0]![2] as (args: never) => Promise<unknown>;

    await handler({ textCid: "JORFTEXT000054101509_01-01-2999" } as never);

    expect(http.calls).toEqual([
      {
        path: "/consult/jorf",
        body: { textCid: "JORFTEXT000054101509" },
      },
    ]);
  });

  it("keeps bare JORFTEXT ids unchanged", async () => {
    const http = new FakeHttp({
      title: "Texte JORF",
      articles: [],
      sections: [],
    });
    const server = {
      registerTool: vi.fn(),
    };
    registerGetJorf(server as never, http as never);
    const handler = server.registerTool.mock.calls[0]![2] as (args: never) => Promise<unknown>;

    await handler({ textCid: "JORFTEXT000033736934" } as never);

    expect(http.calls[0]).toEqual({
      path: "/consult/jorf",
      body: { textCid: "JORFTEXT000033736934" },
    });
  });
});
