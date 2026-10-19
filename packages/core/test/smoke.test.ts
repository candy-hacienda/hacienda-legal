import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { afterEach, describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(currentDir, "../../..");
const serverPath = resolve(root, "plugins/hacienda-droit-affaires/mcp-server/dist/index.js");

const expectedTools = [
  "bodacc_by_siren",
  "bodacc_procedures",
  "bofip_consulter",
  "bofip_rechercher",
  "boss_get_document",
  "boss_recherche",
  "boss_status",
  "company_full_profile",
  "eurlex_citations",
  "eurlex_consolidated",
  "eurlex_consulter",
  "eurlex_eurovoc",
  "eurlex_formats",
  "eurlex_metadata",
  "eurlex_recherche",
  "eurlex_status",
  "eurlex_versions",
  "judilibre_get_decision",
  "judilibre_recherche",
  "judilibre_status",
  "legifrance_get_article",
  "legifrance_get_circulaire",
  "legifrance_get_code",
  "legifrance_get_jorf",
  "legifrance_get_jurisprudence",
  "legifrance_get_loda",
  "legifrance_recherche",
  "legifrance_rechercher",
  "legifrance_suggest",
  "piste_status"
];

describe("hacienda droit affaires mcp", () => {
  let client: Client | undefined;

  afterEach(async () => {
    await client?.close();
    client = undefined;
  });

  it("expose les tools attendus", async () => {
    client = new Client({
      name: "hacienda-smoke-test",
      version: "0.1.0"
    });

    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [serverPath],
      cwd: root,
      stderr: "pipe"
    });

    await client.connect(transport);
    const result = await client.listTools();
    const names = result.tools.map((tool) => tool.name).sort();

    expect(names).toEqual([...expectedTools].sort());
  }, 15_000);
});
