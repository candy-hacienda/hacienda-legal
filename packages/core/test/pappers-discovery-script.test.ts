import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const scriptPath = resolve(import.meta.dirname, "../../../scripts/pappers-mcp-discover.mjs");
const script = readFileSync(scriptPath, "utf8");

describe("Pappers MCP discovery script", () => {
  it("uses the MCP Streamable HTTP transport", () => {
    expect(script).toContain("@modelcontextprotocol/sdk/client/streamableHttp.js");
    expect(script).toContain("StreamableHTTPClientTransport");
  });

  it("reads the key from the environment without embedding secrets", () => {
    expect(script).toContain("process.env.PAPPERS_API_KEY");
    expect(script).not.toMatch(/[a-f0-9]{40,}/iu);
  });

  it("supports the shared Hacienda credentials file as a fallback", () => {
    expect(script).toContain("HACIENDA_CREDENTIALS_FILE");
    expect(script).toContain(".config");
    expect(script).toContain("credentials.json");
  });

  it("prints only tool summaries by default", () => {
    expect(script).toContain("inputSchemaSummary");
    expect(script).toContain("required");
    expect(script).toContain("properties");
  });
});
