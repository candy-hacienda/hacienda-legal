import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { marketplacePath, pluginsRoot, repoRoot } from "./paths.js";
import { loadRegistry } from "./registry.js";
import type {
  PluginRegistryEntry,
  ValidationFinding,
  ValidationResult
} from "./types.js";

const sharedCompanyProfilePath =
  "~/.claude/plugins/config/hacienda-juridique/company-profile.md";
const legacyCabinetProfilePath =
  "~/.claude/plugins/config/hacienda-juridique/profil-cabinet.md";

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8")) as unknown;
}

function readText(path: string): string {
  return readFileSync(path, "utf8");
}

function add(
  findings: ValidationFinding[],
  code: string,
  path: string,
  message: string
): void {
  findings.push({ severity: "error", code, path, message });
}

function requireFile(findings: ValidationFinding[], path: string, code: string): void {
  if (!existsSync(path)) {
    add(findings, code, path, "Required file is missing");
  }
}

function validateManifest(findings: ValidationFinding[], plugin: PluginRegistryEntry): void {
  const manifestPath = resolve(repoRoot, plugin.source, ".claude-plugin/plugin.json");
  requireFile(findings, manifestPath, "manifest.missing");
  if (!existsSync(manifestPath)) return;

  const manifest = readJson(manifestPath) as {
    name?: string;
    author?: { name?: string; url?: string };
    repository?: string;
    license?: string;
  };

  if (manifest.name !== plugin.name) {
    add(findings, "manifest.name", manifestPath, "Manifest name must match registry name");
  }
  if (manifest.author?.name !== "Hacienda") {
    add(findings, "manifest.author", manifestPath, "Manifest author must be Hacienda");
  }
  if (manifest.author?.url !== "https://hacienda.diy") {
    add(findings, "manifest.author_url", manifestPath, "Manifest author URL must be Hacienda");
  }
  if (manifest.repository !== "https://github.com/candy-hacienda/hacienda-legal") {
    add(
      findings,
      "manifest.repository",
      manifestPath,
      "Manifest repository must point to candy-hacienda/hacienda-legal"
    );
  }
  if (manifest.license !== "AGPL-3.0-or-later") {
    add(
      findings,
      "manifest.license",
      manifestPath,
      "Manifest license must be AGPL-3.0-or-later"
    );
  }
}

function validateMcp(findings: ValidationFinding[], plugin: PluginRegistryEntry): void {
  const mcpPath = resolve(repoRoot, plugin.source, ".mcp.json");
  requireFile(findings, mcpPath, "mcp.missing");
  if (!existsSync(mcpPath)) return;

  const mcp = readJson(mcpPath) as {
    mcpServers?: Record<string, { type?: string; command?: string; args?: string[] }>;
    references?: string[];
    recommendedCategories?: string[];
  };

  const servers = Object.values(mcp.mcpServers ?? {});
  if (plugin.mcp.mode === "own-stdio-server") {
    const hasExecutableServer = servers.some(
      (server) => server.type === "stdio" && server.command && Array.isArray(server.args)
    );
    if (!hasExecutableServer) {
      add(
        findings,
        "mcp.own_stdio",
        mcpPath,
        "own-stdio-server plugins must declare a stdio server with command and args"
      );
    }
    for (const server of servers) {
      for (const arg of server.args ?? []) {
        if (arg.includes("./plugins/") || arg.includes("../")) {
          add(
            findings,
            "mcp.plugin_root_path",
            mcpPath,
            "Plugin MCP server paths must use ${CLAUDE_PLUGIN_ROOT}, not repo-relative paths"
          );
        }
      }
    }
    const usesPluginRoot = servers.some((server) =>
      (server.args ?? []).some((arg) => arg.includes("${CLAUDE_PLUGIN_ROOT}"))
    );
    if (!usesPluginRoot) {
      add(
        findings,
        "mcp.plugin_root_missing",
        mcpPath,
        "own-stdio-server plugins must reference bundled files through ${CLAUDE_PLUGIN_ROOT}"
      );
    }
  }

  if (plugin.mcp.mode === "references-source-foundation") {
    if (servers.length > 0) {
      add(
        findings,
        "mcp.references_no_servers",
        mcpPath,
        "references-source-foundation plugins must not declare local mcpServers"
      );
    }
    if (!mcp.references?.includes("hacienda-sources-officielles")) {
      add(
        findings,
        "mcp.references_source_foundation",
        mcpPath,
        "references-source-foundation plugins must reference hacienda-sources-officielles"
      );
    }
  }

  if (plugin.mcp.mode === "none" && servers.length > 0) {
    add(findings, "mcp.none", mcpPath, "mcp mode none must not declare mcpServers");
  }

  if (!Array.isArray(mcp.recommendedCategories) || mcp.recommendedCategories.length === 0) {
    add(
      findings,
      "mcp.recommended_categories",
      mcpPath,
      "MCP manifest must declare at least one recommended category"
    );
  }
}

