---
name: liste-de-points
description: >
  Génère une issues list (liste de points à négocier) à partir d'une analyse
  de contrat. Appelable directement OU comme composant interne par
  reviser-contrat / gap-review. Format tableau standardisé criticité
  décroissante 🔴 → 🟢, avec position souhaitée et formulation alternative
  pour chaque point.
version: "2.0.0"
argument-hint: "[contrat ou analyse source, position client]"
authors: ["Hacienda"]
tags: [issues-list, negotiation, composable]
---

# Skill — Liste de points (issues list)

> **COMPOSANT RÉUTILISABLE.**
>
> Ce skill génère une issues list structurée à partir des findings d'une analyse
> de contrat. Il peut être appelé de deux façons :
>
> - **Mode standalone** — directement par l'utilisateur sur un fichier d'analyse
>   existant (`--from-analysis ./fichier.md`) : la sortie est complète avec
>   en-tête de confidentialité, note du relecteur, tableau de points et arbre
>   de décision 5 options.
> - **Mode composant** — invoqué en interne par `reviser-contrat` ou `gap-review`
>   avec un array de findings en input : la sortie est uniquement le tableau
>   (pas d'en-tête, pas de note du relecteur — c'est le skill caller qui les
>   fournit).
>
> Toute sortie est un brouillon soumis à validation humaine (avocat) avant transmission ou
> ouverture de négociation formelle.

---

## Examples

