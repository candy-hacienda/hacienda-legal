import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { repoRoot } from "./paths.js";

type AddAgentOptions = {
  plugin: string;
  agent: string;
  root: string;
};

function usage(): string {
  return "Usage: add-agent --plugin hacienda-... --agent <agent-name> [--root <path>]";
}

function readOption(args: string[], option: string): string | undefined {
  const index = args.indexOf(option);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${option}`);
  }
  return value;
}

export function parseAddAgentArgs(args: string[]): AddAgentOptions {
  const plugin = readOption(args, "--plugin");
  const agent = readOption(args, "--agent");
  const root = readOption(args, "--root") ?? repoRoot;

  if (!plugin) throw new Error("Missing required --plugin");
  if (!plugin.startsWith("hacienda-")) {
    throw new Error("Plugin name must start with hacienda-");
  }
  if (!plugin.match(/^hacienda-[a-z0-9-]+$/u)) {
    throw new Error("Plugin name must use lowercase letters, numbers, and hyphens");
  }
  if (!agent) throw new Error("Missing required --agent");
  if (!agent.match(/^[a-z0-9-]+$/u)) {
    throw new Error("Agent name must use lowercase letters, numbers, and hyphens");
  }

  return { plugin, agent, root };
}

function buildAgent(options: AddAgentOptions): string {
  return `# ${options.agent}

## Mission

Surveiller les signaux configures et preparer une synthese pour validation humaine.

## Limites

Pas d'envoi, pas de depot, pas de paiement, pas de conseil juridique final.

## Routage

Router tout travail substantiel vers les skills du plugin et marquer les sources non consultées \`[à vérifier]\`.

## Validation Humaine

Validation humaine obligatoire avant usage externe, depot, envoi, paiement ou decision.
`;
}

function writeNewFile(path: string, content: string): void {
  writeFileSync(path, content, { encoding: "utf8", flag: "wx" });
}

export function addAgent(options: AddAgentOptions): string {
  const pluginDir = resolve(options.root, "plugins", options.plugin);
  const manifestPath = resolve(pluginDir, ".claude-plugin", "plugin.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`Plugin does not exist or is missing manifest: ${options.plugin}`);
  }

  const agentsDir = resolve(pluginDir, "agents");
  const agentPath = resolve(agentsDir, `${options.agent}.md`);

  mkdirSync(agentsDir, { recursive: true });
  writeNewFile(agentPath, buildAgent(options));

  return agentPath;
}

function main(): number {
  try {
    const options = parseAddAgentArgs(process.argv.slice(2));
    const agentPath = addAgent(options);
    console.log(`Created ${agentPath}`);
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.error(usage());
    return 1;
  }
}

if (process.argv[1]?.endsWith("add-agent.js")) {
  process.exitCode = main();
}
