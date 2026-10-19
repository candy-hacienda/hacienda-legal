import type { SourceSearchHit } from "../sources/types.js";
import type { EurlexSearchResult } from "./types.js";

export function mapEurlexSearchHits(results: EurlexSearchResult[], retrievedAt = new Date().toISOString()): SourceSearchHit[] {
  return results.map((result, index) => ({
    source: "EURLEX",
    id: result.celexId,
    title: result.title,
    url: result.url,
    retrievedAt,
    date: result.date || undefined,
    excerpt: `Type EUR-Lex: ${result.resourceType}`,
    score: Math.max(1, results.length - index),
  }));
}
