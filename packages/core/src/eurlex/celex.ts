export type EurlexLanguage = "FRA" | "ENG" | "DEU";

const CELEX_PATTERN = /^[0-9][0-9A-Z]{4,}(?:-[0-9]{8})?$/u;
const LANGUAGE_PATH: Record<EurlexLanguage, string> = { FRA: "FR", ENG: "EN", DEU: "DE" };

export class EurlexCelexError extends Error {
  constructor(input: string) {
    super(`CELEX invalide: ${input}. Exemple attendu: 32024R1689, 32016R0679 ou 62014CJ0131.`);
    this.name = "EurlexCelexError";
  }
}

export function normalizeCelexId(input: string): string {
  return input.trim().toUpperCase();
}

export function assertCelexId(input: string): string {
  const celexId = normalizeCelexId(input);
  if (!CELEX_PATTERN.test(celexId)) {
    throw new EurlexCelexError(input);
  }
  return celexId;
}

export function eurlexDocumentUrl(input: string, language: EurlexLanguage = "FRA"): string {
  const celexId = assertCelexId(input);
  return `https://eur-lex.europa.eu/legal-content/${LANGUAGE_PATH[language]}/TXT/?uri=CELEX:${celexId}`;
}

export function publicationsCelexUrl(input: string): string {
  return `https://publications.europa.eu/resource/celex/${assertCelexId(input)}`;
}
