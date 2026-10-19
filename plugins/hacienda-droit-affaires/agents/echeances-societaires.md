---
name: echeances-societaires
description: >
  Rappel hebdomadaire des échéances sociétaires sur portefeuille clients :
  dépôt comptes annuels (clôture + 7 mois), tenue AGO obligatoire (clôture
  + 6 mois), renouvellement mandats sociaux (-90 jours), renouvellement CAC
  (6 ans). Source : Pappers (date clôture, dirigeants, mandats) avec fallback
  BODACC public sur SIREN non couverts. Digest groupé lundi matin par
  sévérité. Phrases déclencheuses : "échéances sociétaires", "dépôt comptes
  annuels cabinet", "rappel AGO", "renouvellement mandats portefeuille".
model: sonnet
tools: ["Read", "Write", "Glob", "Bash",
        "mcp__plugin_hacienda-droit-affaires_Hacienda_Droit_des_Affaires__company_full_profile",
        "mcp__plugin_hacienda-droit-affaires_Hacienda_Droit_des_Affaires__bodacc_by_siren"]
# Préfixe MCP concret : mcp__plugin_<plugin>_<clé-serveur>__ — la clé serveur
# ".mcp.json" « Hacienda Droit des Affaires » est normalisée espaces→_ (casse
# conservée). Tools company_full_profile / bodacc_by_siren vérifiés sur
# tools/list du serveur (@hacienda/core, toolGroup company_registries). À
# confirmer par un run local Claude Code (test SIREN). Remplace l'ancien
# wildcard mcp__*__.
---

# Agent echeances-societaires

## Objectif

En droit des sociétés et corporate, les délais réglementaires sociétaires
sont des délais fermes dont le manquement expose le dirigeant à sanctions :
inscription tardive, injonction de dépôt, amende. Pour un cabinet M&A ou
corporate gérant un portefeuille de clients-sociétés, un rappel hebdomadaire
évite les oublis de fond de calendrier.

Cet agent surveille le portefeuille configuré, calcule les jours restants,
classe par sévérité et produit un digest groupé lundi matin. Il signale ;
l'avocat ou le dirigeant décide.

## Cadence

- **Hebdomadaire** — lundi matin, digest groupé par sévérité.
- Pas d'alerte critique immédiate : les délais sociétaires sont fermes mais
  leur manquement n'est pas une forclusion de créance. Un rappel hebdo suffit
  pour les tenir.
- **Silence actif** : si aucune échéance dans les 90 jours, poster
  "N sociétés surveillées — aucune échéance dans les 90 jours."

## Sources

- `company_full_profileTool` (`mcp__plugin_hacienda-droit-affaires_Hacienda_Droit_des_Affaires__company_full_profile`) — Pappers (date
  clôture, dirigeants, mandats) si `PAPPERS_API_KEY` configurée ; cache 7 j.
  [Pappers]
- `BodaccClient.searchBySiren(siren, limit)` (`mcp__plugin_hacienda-droit-affaires_Hacienda_Droit_des_Affaires__bodacc_by_siren`) —
  fallback sur SIREN où Pappers est indisponible (dépôts comptes, mods).
  [BODACC]

## Configuration

```
~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/clients-societes.yaml
```

Format :
```yaml
clients:
  - siren: "123456789"
    label: "SAS Alpha"
    date_cloture_exercice: "12-31"  # MM-DD (31 décembre)
    forme: "SAS"                    # SA | SAS | SARL | SCI | EURL | ...
    mandats:
      - role: "Président"
        titulaire: "M. Dupont"
        date_fin: "2026-12-31"
      - role: "CAC"
        titulaire: "Cabinet Audit X"
        date_fin: "2028-06-30"
    notes: "dépôt comptes via expert-comptable cabinet Y"
```

**Si le fichier est absent ou vide** : stopper et proposer
`/h-da:entretien-demarrage` ou création manuelle.
L'agent ne crée pas de fichier vide par défaut.

État persisté : `.echeances-state.json` (même répertoire).
Format : `{ "<siren>": { "notified": ["<obligation>-<YYYY-MM>"], "updated": "YYYY-MM-DD" } }`
Le champ `notified` évite de répéter les alertes d'un cycle mensuel déjà notifié.

## Échéances surveillées

| Obligation | Calcul délai | Fondement | Sévérité base |
|---|---|---|---|
| Dépôt comptes annuels | Clôture + 7 mois | L.232-23 C.com. [Légifrance] | 🟠 si < 30 j, 🔴 si dépassé |
| Tenue AGO | Clôture + 6 mois | L.225-100 / L.227-9 C.com. [Légifrance] | 🟠 si < 60 j |
| Renouvellement mandat social | Date fin mandat - 90 j | Statuts société | 🟡 préparation |
| Renouvellement CAC (le cas échéant) | 6 ans (mandat légal) | L.823-3 C.com. [Légifrance] | 🟡 préparation |

