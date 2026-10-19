export type PluginType =
  | "source-foundation"
  | "legal-domain"
  | "legal-domain-with-mcp"
  | "transversal-research";

export type McpMode = "none" | "references-source-foundation" | "own-stdio-server";

export type PluginRegistryEntry = {
  name: string;
  type: PluginType;
  source: string;
  description: string;
  skills: string[];
  agents: string[];
  mcp: {
    mode: McpMode;
  };
};

export type PluginRegistry = {
  plugins: PluginRegistryEntry[];
};

export type ValidationSeverity = "error" | "warning";

export type ValidationFinding = {
  severity: ValidationSeverity;
  code: string;
  path: string;
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  findings: ValidationFinding[];
};

export type AnnoDistributionOptions = {
  outputDir: string;
  annoBinary: string;
  blockDownloads: boolean;
};

export type ClaudeDesktopServerConfig = {
  type?: "stdio";
  command: string;
  args: string[];
  env?: Record<string, string>;
  title?: string;
  description?: string;
};

export type ClaudeDesktopConfig = {
  mcpServers: Record<string, ClaudeDesktopServerConfig>;
};

export type AnnoEngineCompat = {
  min_engine_version: string;
  recommended_engine_version: string;
  required_tools: string[];
  tool_tiers: {
    core: string[];
    setup: string[];
    memory: string[];
    legal: string[];
    knowledge: string[];
    tabular: string[];
  };
  release_page_url: string;
};
