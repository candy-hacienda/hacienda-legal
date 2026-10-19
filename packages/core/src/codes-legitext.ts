/**
 * Mapping ergonomique des noms de codes français vers leur LEGITEXT.
 * Les IDs LEGITEXT sont stables (changements rares, type "abrogation du code").
 *
 * Si un code manque, l'utilisateur peut soit passer directement le LEGITEXT,
 * soit utiliser `legifrance_recherche` pour le retrouver.
 */
export const COMMON_CODES_LEGITEXT: Record<string, string> = {
  // Codes civils & procédure
  "code civil": "LEGITEXT000006070721",
  "code de procédure civile": "LEGITEXT000006070716",
  "code des procédures civiles d'exécution": "LEGITEXT000025024948",
  // Pénal
  "code pénal": "LEGITEXT000006070719",
  "code de procédure pénale": "LEGITEXT000006071154",
  // Commerce / travail
  "code de commerce": "LEGITEXT000005634379",
  "code du travail": "LEGITEXT000006072050",
  // Fiscal
  "code général des impôts": "LEGITEXT000006069577",
  cgi: "LEGITEXT000006069577",
  "livre des procédures fiscales": "LEGITEXT000006069583",
  lpf: "LEGITEXT000006069583",
  // Conso / monétaire
  "code de la consommation": "LEGITEXT000006069565",
  "code monétaire et financier": "LEGITEXT000006072026",
  // Santé / sécu
  "code de la santé publique": "LEGITEXT000006072665",
  "code de la sécurité sociale": "LEGITEXT000006073189",
  // PI / assurances
  "code de la propriété intellectuelle": "LEGITEXT000006069414",
  "code des assurances": "LEGITEXT000006073984",
  // Rural / urbanisme / environnement / éducation
  "code rural et de la pêche maritime": "LEGITEXT000006071367",
  "code de l'urbanisme": "LEGITEXT000006074075",
  "code de l'environnement": "LEGITEXT000006074220",
  "code de l'éducation": "LEGITEXT000006071191",
  // Routes / transports
  "code de la route": "LEGITEXT000006074228",
  "code des transports": "LEGITEXT000023086525",
  // Administration
  "code des relations entre le public et l'administration": "LEGITEXT000031366350",
  "code de justice administrative": "LEGITEXT000006070933",
};

/** Resolve a code name (case-insensitive, accent-tolerant) to its LEGITEXT id. */
export function resolveLegitext(codeName: string): string | undefined {
  const normalized = codeName.trim().toLowerCase();
  if (COMMON_CODES_LEGITEXT[normalized]) return COMMON_CODES_LEGITEXT[normalized];
  // Allow user to pass the LEGITEXT directly
  if (/^LEGITEXT\d+$/i.test(codeName.trim())) return codeName.trim().toUpperCase();
  return undefined;
}

/**
 * Normalize an article number to the form Légifrance expects (`L611-3`, `1240`).
 * Models and users usually write `L. 611-3`, `art. L.611-3` or `l 611-3`,
 * which `getArticleWithIdAndNum` rejects as "article introuvable".
 */
export function normalizeArticleNum(num: string): string {
  const withoutArticle = num.trim().replace(/^art(?:icle)?\.?\s+/i, "");
  const match = /^((?:[A-Za-z]\.?){1,3})(\*?)\s*(\d.*)$/.exec(withoutArticle);
  if (!match) return withoutArticle;
  const [, part = "", star = "", rest = ""] = match;
  return `${part.replace(/\./g, "").toUpperCase()}${star}${rest.replace(/\s+/g, "")}`;
}

/**
 * Nom officiel d'un code tel que l'attend le filtre `NOM_CODE` / `TEXT_NOM_CODE` de
 * `/search`, qui est sensible à la casse : « Code de commerce » donne 1 résultat,
 * « code de commerce » ou « CGI » aucun, sans erreur. Accepte nom (toute casse),
 * alias (CGI, LPF) et LEGITEXT ; un nom inconnu est renvoyé tel quel.
 */
export function canonicalCodeName(code: string): string {
  const legitext = resolveLegitext(code);
  if (!legitext) return code.trim();
  const longName = Object.entries(COMMON_CODES_LEGITEXT).find(([name, id]) => id === legitext && name.includes(" "))?.[0];
  return longName ? longName.charAt(0).toUpperCase() + longName.slice(1) : code.trim();
}

export function listKnownCodes(): string[] {
  return Object.keys(COMMON_CODES_LEGITEXT);
}
