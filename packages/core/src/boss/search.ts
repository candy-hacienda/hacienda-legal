import type { SourceSearchHit } from "../sources/types.js";
import {
  BOSS_ORIGIN,
  fetchBossText,
  type BossRequestOptions,
  type BossTextResponse,
} from "./client.js";

export interface BossOfficialSearchArgs {
  query: string;
  rubrique?: string;
  pageSize?: number;
}

export interface BossSearchParseArgs extends BossOfficialSearchArgs {
  retrievedAt?: string;
}

export interface BossOfficialSearchResponse {
  searchUrl: string;
  hits: SourceSearchHit[];
}

export type BossSearchFetcher = (url: string, options?: BossRequestOptions) => Promise<BossTextResponse>;

export function buildBossOfficialSearchUrl(query: string): URL {
  const url = new URL("/portail/accueil/resultats-de-votre-recherche.html", BOSS_ORIGIN);
  const params = new URLSearchParams({
    jcrMethodToCall: "get",
    src_originSiteKey: "siteboss",
    "src_terms[0].term": query,
    "src_terms[0].applyFilter": "true",
    "src_terms[0].match": "all_words",
    "src_terms[0].fields.siteContent": "true",
    "src_terms[0].fields.tags": "true",
    "src_terms[0].fields.files": "true",
    "src_sites.values": "siteboss",
    "src_sitesForReferences.values": "systemsite",
    "src_languages.values": "fr",
  });

  url.search = params.toString();
  return url;
}

export async function searchBossOfficial(
  args: BossOfficialSearchArgs,
  fetcher: BossSearchFetcher = fetchBossText,
): Promise<BossOfficialSearchResponse> {
  const searchUrl = buildBossOfficialSearchUrl(args.query);
  const response = await fetcher(`${BOSS_ORIGIN}/portail/accueil/resultats-de-votre-recherche.html`, {
    method: "POST",
    body: buildBossOfficialSearchBody(args.query).toString(),
    contentType: "application/x-www-form-urlencoded",
  });

  if (response.statusCode !== 200) {
    throw new Error(`HTTP ${response.statusCode} pour la recherche BOSS ${response.url}`);
  }

  if (!response.contentType || !/html/i.test(response.contentType)) {
    throw new Error(`Type de contenu BOSS inattendu pour la recherche: ${response.contentType ?? "absent"}`);
  }

  return {
    searchUrl: searchUrl.href,
    hits: parseBossSearchResults(response.text, args),
  };
}

export function buildBossOfficialSearchBody(query: string): URLSearchParams {
  return new URLSearchParams({
    jcrMethodToCall: "get",
    src_originSiteKey: "siteboss",
    "src_terms[0].term": query,
    "src_terms[0].applyFilter": "true",
    "src_terms[0].match": "all_words",
    "src_terms[0].fields.siteContent": "true",
    "src_terms[0].fields.tags": "true",
    "src_terms[0].fields.files": "true",
  });
}

export function parseBossSearchResults(html: string, args: BossSearchParseArgs): SourceSearchHit[] {
  const retrievedAt = args.retrievedAt ?? new Date().toISOString();
  const pageSize = args.pageSize ?? 10;
  const rubrique = args.rubrique ? normalizeSearchText(args.rubrique) : undefined;
  const results: SourceSearchHit[] = [];
  const seenUrls = new Set<string>();
  const anchorPattern = /<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/giu;

  for (const match of html.matchAll(anchorPattern)) {
    const rawHref = decodeHtml(match[2] ?? "");
    const anchorHtml = match[3] ?? "";
    const url = normalizeBossResultUrl(rawHref);

    if (!url || seenUrls.has(url.href) || !isBossSearchResultAnchor(anchorHtml)) {
      continue;
    }

    const anchorText = htmlToText(anchorHtml);
    const title = extractResultTitle(anchorHtml, url, anchorText);
    const excerpt = buildResultExcerpt(anchorHtml, anchorText);

    if (rubrique && !normalizeSearchText(`${title} ${excerpt}`).includes(rubrique)) {
      continue;
    }

    seenUrls.add(url.href);
    results.push({
      source: "BOSS",
      id: `boss:${url.pathname}${url.hash}`,
      title,
      url: url.href,
      retrievedAt,
      excerpt,
      score: Math.max(1, 1000 - results.length),
    });

    if (results.length >= pageSize) {
      break;
    }
  }

  return results;
}

