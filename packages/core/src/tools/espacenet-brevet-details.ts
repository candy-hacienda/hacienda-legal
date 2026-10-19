import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EspacenetClient } from "../sources/espacenet.js";

export const EspacenetBrevetDetailsArgsSchema = z.object({
  numero: z.string().min(1),
});
export type EspacenetBrevetDetailsArgs = z.infer<
  typeof EspacenetBrevetDetailsArgsSchema
>;

export async function callEspacenetBrevetDetails(
  args: EspacenetBrevetDetailsArgs,
  client: EspacenetClient | null
): Promise<string> {
  if (!client) {
    return [
      `**OEB not configured** — OEB_CONSUMER_KEY / OEB_CONSUMER_SECRET absents.`,
      `Action: ajouter ces secrets dans \`~/.config/Hacienda/credentials.json\` ou dans l'environnement du process MCP.`,
    ].join("\n");
  }
  const b = await client.getBrevetDetails(args.numero);
  return [
    `# Brevet ${b.numero} — "${b.titre}" [OEB Espacenet]`,
    ``,
    `**Type :** ${b.type}`,
    `**Déposant :** ${b.deposant}`,
    `**Classification CIB :** ${b.classificationCIB.join(", ") || "_n/a_"}`,
    `**Publication :** ${b.datePublication} · **Priorité :** ${b.datePriorite ?? "_n/a_"}`,
    `**Lien Espacenet :** ${b.urlEspacenet}`,
    ``,
    `## Abrégé`,
    b.abregeText ?? "_non renseigné_",
  ].join("\n");
}

export function registerEspacenetBrevetDetails(
  server: McpServer,
  client: EspacenetClient | null
): void {
  server.tool(
    "espacenet_brevet_details",
    EspacenetBrevetDetailsArgsSchema.shape,
    async (raw) => ({
      content: [
        {
          type: "text",
          text: await callEspacenetBrevetDetails(
            EspacenetBrevetDetailsArgsSchema.parse(raw),
            client
          ),
        },
      ],
    })
  );
}
