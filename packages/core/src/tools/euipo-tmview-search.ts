import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EuipoTmviewClient, type EuipoSearchResponse } from "../sources/euipo-tmview.js";

export const EuipoTmviewSearchArgsSchema = z.object({
  query: z.string().min(1),
  classes: z.array(z.string()).optional(),
  offices: z.array(z.string()).optional(),
  statut: z.enum(["en_vigueur", "tous"]).default("en_vigueur"),
  limite: z.number().int().min(1).max(100).default(25),
});
export type EuipoTmviewSearchArgs = z.infer<typeof EuipoTmviewSearchArgsSchema>;

function format(res: EuipoSearchResponse, args: EuipoTmviewSearchArgs): string {
  const lignes = res.resultats.map(m =>
    `- **${m.signe}** [${m.numero}] (${m.office}) · classes ${m.classes.join(", ")} · ${m.statut} · ${m.titulaire}`
  );
  return [
    `# Recherche EUIPO TMview [EUIPO TMview]`,
    ``,
    `**Requête :** "${args.query}" · classes ${args.classes?.join(", ") ?? "toutes"} · statut ${args.statut}`,
    `Offices interrogés : ${res.officesInterroges.join(", ")}`,
    `**Résultats :** ${res.resultats.length} sur ${res.total}`,
    ``,
    ...lignes,
  ].join("\n");
}

export async function callEuipoTmviewSearch(
  args: EuipoTmviewSearchArgs,
  client: EuipoTmviewClient | null
): Promise<string> {
  if (!client) {
    return [
      `**EUIPO not configured** — EUIPO_API_KEY absent.`,
      `Action: ajouter ce secret dans \`~/.config/Hacienda/credentials.json\` ou dans l'environnement du process MCP.`,
    ].join("\n");
  }
  const res = await client.search(args);
  return format(res, args);
}

export function registerEuipoTmviewSearch(
  server: McpServer,
  client: EuipoTmviewClient | null
): void {
  server.tool(
    "euipo_tmview_search",
    EuipoTmviewSearchArgsSchema.shape,
    async (raw) => ({
      content: [{
        type: "text",
        text: await callEuipoTmviewSearch(EuipoTmviewSearchArgsSchema.parse(raw), client),
      }],
    })
  );
}