<example>
<user>/h-da:liste-de-points --from-analysis ./analyse-contrat-SPA.md --posture=protecteur</user>
<response>
Mode standalone détecté (fichier d'analyse fourni).
1. Lecture profil cabinet (posture protecteur override, clauses "jamais acceptées")
2. Parsing du fichier analyse-contrat-SPA.md — 9 findings extraits
3. Calibrage positions souhaitées selon posture protecteur (clauses-sensibles-fr.md)
4. Tri par criticité décroissante : 2 🔴, 3 🟠, 3 🟡, 1 🟢
5. Sortie complète : en-tête confidentialité + note du relecteur + tableau + arbre de décision
</response>
</example>

<example>
<user>(invoqué en interne par reviser-contrat avec findings array)</user>
<response>
Mode composant détecté (findings array reçu en input).
Paramètres reçus : 7 findings, posture=équilibré (profil cabinet).
Calibrage positions et formulations selon posture équilibré.
Tri stable 🔴 → 🟠 → 🟡 → 🟢, à égalité de criticité tri par numéro de clause.
Retour : tableau seul (6 colonnes). En-tête et note du relecteur fournis par reviser-contrat.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md` :
> - **Posture par défaut** — protecteur / équilibré / facilitateur
> - **Clauses "jamais acceptées"** — listées dans le bloc contrats commerciaux
> - **Positions clés** — clause pénale (1231-5 C.civ), limitation de responsabilité,
>   droit applicable et juridiction, non-concurrence
> - **Matrice d'approbateurs** — par type d'acte
> - **Politique PII** — `passive` / `active` (défaut) / `strict` + seuil B

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : stopper et
demander `/h-da:entretien-demarrage`. Seule exception : en
mode composant invoqué par un skill caller qui a déjà vérifié le profil.

---

## Intake

1. **Mode** :
   - `--from-analysis ./fichier.md` — parsing d'un fichier d'analyse Markdown existant
   - **Appel programmatique** — réception d'un array `[{ clause, statut, risque, article, ... }]`
     directement du skill caller (reviser-contrat, gap-review)
2. **Posture override** (optionnel) — `--posture=protecteur` | `--posture=équilibré` |
   `--posture=opportuniste` | `--posture=asymétrique`
   Force la posture pour cette exécution sans modifier le profil.
3. **Filter** (optionnel) — `--min-criticite=orange` pour ne montrer que 🟠 et 🔴
   (exclut 🟡 et 🟢 du tableau)

---

## Gate non-juriste

- [ ] Profil cabinet lu et posture applicable identifiée (ou override actif)
- [ ] Findings correctement lus ou reçus du skill caller
- [ ] Positions souhaitées et formulations calibrées selon posture (clauses-sensibles-fr.md)
- [ ] Tableau trié 🔴 → 🟠 → 🟡 → 🟢, aucun doublon, aucun remplissage
- [ ] Plancher de sévérité respecté (pas de rétrogradation silencieuse)
- [ ] Mode standalone : en-tête + note du relecteur 5 champs + tableau + question hors checklist + arbre 5 options
- [ ] Mode composant : tableau seul (pas d'en-tête, pas de note du relecteur)

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

Écrire les livrables dans le dossier de pratique ou de dossier configuré : `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/outputs/` ou `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/matters/<slug-dossier>/outputs/`.

## Sortie

### Mode composant (invoqué par reviser-contrat ou gap-review)

Retourner **uniquement le tableau** en Markdown pur.
Pas d'en-tête de confidentialité. Pas de note du relecteur. Pas d'arbre de
décision. Le skill caller fournit ces éléments dans sa propre sortie structurée.

### Mode standalone (appelé directement par l'utilisateur)

Sortie complète dans l'ordre suivant :

```
[En-tête de confidentialité selon le rôle utilisateur — 4 variantes]

> ⚠️ Note du relecteur
> - **Sources :** [bases consultées : Légifrance ✓ / Judilibre ✓ — ou ✗ si non connectée] ; articles lus dans cette session : [liste] ; autres citations : `[à vérifier]`
> - **Lecture :** [fichier d'analyse lu intégralement | N findings extraits | sans objet]
> - **Signalé pour ton jugement :** [N éléments marqués [review] en ligne | aucun]
> - **Fraîcheur :** [recherche des évolutions depuis [date] — rien trouvé | N mises à jour intégrées | recherche impossible, vérifier [règles précises]]
> - **Avant de t'appuyer dessus :** [action concrète OU « prêt pour relecture »]

# Liste de points — {type de contrat} — {parties ou slug} — {date}

| # | Clause | Statut | Risque | Position souhaitée | Formulation proposée |
|---|---|---|---|---|---|
| ... | ... | 🔴/🟠/🟡/🟢 | ... | ... | ... |

# Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait. Omettre la ligne
si rien d'honnête à dire — ne pas fabriquer.}

# Que veux-tu faire ? Choisis une option :

1. **Rédiger** — je produis un projet de courrier de négociation à la contrepartie
   reprenant la liste de points priorisée.
2. **Escalader** — note d'escalade vers {approbateur configuré} avec faits-clés,
   risque dominant et décision attendue.
3. **Compléter les faits** — questions ouvertes à poser à {PM / client / contrepartie
   / conseil} avant d'avancer.
4. **Surveiller et attendre** — ajouter le sujet au tracker du dossier avec note
   motivée et date de revisite.
5. **Autre** — précise.
```

### En-tête de confidentialité — 4 variantes selon rôle

| Rôle | En-tête à apposer |
|------|-------------------|
| Avocat inscrit à un barreau français | `CONFIDENTIEL — DOCUMENT DE TRAVAIL — Secret professionnel art. 66-5 loi n°71-1130 du 31 décembre 1971` |
| Notaire (officier public) | `CONFIDENTIEL — TRAVAIL NOTARIAL — Devoir de discrétion art. 23 loi 25 ventôse an XI` |
| Juriste in-house (non avocat) | `NOTES DE TRAVAIL INTERNES — NE CONSTITUE PAS UN AVIS JURIDIQUE — Faire valider par un avocat avant tout acte` |
| Non-juriste avec accès avocat | `NOTES DE TRAVAIL — Faire valider par [avocat référent configuré] avant tout usage externe` |

### Mode silencieux (livrable externe)

Si l'utilisateur précise que la sortie est destinée à une contrepartie ou
à un destinataire non-juriste :
- Conserver l'en-tête de confidentialité et la note du relecteur.
- Retirer la narration de skill et les renvois inter-commandes (les placer dans
  un message séparé).
- Le tableau doit se lire comme s'il avait été rédigé par un associé.

---

## Étape 1 — Lire ou recevoir les findings

### Via fichier Markdown (`--from-analysis`)

Parser le fichier pour en extraire chaque finding. Format attendu dans le fichier source :
lignes de tableau, puces ou blocs structurés contenant les champs :
- numéro ou libellé de clause
- statut (🔴 / 🟠 / 🟡 / 🟢 ou équivalent textuel : Bloquant / Élevé / Moyen / Faible)
- risque (description courte)
- article applicable (si présent)
- tout champ complémentaire disponible (comparaison playbook, citation dans le contrat)

Si le fichier est illisible ou tronqué : signaler explicitement, ne pas analyser
un document incomplet sans avertissement.

Si aucun finding n'est trouvé dans le fichier : retourner explicitement
`Aucun finding extrait du fichier fourni — vérifier le format du fichier d'analyse.`
Ne pas fabriquer de points de remplissage.

### Via array programmatique (mode composant)

Recevoir le tableau de findings tel que produit par le skill caller.
Structure attendue par finding :

```json
{
  "clause": "Clause 12 — Limitation de responsabilité",
  "citation": "La responsabilité du prestataire est limitée à 1 €",
  "comparaison_playbook": "écart majeur",
  "statut": "🔴",
  "risque": "Prive l'obligation essentielle de sa substance (art. 1170 C.civ)",
  "article": "art. 1170 C.civ",
  "position_souhaitee": null,
  "formulation_proposee": null
}
```

Les champs `position_souhaitee` et `formulation_proposee` peuvent être vides :
ils seront remplis à l'Étape 2.

---

## Étape 2 — Calibrer position et formulation selon posture

Pour chaque finding, dériver la position souhaitée et la formulation proposée
à partir de la posture active (playbook profil ou override) et de la référence
`${CLAUDE_SKILL_DIR}/../../references/clauses-sensibles-fr.md` (source de vérité pour les 15 clauses pilotes).

**Règles de calibrage par posture :**

- **Protecteur** — position de refus ou de modification substantielle ; formulation
  ferme, carve-outs maximaux, prérogatives encadrées. Prioriser la protection
  face aux risques juridiques et financiers.
- **Équilibré** — position de négociation ciblée sur les points structurants ;
  formulation symétrique, recherche d'un équilibre entre les parties. Accepter
  des compromis sur les points secondaires.
- **Opportuniste** — position offensive sur les clauses favorables ; maximiser
  les prérogatives du client, chercher à améliorer le contrat par rapport à la
  version soumise. `[review]`
- **Asymétrique** — traitement différencié selon le type de clause ; protecteur
  sur les clauses de risque (responsabilité, pénales, résolution), facilitateur
  sur les clauses opérationnelles. `[review]`

Si la posture active n'est pas déterminée (profil `[A CONFIGURER]` et pas
d'override) : utiliser la posture équilibré par défaut et signaler dans la note
du relecteur.

**Plancher de sévérité.** Ne jamais rétrograde la criticité d'un finding de
🔴 à 🟡 sans justification explicite. Si une clause est dans la liste
"jamais acceptées" du profil, la marquer 🔴 systématiquement.

**Tag inline `[review]`** sur tout jugement subjectif : qualification d'une
obligation essentielle (1170 C.civ), seuil du déséquilibre significatif
(L.442-1 C.com.), proportionnalité d'une clause pénale.

---

## Étape 3 — Format tableau

Produire le tableau trié par criticité décroissante : 🔴 → 🟠 → 🟡 → 🟢.
À criticité égale, tri stable par numéro de clause dans le contrat.

Si `--min-criticite=orange` est actif : exclure les lignes 🟡 et 🟢 du tableau.

```
| # | Clause | Statut | Risque | Position souhaitée | Formulation proposée |
|---|---|---|---|---|---|
| 1 | Clause 12 — Limitation de responsabilité | 🔴 | Prive l'obligation essentielle de sa substance (art. 1170 C.civ) | Plafond multiple des sommes payées 12 mois + carve-outs dol, faute lourde, confidentialité | "La responsabilité de chaque partie est plafonnée aux montants payés au titre des 12 derniers mois, à l'exclusion des cas de dol, faute lourde, atteintes corporelles et violations de confidentialité." |
| 2 | Clause 8 — Clause pénale | 🟠 | Taux automatique de 30 % sans lien avec le préjudice prévisible — risque de réduction judiciaire (art. 1231-5 C.civ) | Taux proportionné + articulation avec limitation de responsabilité | "En cas de manquement grave, indemnité forfaitaire égale à [10] % des sommes HT engagées, sans préjudice des dommages en cas de faute lourde." |
```

Une ligne par clause. Pas de doublon. Le tableau est l'artefact central
transmis à la contrepartie ou à l'équipe de négociation.

Si aucun finding ne dépasse le filtre actif (ou si la liste d'entrée est vide
après nettoyage) : retourner explicitement
`Aucun point de vigilance identifié selon les critères appliqués.`
Ne pas fabriquer de lignes de remplissage.

---

## Emplacement des sorties (mode standalone)

```
outputs/liste-de-points-<type>-<parties-slug>-YYYY-MM-DD.md
```

Si la liste dépasse 10 lignes ou contient des montants sérialisables,
générer en parallèle un dashboard HTML autonome via `renderDashboard()`
de `@hacienda/core` (voir `${CLAUDE_SKILL_DIR}/../../references/dashboard-template.md`).

---

## Ce skill ne fait pas

- Analyser un contrat clause par clause → utiliser `reviser-contrat`.
- Trier un NDA → utiliser `reviser-nda`.
- Vérifier les citations juridiques → c'est le rôle de `verifier-citations`,
  appelé par le skill caller en mode standalone.
- Modifier le profil cabinet ou la configuration.
- Produire un avis juridique ou une recommandation de signature.

> Points non vérifiés dans une source consultée sont marqués `[à vérifier]`.