function validateSkill(
  findings: ValidationFinding[],
  plugin: PluginRegistryEntry,
  skill: string
): void {
  const skillPath = resolve(repoRoot, plugin.source, "skills", skill, "SKILL.md");
  requireFile(findings, skillPath, "skill.missing");
  if (!existsSync(skillPath)) return;

  const content = readText(skillPath);
  if (content.includes("\r\n")) {
    add(
      findings,
      "skill.line_endings",
      skillPath,
      "Skill files must use LF line endings so Claude Desktop can parse YAML frontmatter"
    );
  }
  if (!content.match(/^---\n/u)) {
    add(
      findings,
      "skill.frontmatter",
      skillPath,
      "Skill must start with YAML frontmatter using LF line endings"
    );
  }
  if (!content.match(/name:\s*.+/iu)) {
    add(findings, "skill.name", skillPath, "Skill frontmatter must include name");
  }
  if (!content.match(/description:\s*.+/iu)) {
    add(
      findings,
      "skill.description",
      skillPath,
      "Skill frontmatter must include description"
    );
  }
  if (!content.match(/validation humaine/iu)) {
    add(findings, "skill.human_review", skillPath, "Skill must mention validation humaine");
  }
  if (!content.match(/\[(?:a verifier|à vérifier)\]/iu)) {
    add(findings, "skill.verify_tag", skillPath, "Skill must include [à vérifier] guardrail");
  }
}

function validateAgent(
  findings: ValidationFinding[],
  plugin: PluginRegistryEntry,
  agent: string
): void {
  const agentPath = resolve(repoRoot, plugin.source, "agents", `${agent}.md`);
  requireFile(findings, agentPath, "agent.missing");
  if (!existsSync(agentPath)) return;

  const content = readText(agentPath);
  if (!content.match(/validation humaine|review|relecture/iu)) {
    add(findings, "agent.review", agentPath, "Agent must mention human review or relecture");
  }
  if (!content.match(/ne (?:pas|jamais)|pas d'envoi|pas de depot|pas de dépôt/iu)) {
    add(findings, "agent.limits", agentPath, "Agent must state operational limits");
  }
}

function validateClaude(findings: ValidationFinding[], claudePath: string): void {
  requireFile(findings, claudePath, "claude.missing");
  if (!existsSync(claudePath)) return;

  const content = readText(claudePath);
  if (!content.includes(sharedCompanyProfilePath)) {
    add(
      findings,
      "claude.company_profile",
      claudePath,
      `CLAUDE.md must reference ${sharedCompanyProfilePath}`
    );
  }
  if (content.includes("profil-cabinet.md") || content.includes(legacyCabinetProfilePath)) {
    add(
      findings,
      "claude.legacy_profile",
      claudePath,
      `CLAUDE.md must not reference ${legacyCabinetProfilePath}`
    );
  }
}

function validatePlugin(findings: ValidationFinding[], plugin: PluginRegistryEntry): void {
  const pluginDir = resolve(repoRoot, plugin.source);
  requireFile(findings, pluginDir, "plugin.missing");
  validateClaude(findings, resolve(pluginDir, "CLAUDE.md"));
  requireFile(findings, resolve(pluginDir, "README.md"), "readme.missing");
  requireFile(findings, resolve(pluginDir, "hooks/hooks.json"), "hooks.missing");
  requireFile(
    findings,
    resolve(pluginDir, "skills/entretien-demarrage/SKILL.md"),
    "cold_start.missing"
  );

  validateManifest(findings, plugin);
  validateMcp(findings, plugin);

  for (const skill of plugin.skills) validateSkill(findings, plugin, skill);
  for (const agent of plugin.agents) validateAgent(findings, plugin, agent);
}

export function validateAllPlugins(): ValidationResult {
  const findings: ValidationFinding[] = [];
  const registry = loadRegistry();
  const marketplace = readJson(marketplacePath) as {
    plugins?: Array<{ name: string; source: string }>;
  };
  const marketplaceNames = (marketplace.plugins ?? []).map((plugin) => plugin.name);
  const registryNames = registry.plugins.map((plugin) => plugin.name);

  if (JSON.stringify(marketplaceNames) !== JSON.stringify(registryNames)) {
    add(
      findings,
      "marketplace.registry_mismatch",
      marketplacePath,
      "Marketplace plugin order and names must match plugins/registry.json"
    );
  }

  const diskPlugins = readdirSync(pluginsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const diskPlugin of diskPlugins) {
    if (!registryNames.includes(diskPlugin)) {
      add(
        findings,
        "registry.extra_plugin",
        resolve(pluginsRoot, diskPlugin),
        "Plugin directory is not declared in registry"
      );
    }
  }

  for (const plugin of registry.plugins) validatePlugin(findings, plugin);

  return { ok: findings.length === 0, findings };
}

function main(): number {
  const result = validateAllPlugins();
  if (!result.ok) {
    for (const finding of result.findings) {
      console.error(
        `${finding.severity.toUpperCase()} ${finding.code} ${finding.path}: ${finding.message}`
      );
    }
    return 1;
  }

  console.log("Hacienda plugin contract OK");
  return 0;
}

if (process.argv[1]?.endsWith("validate-plugin.js")) {
  process.exitCode = main();
}
