---
name: verifier-citations
description: >
  Post-flight de validation juridique. Pour chaque article cite dans une
  sortie skill (art. NNN C.civ, L.NNN-N C.com., etc.), interroge Legifrance
  via packages/core pour verifier existence + version en vigueur +
  non-abrogation. Annote la sortie. Mode degrade si PISTE non configure.
version: "2.0.0"
argument-hint: "[sortie ou liste de citations à vérifier]"
authors: ["Hacienda"]
tags: [validation, legifrance, post-flight, citations]
---

# Skill — Verification des citations juridiques

> **POST-FLIGHT AUTOMATIQUE.**
>
> Ce skill est invoque automatiquement par tous les skills produisant
> du texte juridique. Il verifie que chaque article cite existe et n'est
> pas abroge. Mode degrade documente si PISTE est absent.

## Examples

<example>
<user>(appele automatiquement par reviser-contrat apres production de la sortie)</user>
<response>
Analyse la sortie, extrait 12 citations :
- art. 1171 C.civ -> [Legifrance ✓] en vigueur
- L.442-1 C.com. -> [Legifrance ✓] en vigueur
- art. 1100 C.civ ancien -> [abroge] remplace par art. 1101 reforme 2016
- Cass. com. 10 juil. 2002 n° 00-12.345 -> [Judilibre ✓] existe

Remonte en note du relecteur : "1 citation abrogee detectee — voir l'article
1100 ancien remplace par 1101 reforme 2016".
</response>
</example>

<example>
<user>(appele sur une sortie contenant 8 citations, PISTE non configure)</user>
<response>
Sans PISTE : toutes citations taguees [à vérifier] (mode degrade).
Note du relecteur : "verifier-citations non execute — cles PISTE absentes,
8 citations a valider manuellement contre Legifrance".
</response>
</example>

<example>
<user>(appele sur une note citant uniquement de la jurisprudence)</user>
<response>
Extraction jurisprudence :
- Cass. com. 29 juin 2010 n° 09-11.841 -> [Judilibre ✓] decision trouvee
- CJUE 14 juillet 2016 aff. C-196/15 -> [à vérifier] hors couverture Judilibre

La note du relecteur signale la citation CJUE a verifier sur Eurlex/CURIA.
</response>
</example>

---

## Chargement du profil

> Verifier `loadConfig().credentialsSource` :
> - `"env"` ou `"file"` -> mode operationnel
> - `"none"` -> mode degrade

Le skill doit aussi respecter les tags de provenance canoniques du
`CLAUDE.md` droit-affaires : `[Légifrance]`, `[Judilibre]`, `[à vérifier]`,
`[review]`.

---

## Intake

1. **sortie** — texte de la sortie produit par le skill appelant
2. **type_citations** (optionnel) — `articles` (defaut) | `jurisprudence` | `both`
3. **mode_silencieux** (optionnel) — si true, ne retourner que la note relecteur + sortie annotee
4. **date_analyse** — date du jour pour tracer la verification

---

## Gate non-juriste

Si l'utilisateur n'est pas juriste ou avocat, produire une explication opérationnelle, signaler les limites, refuser toute conclusion présentée comme avis juridique final et demander validation par un professionnel habilité avant usage externe.

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

Écrire les livrables dans le dossier de pratique ou de dossier configuré : `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/outputs/` ou `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/matters/<slug-dossier>/outputs/`.

## Sortie

Structurer la sortie avec : faits retenus, droit applicable, analyse, incertitudes, sources consultées, décisions proposées, prochaine action et validation humaine. Toute source non consultée directement reste `[à vérifier]`.

## Etape 1 — Extraction des citations

Appliquer les regex sur la sortie complete. Conserver `refRaw`, la position et
le contexte court (phrase ou ligne) pour permettre une annotation precise.
Dedoublonner les references identiques, mais conserver toutes les positions.

| Type | Pattern |
|---|---|
| Article C.civ | `\bart(?:icle)?\.?\s*(\d+(?:-\d+)?)\s*(?:du\s+)?C\.?civ(?:il)?` |
| Article C.com. | `\bart(?:icle)?\.?\s*L\.?\s*(\d+-\d+(?:-\d+)?)\s*(?:du\s+)?C\.?com(?:merce)?` |
| Article CPI | `\bart(?:icle)?\.?\s*L\.?\s*(\d+-\d+(?:-\d+)?)\s*(?:du\s+)?CPI` |
| Article RGPD | `\bart(?:icle)?\.?\s*(\d+(?:-\d+)?)\s*(?:du\s+)?RGPD` |
| Loi numerotee | `loi\s+n[°o]\s*(\d+-\d+)\s+du\s+(\d+\s+[\p{L}]+\s+\d+)` |
| Arret Cour cass. | `Cass\.\s+(com|civ(?:\.\s*\d+)?|soc|crim|ass)\.?\s+(\d+\s+[\p{L}]+\s+\d{4})(?:\s+n[°o]\s*(\d+-\d+\.\d+))?` |
| Arret CJUE | `CJUE\s+(\d+\s+[\p{L}]+\s+\d{4})(?:\s+aff\.\s+(C-\d+/\d+))?` |

Retourner :

```json
[
  {
    "type": "article",
    "code": "CODE_CIVIL",
    "refRaw": "art. 1171 C.civ",
    "refNorm": "C.civ 1171",
    "positions": [1284]
  }
]
```

