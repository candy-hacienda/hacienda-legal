import type { JudilibreDecision, JudilibreSearchResponse } from "./schemas.js";

const MAX_DECISION_TEXT_CHARS = 6000;
const MAX_SEARCH_EXCERPT_CHARS = 700;

export function judilibreDecisionUrl(id: string): string {
  return `https://www.courdecassation.fr/decision/${encodeURIComponent(id)}`;
}

function asRecord(value: JudilibreDecision): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function formatPublication(value: JudilibreDecision["publication"]): string | undefined {
  if (Array.isArray(value)) {
    const filtered = value.filter((item) => typeof item === "string" && item.trim());
    return filtered.length ? filtered.join(", ") : undefined;
  }

  return optionalString(value);
}

function truncateText(text: string, maxChars: number, suffix: string): string {
  return text.length > maxChars ? `${text.slice(0, maxChars).trimEnd()}\n\n${suffix}` : text;
}

/** Valeurs de la taxonomie Judilibre (`/taxonomy?id=jurisdiction|chamber`), relevées le 2026-10-06. */
const JURISDICTION_LABELS: Record<string, string> = {
  cc: "Cour de cassation",
  ca: "Cour d'appel",
  tj: "Tribunal judiciaire",
  tcom: "Tribunal de commerce",
};

const CHAMBER_LABELS: Record<string, string> = {
  pl: "Assemblée plénière",
  mi: "Chambre mixte",
  civ1: "Première chambre civile",
  civ2: "Deuxième chambre civile",
  civ3: "Troisième chambre civile",
  comm: "Chambre commerciale",
  soc: "Chambre sociale",
  cr: "Chambre criminelle",
  creun: "Chambres réunies",
  ordo: "Première présidence (ordonnance)",
  allciv: "Toutes chambres civiles",
  other: "Autre",
};

const withLabel = (value: string, labels: Record<string, string>) =>
  labels[value] ? `${labels[value]} (${value})` : value;

/**
 * Date de la décision (AAAA-MM-JJ). `/search` ne renvoie que `decision_date` ;
 * `/decision` renvoie aussi `decision_datetime`, en UTC : une décision du
 * 29 septembre y apparaît « 2021-09-28T23:00:00.000Z ». On retient donc
 * `decision_date`, et à défaut la date de `decision_datetime` à l'heure de Paris.
 */
function decisionDate(decision: JudilibreDecision): string | undefined {
  const date = optionalString(asRecord(decision).decision_date);
  if (date) return date.slice(0, 10);
  const datetime = optionalString(decision.decision_datetime);
  if (!datetime) return undefined;
  // Sans « Z », new Date() lirait l'heure dans le fuseau du serveur : date décalée.
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?Z$/.test(datetime)) return datetime.slice(0, 10);
  const parsed = new Date(datetime);
  if (Number.isNaN(parsed.getTime())) return datetime.slice(0, 10);
  return parsed.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
}

function metadataFor(decision: JudilibreDecision): string[] {
  const extra = asRecord(decision);
  const metadata: string[] = [];

  const date = decisionDate(decision);
  if (date) metadata.push(`Date : ${date}`);
  if (decision.jurisdiction) metadata.push(`Juridiction : ${withLabel(decision.jurisdiction, JURISDICTION_LABELS)}`);
  if (decision.chamber) metadata.push(`Chambre : ${withLabel(decision.chamber, CHAMBER_LABELS)}`);
  if (optionalString(extra.formation)) metadata.push(`Formation : ${optionalString(extra.formation)}`);
  if (decision.number) metadata.push(`Numéro : ${decision.number}`);
  if (decision.solution) metadata.push(`Solution : ${decision.solution}`);
  const publication = formatPublication(decision.publication);
  if (publication) metadata.push(`Publication : ${publication}`);
  if (optionalString(extra.ecli)) metadata.push(`ECLI : ${optionalString(extra.ecli)}`);

  return metadata;
}

function decisionId(decision: JudilibreDecision, fallback: string): string {
  return decision.id?.trim() || fallback;
}

export function formatJudilibreSearch(response: JudilibreSearchResponse, query: string): string {
  const lines: string[] = [];
  lines.push(`# Judilibre — résultats pour "${query}"`);
  lines.push("");
  lines.push(`Total : ${response.total ?? response.results.length}`);
  if (response.page !== undefined || response.page_size !== undefined) {
    const page = response.page !== undefined ? response.page : "?";
    const pageSize = response.page_size !== undefined ? response.page_size : "?";
    lines.push(`Page : ${page} · Taille : ${pageSize}`);
  }
  lines.push("");

  if (!response.results.length) {
    lines.push("Aucun résultat.");
  }

  response.results.forEach((decision, index) => {
    const id = decisionId(decision, "(sans identifiant)");
    lines.push(`## ${index + 1}. ${id}`);
    const metadata = metadataFor(decision);
    if (metadata.length) lines.push(`_${metadata.join(" · ")}_`);

    const excerptSource = decision.summary || decision.text;
    if (excerptSource) {
      lines.push("");
      lines.push(truncateText(excerptSource, MAX_SEARCH_EXCERPT_CHARS, "...(extrait tronqué)"));
    }

    lines.push("");
    lines.push(`[Cour de cassation](${judilibreDecisionUrl(id)})`);
    lines.push("");
  });

  lines.push(`Consultation : ${new Date().toISOString()}`);
  return lines.join("\n").trimEnd();
}

export function formatJudilibreDecision(decision: JudilibreDecision, idInput: string): string {
  const id = decisionId(decision, idInput);
  const lines: string[] = [];
  lines.push(`# Judilibre — décision ${id}`);
  const metadata = metadataFor(decision);
  if (metadata.length) {
    lines.push("");
    lines.push(`_${metadata.join(" · ")}_`);
  }

  if (decision.summary) {
    lines.push("");
    lines.push("## Résumé");
    lines.push(decision.summary);
  }

  if (decision.text) {
    lines.push("");
    lines.push("## Texte");
    lines.push(
      truncateText(
        decision.text,
        MAX_DECISION_TEXT_CHARS,
        "...(texte tronqué - utilisez le lien Cour de cassation pour le texte intégral)",
      ),
    );
  }

  lines.push("");
  lines.push(`[Cour de cassation](${judilibreDecisionUrl(id)})`);
  lines.push(`Consultation : ${new Date().toISOString()}`);

  return lines.join("\n");
}
