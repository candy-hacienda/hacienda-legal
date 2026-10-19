import { log } from "../logger.js";

const BODACC_BASE_URL =
  "https://bodacc-datadila.opendatasoft.com/api/explore/v2.1";

export interface BodaccAnnonce {
  id: string;
  registre: string;
  dateparution: string;
  typeavis: string;
  familleavis: string;
  publicationavis: string;
  numerodepartement?: string;
  ville?: string;
  tribunal?: string;
  /**
   * Jugement publié, lu depuis `raw.jugement` (JSON sérialisé en chaîne par le
   * BODACC). C'est là, et non dans `typeavis` (« Avis initial »), que figurent la
   * nature de la procédure, la date du jugement et le mandataire désigné.
   */
  jugement?: BodaccJugement;
  raw: unknown;
}

export interface BodaccJugement {
  /** Ex. « Jugement d'ouverture », « Jugement de clôture », « Jugement de plan ». */
  famille?: string;
  /** Ex. « Jugement d'ouverture d'une procédure de redressement judiciaire ». */
  nature?: string;
  /** Date du jugement (AAAA-MM-JJ). */
  date?: string;
  /** Texte libre : cessation des paiements, mandataire / liquidateur désigné… */
  complement?: string;
}

function parseJugement(value: unknown): BodaccJugement | undefined {
  let data: unknown = value;
  if (typeof value === "string") {
    try {
      data = JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  if (!data || typeof data !== "object") return undefined;
  const j = data as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const jugement: BodaccJugement = {
    famille: str(j.famille),
    nature: str(j.nature),
    date: str(j.date),
    complement: str(j.complementJugement),
  };
  return Object.values(jugement).some(Boolean) ? jugement : undefined;
}

/**
 * L'API BODACC n'a pas répondu correctement (réseau, délai dépassé, erreur HTTP).
 * Distincte d'une réponse vide : « aucune annonce » est un résultat, pas un échec.
 */
export class BodaccUnavailableError extends Error {
  constructor(
    message: string,
    readonly reason: string,
  ) {
    super(message);
    this.name = "BodaccUnavailableError";
  }
}

export interface BodaccClientOptions {
  /** Délai maximal par appel (ms). */
  timeoutMs?: number;
  /** Pause avant le nouvel essai (ms). */
  retryDelayMs?: number;
}

const TRANSIENT_STATUSES = new Set([408, 429]);

export class BodaccClient {
  private readonly timeoutMs: number;
  private readonly retryDelayMs: number;

  constructor(
    private readonly baseUrl: string = BODACC_BASE_URL,
    options: BodaccClientOptions = {},
  ) {
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.retryDelayMs = options.retryDelayMs ?? 500;
  }

  async searchBySiren(
    siren: string,
    limit: number = 20
  ): Promise<BodaccAnnonce[]> {
    return this.fetchAnnonces(`registre LIKE "%${siren}%"`, limit, siren);
  }

  async searchProcedures(siren: string): Promise<BodaccAnnonce[]> {
    return this.fetchAnnonces(
      // Valeur technique du champ BODACC ; « Procédures collectives » n'est que
      // son libellé (familleavis_lib). Un autre slug renvoie 0 résultat sans erreur.
      `registre LIKE "%${siren}%" AND familleavis = "collective"`,
      50,
      siren,
    );
  }

  /**
   * Un appel avec un seul nouvel essai sur panne transitoire (réseau, 5xx, 408,
   * 429). Toute autre erreur HTTP (ex. 400, requête invalide) est définitive.
   * Après échec : BodaccUnavailableError, jamais une liste vide.
   */
  private async fetchAnnonces(
    where: string,
    limit: number,
    siren: string,
  ): Promise<BodaccAnnonce[]> {
    const params = new URLSearchParams({
      where,
      order_by: "dateparution DESC",
      limit: String(limit),
    });
    const url = `${this.baseUrl}/catalog/datasets/annonces-commerciales/records?${params}`;
    let reason = "";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (attempt > 0 && this.retryDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
      }
      try {
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(this.timeoutMs),
        });
        if (res.ok) {
          const data = (await res.json()) as { results?: unknown[] };
          return (data.results ?? []).map((r) => this.parseAnnonce(r));
        }
        reason = `HTTP ${res.status}`;
        if (res.status < 500 && !TRANSIENT_STATUSES.has(res.status)) break;
      } catch (err) {
        reason = err instanceof Error ? err.message : String(err);
      }
    }
    log.warn("BODACC fetch failed", { reason, siren });
    throw new BodaccUnavailableError(`BODACC indisponible (${reason})`, reason);
  }

  private parseAnnonce(raw: unknown): BodaccAnnonce {
    const r = raw as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      registre: String(r.registre ?? ""),
      dateparution: String(r.dateparution ?? ""),
      typeavis: String(r.typeavis_lib ?? ""),
      familleavis: String(r.familleavis_lib ?? ""),
      publicationavis: String(r.publicationavis ?? r.publicationavis_facette ?? ""),
      numerodepartement: r.numerodepartement
        ? String(r.numerodepartement)
        : undefined,
      ville: r.ville ? String(r.ville) : undefined,
      tribunal: r.tribunal ? String(r.tribunal) : undefined,
      jugement: parseJugement(r.jugement),
      raw,
    };
  }
}
