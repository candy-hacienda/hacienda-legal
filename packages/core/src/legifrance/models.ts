export type LegalSource =
  | "ACCO"
  | "BOCC"
  | "BODMR"
  | "BOFiP"
  | "CETAT"
  | "CIRC"
  | "CNIL"
  | "CODE"
  | "CONSTIT"
  | "JORF"
  | "JURI"
  | "JUFI"
  | "KALI"
  | "LEGI"
  | "LODA"
  | "PARLIAMENTARY";

export interface LegalSearchResult {
  id?: string;
  cid?: string;
  source: LegalSource;
  title?: string;
  date?: string;
  nature?: string;
  status?: string;
  officialUrl?: string;
  snippets: string[];
}

export interface LegalDocument {
  id: string;
  cid?: string;
  source: LegalSource;
  title?: string;
  date?: string;
  nature?: string;
  status?: string;
  officialUrl?: string;
  text?: string;
  raw?: unknown;
}

export interface LegalArticle extends LegalDocument {
  articleNumber?: string;
  parentTextId?: string;
  sectionTitle?: string;
  startDate?: string;
  endDate?: string;
}

export interface LegalVersion {
  id: string;
  cid?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  text?: string;
  officialUrl?: string;
}

export interface LegalDiff {
  from: LegalVersion;
  to: LegalVersion;
  added: string[];
  removed: string[];
  changed: string[];
  summary: string;
}

export interface LegalLink {
  type: "related" | "concordance" | "service-public" | "parent" | "same-number" | "official";
  title?: string;
  id?: string;
  url?: string;
}
