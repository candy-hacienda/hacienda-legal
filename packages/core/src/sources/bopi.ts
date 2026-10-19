import { z } from "zod";

export class BopiUnavailableError extends Error {
  constructor() {
    super("BOPI: parser PDF/HTML non implémenté en V1.0 — voir https://bopi.inpi.fr");
    this.name = "BopiUnavailableError";
  }
}

export const BopiPublicationSchema = z.object({
  numero: z.string(),
  signe: z.string(),
  type: z.enum(["depot", "renouvellement", "decision_opposition", "autre"]),
  classes: z.array(z.string()),
  dateBopi: z.string(),
  urlSource: z.string(),
});
export type BopiPublication = z.infer<typeof BopiPublicationSchema>;

export interface BopiSearchArgs {
  type: "depots" | "renouvellements" | "decisions_opposition" | "tous";
  motCle?: string;
  classes?: string[];
  semaines?: number;
}

export interface BopiResponse {
  semaine: string;
  publications: BopiPublication[];
  cumul: number;
}

export class BopiClient {
  async dernieresPublications(_args: BopiSearchArgs): Promise<BopiResponse> {
    // V1.0 : pas de parser. Le tool retourne une erreur structurée que le SKILL.md
    // gère via le bucket "Aucune base interrogée" + lien BOPI direct.
    throw new BopiUnavailableError();
  }
}