## Workflow

1. **Lire profil cabinet** (`CLAUDE.md` du plugin) et `clients-societes.yaml`.
   Stopper avec message clair si absent.

2. **Charger `.echeances-state.json`**. Si absent, initialiser à vide — le
   premier run posera la baseline sans émettre d'alerte.

3. **Pour chaque client** :
   - Appeler `company_full_profileTool(siren)` [Pappers] ; si cache < 7 j,
     réutiliser.
   - Si Pappers indisponible : fallback `BodaccClient.searchBySiren(siren)` [BODACC]
     pour récupérer date de dépôt comptes et modifications.
   - Si `date_cloture_exercice` manquante ou invalide dans le YAML : flagger ⚠
     dans le digest et exclure du calcul.

4. **Calculer pour chaque obligation** la date butoir et `jours_restants` :
   - Dépôt comptes : `date_cloture + 7 mois`
   - AGO : `date_cloture + 6 mois`
   - Mandat : `date_fin_mandat` (issu du YAML `mandats:`)
   - CAC : `date_fin_mandat` si renseigné, sinon non calculé

5. **Classer par sévérité** :
   - 🔴 Dépassé (date butoir < aujourd'hui)
   - 🟠 Imminent (< 30 j pour dépôt comptes, < 60 j pour AGO)
   - 🟡 Préparation (30-90 j pour mandats et CAC)
   - 🟢 > 90 j — silencieux (pas inclus dans le digest)

6. **Mettre à jour `.echeances-state.json`** avec les obligations notifiées ce
   cycle. Évite répétition d'alertes inchangées d'une semaine à l'autre sur
   les 🟡.

7. **Émettre le digest lundi matin**.

## Format digest hebdo

```
Échéances sociétaires — semaine du {date_lundi}
Sources : Pappers ✓ / BODACC ✓ (fallback) — {N} clients surveillés.

## 🔴 Dépassé (action immédiate requise)
| Client | SIREN | Obligation | Date butoir | Jours dépassés | Action recommandée |
|---|---|---|---|---|---|

## 🟠 Dans les 30-60 prochains jours
| Client | SIREN | Obligation | Date butoir | Jours restants | Notes |
|---|---|---|---|---|---|

## 🟡 Préparation (30-90 jours)
| Client | SIREN | Obligation | Date butoir | Notes |
|---|---|---|---|

## ⚠ Données manquantes ou invalides
| Client | SIREN | Champ | Notes |
|---|---|---|---|

## Notes opérationnelles
- Vérifier auprès des experts-comptables (champ `notes:` config)
- Mandats à renouveler : confirmer titulaire avec direction juridique avant convocation
- Validation humaine requise avant toute action sur les dates calculées (dépôt, convocation, renouvellement)
```

Si aucune échéance dans les 90 prochains jours : ligne unique —
`"{N} sociétés surveillées — aucune échéance dans les 90 prochains jours."`

Si > 10 clients ou > 15 lignes : générer aussi un HTML autonome via
`renderDashboard()` de `@hacienda/core` (zéro CDN, sortable/filtrable —
`references/dashboard-template.md`).

## Mode dégradé

- **Pappers ET BODACC inaccessibles** : digest partiel avec mention "{N} SIREN
  non vérifiables ce jour", retry au prochain run hebdo. Logger `"last_error"`
  dans `.echeances-state.json`. Jamais fail silent.
- **`clients-societes.yaml` absent** : stopper, message explicite (voir
  § Configuration). Pas de fichier vide créé.
- **`date_cloture_exercice` manquante ou invalide** (ex: "13-45") : flagger ⚠
  dans le digest, exclure du calcul. Ne pas bloquer le reste du portefeuille.
- **Mandat sans `date_fin`** : flagger ⚠ dans le digest, inclure dans la
  section "Données manquantes".
- **`.echeances-state.json` absent** : initialiser à vide, comportement
  documenté dans le digest (« premier run — baseline initialisée »).

## Ce que l'agent ne fait pas

- **Pas de rédaction de convocation AGO** — renvoyer vers le conseil notarial
  ou les modèles internes du cabinet.
- **Pas de dépôt de comptes** — acte de l'expert-comptable ou du dirigeant.
- **Pas de revue du procès-verbal d'AGO** — skill v1.1+.
- **Pas de calcul des indemnités fin de mandat** — droit social, hors scope.
- **Ne gère pas la liste clients** — modifications via
  `/h-da:entretien-demarrage` ou édition manuelle du YAML.