function normalizeBossResultUrl(rawHref: string): URL | undefined {
  if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:")) {
    return undefined;
  }

  let url: URL;
  try {
    url = new URL(rawHref, BOSS_ORIGIN);
  } catch {
    return undefined;
  }

  if (url.protocol !== "https:" || url.hostname !== "boss.gouv.fr") {
    return undefined;
  }

  if (!url.pathname.endsWith(".html") || url.pathname.includes("resultats-de-votre-recherche.html")) {
    return undefined;
  }

  if (url.pathname.startsWith("/portail/sites/siteboss/accueil/")) {
    url.pathname = url.pathname.replace("/portail/sites/siteboss/accueil/", "/portail/accueil/");
  }

  if (!url.pathname.startsWith("/portail/accueil/")) {
    return undefined;
  }

  url.search = "";
  return url;
}

function extractResultTitle(anchorHtml: string, url: URL, anchorText: string): string {
  const titledText = extractTagText(anchorHtml, "h2") || extractClassText(anchorHtml, "titre") || extractClassText(anchorHtml, "title");

  if (titledText) {
    return titledText;
  }

  const slug = (url.hash ? url.hash.slice(1) : url.pathname.split("/").pop() ?? "")
    .replace(/\.html$/i, "")
    .replace(/^titre-/, "")
    .replace(/---/g, " - ")
    .replace(/-/g, " ");
  const title = toTitleCase(slug);

  if (title) {
    return title;
  }

  return anchorText.slice(0, 120) || "Résultat BOSS";
}

function buildResultExcerpt(anchorHtml: string, anchorText: string): string {
  const path = extractClassText(anchorHtml, "filAriane") || extractClassText(anchorHtml, "chemin");
  const excerpt = extractClassText(anchorHtml, "searchHighlightedText") || extractClassText(anchorHtml, "extrait");
  const parts = [path, excerpt].filter((part): part is string => Boolean(part));

  if (parts.length > 0) {
    return parts.join(" - ").slice(0, 500);
  }

  return anchorText.slice(0, 500);
}

function isBossSearchResultAnchor(anchorHtml: string): boolean {
  return /<h2\b|class=["'][^"']*\b(?:filAriane|chemin|extrait|titre|searchHighlightedText)\b/iu.test(anchorHtml);
}

function extractTagText(html: string, tagName: string): string | undefined {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "iu");
  const match = pattern.exec(html);
  const text = match ? htmlToText(match[1] ?? "") : "";

  return text || undefined;
}

function extractClassText(html: string, className: string): string | undefined {
  const pattern = new RegExp(`<[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, "iu");
  const match = pattern.exec(html);
  const text = match ? htmlToText(match[1] ?? "") : "";

  return text || undefined;
}

function htmlToText(html: string): string {
  return decodeHtml(html.replace(/<script\b[\s\S]*?<\/script>/giu, " ").replace(/<style\b[\s\S]*?<\/style>/giu, " ").replace(/<[^>]+>/gu, " "))
    .replace(/\s+/gu, " ")
    .trim();
}

function decodeHtml(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    agrave: "à",
    ccedil: "ç",
    eacute: "é",
    egrave: "è",
    ecirc: "ê",
    gt: ">",
    icirc: "î",
    laquo: "«",
    lt: "<",
    nbsp: " ",
    ocirc: "ô",
    quot: "\"",
    raquo: "»",
    rsquo: "'",
    ugrave: "ù",
  };

  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (entity, code: string) => {
    if (code.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    }

    if (code.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    }

    return namedEntities[code.toLowerCase()] ?? entity;
  });
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/u)
    .filter(Boolean)
    .map((word) => word.slice(0, 1).toLocaleUpperCase("fr-FR") + word.slice(1))
    .join(" ")
    .trim();
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}
