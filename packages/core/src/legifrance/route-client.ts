import type { PisteHttpClient, RequestOptions } from "../http.js";
import { getEndpoint } from "./endpoints.js";

export type RouteParams = Record<string, string | number | boolean>;
export type RouteQueryValue = string | number | boolean | null | undefined;
export type RouteQuery = Record<string, RouteQueryValue | readonly RouteQueryValue[]>;

export interface RouteCallOptions {
  pathParams?: RouteParams;
  query?: RouteQuery;
  body?: unknown;
  bypassCache?: boolean;
  ttlMs?: number;
}

export function fillPathParams(path: string, params: RouteParams = {}): string {
  return path.replaceAll(/\{([^}]+)\}/g, (_match, paramName: string) => {
    const value = params[paramName];
    if (value === undefined || value === null) {
      throw new Error(`Missing path param ${paramName}`);
    }
    return encodeURIComponent(String(value));
  });
}

export function appendQueryParams(path: string, query: RouteQuery = {}): string {
  const searchParams = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
  }

  const queryString = searchParams.toString();
  if (!queryString) {
    return path;
  }

  return `${path}${path.includes("?") ? "&" : "?"}${queryString}`;
}

export class LegifranceRouteClient {
  constructor(private readonly http: Pick<PisteHttpClient, "get" | "post">) {}

  async call<T = unknown>(endpointKey: string, options: RouteCallOptions = {}): Promise<T> {
    const endpoint = getEndpoint(endpointKey);
    const path = appendQueryParams(fillPathParams(endpoint.path, options.pathParams), options.query);
    const requestOptions = this.requestOptions(endpoint.defaultTtlMs, options);

    if (endpoint.method === "GET") {
      return this.http.get<T>(path, requestOptions);
    }

    return this.http.post<T>(path, options.body ?? {}, requestOptions);
  }

  private requestOptions(defaultTtlMs: number | undefined, options: RouteCallOptions): RequestOptions {
    const requestOptions: RequestOptions = {};
    const ttlMs = options.ttlMs ?? defaultTtlMs;

    if (options.bypassCache !== undefined) {
      requestOptions.bypassCache = options.bypassCache;
    }
    if (ttlMs !== undefined) {
      requestOptions.ttlMs = ttlMs;
    }

    return requestOptions;
  }
}
