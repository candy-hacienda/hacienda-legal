import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  InpiBrevetsClient,
  type InpiBrevetSearchResponse,
} from "../sources/inpi-brevets.js";

export const InpiSearchBrevetsArgsSchema = z.object({
  query: z.string().min(1),
  classificationCIB: z.array(z.string()).optional(),
  deposant: z.string().optional(),
  type: z.enum(["FR", "EP", "PCT", "CCP", "tous"]).default("tous"),
  statut: z.enum(["en_vigueur", "demande", "tous"]).default("en_vigueur"),
  limite: z.number().int().min(1).max(100).default(25),
});
export type InpiSearchBrevetsArgs = z.infer<typeof InpiSearchBrevetsArgsSchema>;

function formatSearch(
  res: InpiBrevetSearchResponse,
  args: InpiSearchBrevetsArgs
): string {
  const lignes = res.resultats.map((b) =>
    [
      `- **${b.titre}** [${b.numero}] (${b.type})`,
      `  - classification CIB : ${b.classificationCIB.join(", ") || "_n/a_"}`,
      `  - déposant : ${b.deposant}`,
      `  - statut : ${b.statut}`,
      `  - dépôt : ${b.dateDepot} · publication : ${b.datePublication ?? "_n/a_"} · délivrance : ${b.dateDelivrance ?? "_n/a_"}`,
    ].join("\n")
  );
  return [
    `# Recherche INPI brevets [INPI Brevets]`,
    ``,
    `**Requête :** "${args.query}" · CIB ${args.classificationCIB?.join(", ") ?? "toutes"} · type ${args.type} · statut ${args.statut}`,
    `**Résultats :** ${res.resultats.length} sur ${res.total}`,
    `**Base INPI mise à jour :** ${res.dateBase}`,
    ``,
    ...lignes,
  ].join("\n");
}

export async function callInpiSearchBrevets(
  args: InpiSearchBrevetsArgs,
  client: InpiBrevetsClient | null
): Promise<string> {
  if (!client) {
    return [
      `**INPI not configured** — INPI_DATA_LOGIN / INPI_DATA_PASSWORD absents.`,
      `Action: ajouter ces secrets dans \`~/.config/Hacienda/credentials.json\` ou dans l'environnement du process MCP.`,
    ].join("\n");
  }
  const res = await client.searchBrevets(args);
  return formatSearch(res, args);
}

export function registerInpiSearchBrevets(
  server: McpServer,
  client: InpiBrevetsClient | null
): void {
  server.tool(
    "inpi_search_brevets",
    InpiSearchBrevetsArgsSchema.shape,
    async (raw) => ({
      content: [
        {
          type: "text",
          text: await callInpiSearchBrevets(
            InpiSearchBrevetsArgsSchema.parse(raw),
            client
          ),
        },
      ],
    })
  );
}
