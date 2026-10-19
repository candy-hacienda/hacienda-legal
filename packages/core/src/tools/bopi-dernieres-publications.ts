import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BopiClient, BopiUnavailableError } from "../sources/bopi.js";

export const BopiDernieresPublicationsArgsSchema = z.object({
  type: z.enum(["depots", "renouvellements", "decisions_opposition", "tous"]).default("tous"),
  motCle: z.string().optional(),
  classes: z.array(z.string()).optional(),
  semaines: z.number().int().min(1).max(8).default(2),
});
export type BopiDernieresPublicationsArgs = z.infer<typeof BopiDernieresPublicationsArgsSchema>;

export async function callBopiDernieresPublications(
  args: BopiDernieresPublicationsArgs,
  client: BopiClient = new BopiClient()
): Promise<string> {
  try {
    const res = await client.dernieresPublications({
      type: args.type, motCle: args.motCle, classes: args.classes, semaines: args.semaines,
    });
    return `# BOPI semaine ${res.semaine} [BOPI INPI]\n\nPublications : ${res.cumul}`;
  } catch (e) {
    if (e instanceof BopiUnavailableError) {
      return [
        `**${e.message}**`,
        ``,
        `Action V1.0 : consulter directement le BOPI hebdomadaire`,
        `https://bopi.inpi.fr — publié chaque vendredi`,
        ``,
        `_Le parser BOPI sera implémenté en V1.1 (agent \`bopi-watcher\`)._`,
      ].join("\n");
    }
    throw e;
  }
}

export function registerBopiDernieresPublications(server: McpServer): void {
  server.tool(
    "bopi_dernieres_publications",
    BopiDernieresPublicationsArgsSchema.shape,
    async (raw) => ({
      content: [{
        type: "text",
        text: await callBopiDernieresPublications(BopiDernieresPublicationsArgsSchema.parse(raw)),
      }],
    })
  );
}
