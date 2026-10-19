#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

function cleanEnv(value) {
  if (!value) return undefined;
  if (/^\$\{[^}]+\}$/.test(value)) return undefined;
  return value;
}

function loadCredentialsFile() {
  const path =
    process.env.HACIENDA_CREDENTIALS_FILE ??
    resolve(homedir(), ".config", "Hacienda", "credentials.json");
  if (!existsSync(path)) return undefined;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return undefined;
  }
}

const key =
  cleanEnv(process.env.PAPPERS_API_KEY) ??
  loadCredentialsFile()?.PAPPERS_API_KEY;

if (!key) {
  console.error(
    "PAPPERS_API_KEY is required. Provide it via environment variable or ~/.config/Hacienda/credentials.json and never commit it."
  );
  process.exit(2);
}

const endpoint = new URL(`https://mcp.pappers.fr/${key}`);
const client = new Client({ name: "hacienda-pappers-discovery", version: "0.1.0" });
const transport = new StreamableHTTPClientTransport(endpoint);

function inputSchemaSummary(schema) {
  const properties = schema?.properties && typeof schema.properties === "object" ? Object.keys(schema.properties) : [];
  const required = Array.isArray(schema?.required) ? schema.required : [];
  return { required, properties };
}

try {
  await client.connect(transport);
  const result = await client.listTools();
  const tools = result.tools.map((tool) => ({
    name: tool.name,
    title: tool.title ?? tool.name,
    description: tool.description ?? "",
    inputSchema: inputSchemaSummary(tool.inputSchema),
  }));

  console.log(JSON.stringify({ endpoint: "https://mcp.pappers.fr/[masked]", count: tools.length, tools }, null, 2));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Pappers MCP discovery failed: ${message}`);
  process.exit(1);
} finally {
  await client.close().catch(() => undefined);
}
