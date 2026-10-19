import type { EurlexLanguage } from "./celex.js";

export type EurlexResourceType = "any" | "regulation" | "directive" | "decision" | "case-law";

export interface EurlexSearchArgs {
  query: string;
  resourceType?: EurlexResourceType;
  language?: EurlexLanguage;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface EurlexSearchResult {
  celexId: string;
  title: string;
  url: string;
  language: EurlexLanguage;
  resourceType: EurlexResourceType;
  date?: string;
}

export interface EurlexSearchResponse {
  query: string;
  retrievedAt: string;
  results: EurlexSearchResult[];
}

export interface EurlexMetadata {
  celexId: string;
  title?: string;
  language: EurlexLanguage;
  url: string;
  dateDocument?: string;
  dateEffect?: string;
  resourceType?: EurlexResourceType;
  authors: string[];
  eurovoc: string[];
  directoryCodes: string[];
  retrievedAt: string;
}

export interface EurlexConsolidatedVersion {
  celexId: string;
  baseCelexId: string;
  dateVersion: string;
  language: EurlexLanguage;
  url: string;
  title?: string;
}

export type EurlexRelationKind = "amends" | "amended_by" | "cites" | "cited_by" | "repeals" | "repealed_by" | "basis";

export interface EurlexRelation {
  kind: EurlexRelationKind;
  sourceCelexId: string;
  targetCelexId: string;
  title?: string;
  date?: string;
  url: string;
}

export interface EurlexEurovocConcept {
  id: string;
  label: string;
  language: EurlexLanguage;
  uri: string;
}

export type EurlexDocumentFormat = "html" | "xhtml" | "xml" | "pdf" | "rdf" | "txt";

export interface EurlexAvailableFormat {
  celexId: string;
  language: EurlexLanguage;
  format: EurlexDocumentFormat;
  url: string;
  contentType?: string;
}

export type EurlexV2CacheNamespace = "consolidated" | "citations" | "eurovoc" | "formats" | "versions";

export function buildEurlexV2CacheKey(namespace: EurlexV2CacheNamespace, parts: readonly string[]): string {
  return ["eurlex", namespace, ...parts.map((part) => part.trim())].join(":");
}
