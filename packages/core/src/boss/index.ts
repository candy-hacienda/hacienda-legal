import type { SourceSearchHit } from "../sources/types.js";
import type { BossDocument } from "./parser.js";

export interface BossSearchIndex {
  documents: BossDocument[];
}

export interface BossSearchArgs {
  query: string;
  rubrique?: string;
  pageSize?: number;
}

export function buildBossSearchIndex(documents: BossDocument[]): BossSearchIndex {
  return { documents: [...documents] };
}

export function searchBossIndex(index: BossSearchIndex, args: BossSearchArgs): SourceSearchHit[] {
  const queryTokens = tokenize(args.query);
  if (queryTokens.length === 0) return [];

  const rubrique = args.rubrique ? normalizeSearchText(args.rubrique) : undefined;
  const pageSize = args.pageSize ?? 10;

  return index.documents
    .filter((document) => !rubrique || normalizeSearchText(document.breadcrumb.join(" ")).includes(rubrique))
    .map((document) => ({ document, score: scoreDocument(document, queryTokens) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.document.title.localeCompare(right.document.title, "fr"))
    .slice(0, pageSize)
    .map(({ document, score }) => ({
      source: "BOSS",
      id: document.id,
      title: document.title,
      url: document.canonicalUrl,
      retrievedAt: document.retrievedAt,
      excerpt: document.text.slice(0, 400),
      score,
    }));
}

function scoreDocument(document: BossDocument, queryTokens: string[]): number {
  const haystack = tokenize([document.title, document.breadcrumb.join(" "), document.text].join(" "));
  return queryTokens.reduce((score, token) => score + haystack.filter((candidate) => candidate === token).length, 0);
}

function tokenize(value: string): string[] {
  return normalizeSearchText(value)
    .split(/[^a-z0-9]+/u)
    .filter(Boolean);
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}
