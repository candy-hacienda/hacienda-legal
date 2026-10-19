export type OfficialSource = "LEGIFRANCE" | "BOFIP" | "JUDILIBRE" | "BOSS" | "EURLEX";

export const OFFICIAL_SOURCES = ["LEGIFRANCE", "BOFIP", "JUDILIBRE", "BOSS", "EURLEX"] as const satisfies readonly OfficialSource[];

export type BusinessDataSource = "PAPPERS";

export const BUSINESS_DATA_SOURCES = ["PAPPERS"] as const satisfies readonly BusinessDataSource[];

export type ProofStatus =
  | "vérifié"
  | "à vérifier"
  | "ambigu"
  | "non trouvé"
  | "source secondaire uniquement";

export interface SourceCitation {
  source: OfficialSource;
  title: string;
  url: string;
  retrievedAt: string;
  status: ProofStatus;
  id?: string;
  date?: string;
  paragraph?: string;
  tool?: string;
}

export interface BusinessDataCitation {
  source: BusinessDataSource;
  title: string;
  retrievedAt: string;
  status: ProofStatus;
  tool: string;
  id?: string;
  fields?: string[];
  url?: string;
  recoupedWithOfficialSource?: boolean;
  creditStatus?: "unknown" | "available" | "insufficient";
}

export interface SourceSearchHit {
  source: OfficialSource;
  id: string;
  title: string;
  url: string;
  retrievedAt: string;
  excerpt?: string;
  date?: string;
  score?: number;
}
