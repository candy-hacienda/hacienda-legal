import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { LegifranceRouteClient } from "../legifrance/route-client.js";
import { findEndpointByPath, getEndpoint } from "../legifrance/endpoints.js";
import type { EndpointMethod, LegifranceEndpoint } from "../legifrance/endpoints.js";

const stringNumberValue = z.union([z.string(), z.number()]);
const queryValue = z.union([z.string(), z.number(), z.boolean()]);

export const LegifranceApiCallArgsSchema = z.object({
  endpoint: z
    .string()
    .min(1)
    .describe("Endpoint key or registered path from the Légifrance endpoint registry, e.g. consult.getArticle or /consult/getArticle."),
  method: z.enum(["GET", "POST"]).optional().describe("Optional HTTP method guard. Rejected if it does not match the endpoint registry."),
  pathParams: z.record(z.string(), stringNumberValue).optional().describe("Path parameters for templated endpoints."),
  query: z.record(z.string(), queryValue).optional().describe("Query parameters appended to the endpoint path."),
  body: z.unknown().optional().describe("Request body for POST endpoints."),
  bypassCache: z.boolean().optional().describe("When true, bypass the local HTTP response cache."),
  raw: z.boolean().optional().describe("Explicit design flag for raw JSON output. The tool already returns the JSON envelope."),
  rawOutput: z.boolean().optional().describe("Alias design flag for raw JSON output. The tool already returns the JSON envelope."),
});

export type LegifranceApiCallArgs = z.infer<typeof LegifranceApiCallArgsSchema>;

function textResult(text: string, isError?: true) {
  return {
    ...(isError ? { isError } : {}),
    content: [{ type: "text" as const, text }],
  };
}

function resolveEndpoint(endpointInput: string): LegifranceEndpoint {
  if (endpointInput.startsWith("/")) {
    const endpoint = findEndpointByPath(endpointInput);
    if (!endpoint) {
      throw new Error(`Unknown Legifrance endpoint path: ${endpointInput}`);
    }
    return endpoint;
  }

  return getEndpoint(endpointInput);
}

function assertMethodMatchesRegistry(providedMethod: EndpointMethod | undefined, endpoint: LegifranceEndpoint) {
  if (providedMethod && providedMethod !== endpoint.method) {
    throw new Error(`Method mismatch for ${endpoint.key}: registry uses ${endpoint.method}, received ${providedMethod}`);
  }
}

export async function callLegifranceApiExpert(route: LegifranceRouteClient, args: unknown) {
  try {
    const parsedArgs = LegifranceApiCallArgsSchema.parse(args);
    const endpoint = resolveEndpoint(parsedArgs.endpoint);
    assertMethodMatchesRegistry(parsedArgs.method, endpoint);

    const data = await route.call(endpoint.key, {
      pathParams: parsedArgs.pathParams,
      query: parsedArgs.query,
      body: parsedArgs.body,
      bypassCache: parsedArgs.bypassCache,
    });

    return textResult(
      JSON.stringify(
        {
          endpoint: {
            key: endpoint.key,
            path: endpoint.path,
            status: endpoint.status,
          },
          ...(parsedArgs.raw === undefined ? {} : { raw: parsedArgs.raw }),
          ...(parsedArgs.rawOutput === undefined ? {} : { rawOutput: parsedArgs.rawOutput }),
          data,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return textResult(message, true);
  }
}

export function registerApiCall(server: McpServer, route: LegifranceRouteClient) {
  server.registerTool(
    "legifrance_api_call",
    {
      title: "Appel expert API Légifrance",
      description: [
        "Appelle un endpoint Légifrance par sa clé de registre ou son chemin enregistré.",
        "Outil expert : utiliser lorsque les tools dédiés ne couvrent pas l'endpoint nécessaire.",
        "Accepte method, pathParams, query, body, bypassCache et les flags raw/rawOutput puis retourne le JSON brut avec les métadonnées d'endpoint.",
      ].join("\n"),
      inputSchema: LegifranceApiCallArgsSchema.shape,
    },
    async (args) => callLegifranceApiExpert(route, args),
  );
}
