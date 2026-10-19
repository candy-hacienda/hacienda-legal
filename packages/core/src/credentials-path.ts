import { existsSync } from "node:fs";
import { homedir, userInfo } from "node:os";
import { resolve } from "node:path";

/**
 * Dossier personnel donné par le système (base des comptes), indépendant de
 * la variable HOME. Undefined si le système ne peut pas le fournir.
 */
function systemHomedir(): string | undefined {
  try {
    return userInfo().homedir || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Chemin du fichier d'identifiants Hacienda.
 *
 * 1. `$HACIENDA_CREDENTIALS_FILE` s'il est défini (renvoyé tel quel, même s'il
 *    n'existe pas : l'appelant vérifie l'existence) ;
 * 2. `~/.config/Hacienda/credentials.json` sous `HOME` ;
 * 3. le même chemin sous le vrai dossier personnel donné par le système,
 *    quand `HOME` a été détourné (bac à sable de `claude plugin eval`,
 *    lanceurs GUI) et ne contient pas le fichier.
 *
 * Les dossiers sont injectables pour les tests.
 */
export function resolveCredentialsFilePath(
  dirs: { homeDir?: string; systemHomeDir?: string } = {
    homeDir: homedir(),
    systemHomeDir: systemHomedir(),
  }
): string | undefined {
  const explicit = process.env.HACIENDA_CREDENTIALS_FILE;
  if (explicit) return explicit;

  const candidates = [dirs.homeDir, dirs.systemHomeDir].filter(
    (dir, index, all): dir is string => Boolean(dir) && all.indexOf(dir) === index
  );
  for (const dir of candidates) {
    const path = resolve(dir, ".config", "Hacienda", "credentials.json");
    if (existsSync(path)) return path;
  }
  return undefined;
}
