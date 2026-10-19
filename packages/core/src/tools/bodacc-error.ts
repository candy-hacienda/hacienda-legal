import { BodaccUnavailableError } from "../sources/bodacc.js";

/**
 * Résultat d'outil quand le BODACC n'a pas répondu. Le texte interdit
 * explicitement de lire cet échec comme « aucune procédure » : sur un délai de
 * forclusion ou un arrêt des poursuites, la différence est de nature juridique.
 */
export function bodaccUnavailableResult(err: unknown) {
  const detail = err instanceof BodaccUnavailableError ? err.message : String(err);
  return {
    isError: true as const,
    content: [
      {
        type: "text" as const,
        text:
          `${detail}. Ce n'est pas une absence de procédure : le BODACC n'a pas pu être consulté. ` +
          "Ne pas conclure qu'aucune procédure collective n'est ouverte ; vérifier sur bodacc.fr " +
          "et marquer l'information `[à vérifier]`.",
      },
    ],
  };
}