Si aucune citation n'est detectee, retourner une note courte :
`Aucune citation juridique detectee dans la sortie.`

---

## Etape 2 — Lookup Legifrance (mode operationnel)

Pour chaque article extrait :

```typescript
import { legifranceCheckArticle } from "@hacienda/core";

const result = await legifranceCheckArticle({
  code: "CODE_CIVIL" | "CODE_COMMERCE" | "CODE_PROPRIETE_INTELLECTUELLE",
  numero: "1171",
});
// -> { existe: bool, version_en_vigueur: bool, abroge: bool, dateMaj: string }
```

Mapping minimal des codes :

| Citation | Code Legifrance |
|---|---|
| C.civ / Code civil | `CODE_CIVIL` |
| C.com / Code de commerce | `CODE_COMMERCE` |
| CPI | `CODE_PROPRIETE_INTELLECTUELLE` |
| RGPD | hors Legifrance strict -> tag `[à vérifier]` sauf integration Eurlex disponible |

Si Legifrance retourne une erreur transitoire, ne pas inventer : taguer la
citation `[à vérifier]` et le signaler dans la note relecteur.

---

## Etape 3 — Lookup Judilibre (jurisprudence)

Pour chaque arret Cour de cassation :

Appeler `judilibre_recherche` avec la référence brute (`refRaw`), puis
`judilibre_get_decision` si un identifiant fiable est retourné. Si la décision
n'est pas retrouvée, marquer la citation `[à vérifier]`.

Pour CJUE, TUE ou autres juridictions UE, signaler `[à vérifier]` sauf si une
integration Eurlex/CURIA est explicitement disponible dans le contexte core du
skill appelant.

---

## Etape 4 — Annotation de la sortie

Ajouter un tag proche de chaque citation, sans alourdir inutilement le livrable.
Si une meme citation apparait plusieurs fois, annoter la premiere occurrence et
laisser les occurrences suivantes intactes sauf alerte bloquante.

| Resultat | Tag inline |
|---|---|
| Article existe et en vigueur | `[Légifrance ✓]` |
| Non recuperable ou mode degrade | `[à vérifier]` |
| Article abroge | `[abrogé 🔴]` |
| Version ancienne ou reference incertaine | `[obsolète 🟠]` |
| Arret Cour cass. trouve | `[Judilibre ✓]` |
| Arret non trouve | `[Judilibre — non trouvé ⚠]` |

Toute citation abrogee ou introuvable dans une base disponible doit remonter
dans la note du relecteur. Ne pas corriger silencieusement le fond du livrable.

---

## Etape 5 — Note relecteur

Si tout est vert :

```markdown
⚠️ Note du relecteur : Légifrance + Judilibre vérifiés · {N} citations · aucun flag · prêt pour relecture
```

Si des abrogations ou incoherences sont detectees :

```markdown
- **Sources :** Légifrance ✓ / Judilibre ✓
- **Citations vérifiées :** 12 sur 12
- **ALERTE : 1 article abrogé** — art. 1100 C.civ ancien (réforme 2016).
  À remplacer par art. 1101 dans la sortie.
```

Si verification partielle :

```markdown
- **Sources :** Légifrance ✓ / Judilibre erreur temporaire
- **Citations vérifiées :** 9 sur 12
- **Action :** valider manuellement les 3 citations taguées [à vérifier]
```

---

## Mode degrade (PISTE absent)

Si `loadConfig().credentialsSource === "none"` :

1. Ne pas appeler Legifrance.
2. Ne pas presenter les articles comme verifies.
3. Taguer toutes les citations `[à vérifier]`.
4. Ajouter une note relecteur explicite :

```markdown
- **verifier-citations :** non exécuté (clés PISTE absentes)
- **Action :** vérifier manuellement les {N} citations contre Légifrance
- **Pour activer :** configurer `PISTE_CLIENT_ID` et `PISTE_CLIENT_SECRET`
  dans `~/.config/Hacienda/credentials.json`, puis lancer
  `/h-da:entretien-demarrage --check-integrations`
```

Judilibre public peut rester operationnel si le wrapper core le permet sans
credential. Si ce n'est pas confirme, taguer la jurisprudence `[à vérifier]`.

---

## Sortie — Format livrable

Retourner au skill appelant :

```json
{
  "sortieAnnotee": "...texte avec tags inline...",
  "citationsVerifiees": 12,
  "citationsDetectees": 12,
  "alertes": [
    {
      "type": "abroge",
      "ref": "art. 1100 C.civ",
      "remplacement": "art. 1101"
    }
  ],
  "modeDegrade": false,
  "noteRelecteur": "- **Sources :** Légifrance ✓..."
}
```

En mode degrade :

```json
{
  "sortieAnnotee": "...toutes citations taguées [à vérifier]...",
  "citationsVerifiees": 0,
  "citationsDetectees": 8,
  "alertes": [],
  "modeDegrade": true,
  "noteRelecteur": "- **verifier-citations :** non exécuté..."
}
```

Le skill appelant insere `noteRelecteur` dans le bloc unique de note du
relecteur, puis utilise `sortieAnnotee` comme livrable propre.

---

> Sortie brouillon soumise à **validation humaine** avant tout usage externe.
