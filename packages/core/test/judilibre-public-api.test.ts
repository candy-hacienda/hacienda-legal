import { describe, expect, it } from "vitest";
import {
  JudilibreClient,
  JudilibreDecisionSummarySchema,
  JudilibreSearchResponseSchema,
  callJudilibreStatus,
  formatJudilibreDecision,
  formatJudilibreSearch,
  judilibreDecisionUrl,
  loadJudilibreConfig,
  registerJudilibreTools,
} from "../src/index.js";

describe("Judilibre public API", () => {
  it("exports config, client, and schemas from the package root", () => {
    expect(typeof loadJudilibreConfig).toBe("function");
    expect(typeof JudilibreClient).toBe("function");
    expect(typeof judilibreDecisionUrl).toBe("function");
    expect(typeof formatJudilibreSearch).toBe("function");
    expect(typeof formatJudilibreDecision).toBe("function");
    expect(typeof callJudilibreStatus).toBe("function");
    expect(typeof registerJudilibreTools).toBe("function");
    expect(JudilibreSearchResponseSchema.parse({ results: [], total: 0 })).toEqual({
      results: [],
      total: 0,
    });
    expect(JudilibreDecisionSummarySchema.parse({ id: "abc" })).toEqual({ id: "abc" });
  });
});
