---
name: revue-tabulaire
description: >
  Extraction structurée de N documents en parallèle vers un tableau, colonnes
  paramétrables. Brique atomique : remplace la revue manuelle "10 NDA à
  passer en revue". Réutilisée comme building block par
  due-diligence-dataroom (v1.1). Exemple : extraire durée + non-conc + loi
  + juridiction sur 12 NDA d'un coup.
version: "2.0.0"
argument-hint: "[documents, colonnes à extraire, format de sortie]"
authors: ["Hacienda"]
tags: [extraction, multi-docs, tableau, brique-atomique]
---

# Skill — Revue tabulaire multi-documents

> **EXTRACTION STRUCTURÉE PARALLÈLE.**
>
> Brique atomique : prend N documents + une liste de colonnes, retourne
> un tableau. Pas d'analyse juridique en profondeur — utiliser
> `reviser-contrat` pour ça. Idéal pour comparer un portefeuille de
> contrats sur quelques critères clés.
>
> Ce skill **n'attribue pas de criticité juridique** : les colonnes
> contiennent les valeurs extraites du texte. Les lignes incomplètes
> sont signalées `⚠️ à vérifier`, les informations absentes = `—`.
> Pour l'analyse approfondie clause par clause, passer ensuite à
> `reviser-contrat` ou `reviser-nda`.

---

## Examples

<example>
<user>/h-da:revue-tabulaire ./ndas/*.pdf --colonnes="durée,non-concurrence,loi-applicable,juridiction"</user>
<response>
1. Lecture profil cabinet.
2. Paramètres : 12 NDA, 4 colonnes (durée / non-concurrence / loi-applicable / juridiction)
3. Extraction parallèle — chaque document lu une fois, valeurs extraites pour les 4 colonnes
4. Tableau 12 lignes × 4 colonnes produit, lignes incomplètes signalées ⚠️ à vérifier
5. 2 NDA avec durée illisible ou absente → — dans la cellule, signalé en note du relecteur
6. Sortie : en-tête confidentialité + note du relecteur + tableau + question hors checklist + arbre de décision
</response>
</example>

<example>
<user>/h-da:revue-tabulaire ./contrats-distribution/*.pdf --colonnes="parties,date-signature,date-expiration,exclusivite,territoire,droit-applicable"</user>
<response>
Lot de 8 contrats de distribution → extraction 6 colonnes :
- Lecture rapide de chaque document, extraction des valeurs textuelles
- Cellules vides ou ambiguës : — (information absente) ou ⚠️ à vérifier (présente mais illisible/contradictoire)
- Aucune attribution de criticité (🔴/🟠/🟡/🟢) — ce skill ne fait pas l'analyse : utiliser reviser-contrat si besoin
- Sortie tableau 8 lignes × 6 colonnes + note du relecteur + arbre de décision
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md` :
> - **Rôle de l'utilisateur courant** — pour l'en-tête de confidentialité

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : stopper et
demander `/h-da:entretien-demarrage` avant toute extraction
substantielle.

---

## Intake

1. **Pattern documents** — chemin ou glob vers les fichiers à analyser
   (ex : `./ndas/*.pdf`, `./lot-contrats/`, liste de chemins séparés par des espaces)
2. **Colonnes** — liste des colonnes à extraire, sous forme d'alias séparés par des virgules
   (ex : `--colonnes="durée,non-concurrence,loi-applicable,juridiction"`)
3. **Format sortie** (optionnel) — `--format=markdown` (défaut) | `--format=csv`
   (pour export tableur)
4. **Limit** (optionnel) — `--limit=N` pour ne traiter que les N premiers documents
   du lot (utile pour valider la configuration des colonnes avant de lancer sur tout le lot)

### Alias de colonnes disponibles

| Alias | Signification | Valeur extraite |
|---|---|---|
| durée | Durée contractuelle | Valeur texte (ex : "3 ans", "indéterminée") |
| date-signature | Date de signature | Date ou — |
| date-expiration | Date d'expiration ou d'échéance | Date ou — |
| date-effet | Date d'entrée en vigueur | Date ou — |
| parties | Raison sociale des parties | Noms extraits |
| loi-applicable | Clause de loi applicable | Droit identifié (ex : "droit français") |
| juridiction | Clause attributive de juridiction | Tribunal ou cour identifiée |
| non-concurrence | Présence et périmètre clause non-concurrence | Résumé ou — |
| exclusivite | Présence et périmètre clause d'exclusivité | Résumé ou — |
| territoire | Périmètre géographique du contrat | Valeur texte |
| prix | Prix, rémunération ou plafond financier | Valeur texte ou — |
| paiement | Délai et modalités de paiement | Valeur texte ou — |
| resiliation | Conditions et préavis de résiliation | Valeur texte |
| confidentialite | Présence et durée clause de confidentialité | Résumé ou — |
| force-majeure | Présence clause de force majeure | Présente / Absente / ⚠️ à vérifier |
| limitation-resp | Présence et plafond clause de limitation de responsabilité | Résumé ou — |
| clause-penale | Présence et montant clause pénale | Résumé ou — |

> **Colonnes libres.** Si un alias n'est pas dans le tableau ci-dessus, le skill
> tente l'extraction en interprétant le libellé en langage naturel. Signaler dans
> la note du relecteur si l'interprétation est incertaine.

---

## Gate non-juriste

- [ ] Profil cabinet lu, rôle utilisateur identifié pour l'en-tête de confidentialité
- [ ] Lot inventorié : N documents comptés, fichiers illisibles signalés
- [ ] Colonnes demandées reconnues (alias ou libellé libre interprété et noté)
- [ ] Extraction sans criticité (🔴/🟠/🟡/🟢) dans les cellules du tableau
- [ ] Cellules vides = `—`, incertaines = `⚠️ à vérifier` (jamais vide sans raison)
- [ ] Tags de provenance sans backticks dans les cellules
- [ ] Sortie comprend : en-tête confidentialité (4 variantes) + note du relecteur
  (5 champs canoniques) + tableau + question hors checklist + arbre de décision 5 options
- [ ] Dashboard HTML généré si > 10 lignes

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/revue-tabulaire-{slug}-YYYY-MM-DD.md
```

Si le lot dépasse 10 lignes, générer en parallèle :
```
outputs/revue-tabulaire-{slug}-YYYY-MM-DD.html
```
via `renderDashboard()` de `@hacienda/core` (format autonome, ouvrable hors-ligne).

---

## Sortie

```
[En-tête de confidentialité selon le rôle utilisateur — 4 variantes]

> ⚠️ Note du relecteur
> - **Sources :** [bases consultées : Légifrance ✓ / Pappers ✓ / BODACC ✓ — ou ✗ si non connectée | sans objet si extraction pure]
> - **Lecture :** [{N} documents traités sur {N} dans le lot | {N} fichiers sautés : [liste]]
> - **Signalé pour ton jugement :** [{N} cellules marquées [review] | aucune]
> - **Fraîcheur :** [sans objet (extraction, pas d'analyse normative) | vérifier [règles] si colonnes normatives]
> - **Avant de t'appuyer dessus :** [{N} lignes incomplètes (⚠️ à vérifier) à contrôler manuellement | prêt pour relecture]

# Revue tabulaire — {slug-lot} — {date}

**Lot :** {N} documents · **Colonnes :** {liste} · **Format :** Markdown

| # | Fichier | {Colonne 1} | {Colonne 2} | ... |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

{Si > 10 lignes : "Dashboard HTML généré → outputs/revue-tabulaire-{slug}-YYYY-MM-DD.html"}

## Étape 1 — Inventaire

1. Lire le profil cabinet (CLAUDE.md droit-affaires) — rôle
   utilisateur pour l'en-tête de confidentialité.
2. Inventorier les fichiers du lot : compter N documents, vérifier que les
   formats sont lisibles (PDF, DOCX, Markdown). Si un fichier est illisible ou
   tronqué : le signaler explicitement dans la note du relecteur, ne pas l'omettre
   silencieusement du tableau.
3. Si `--limit=N` est actif : traiter uniquement les N premiers fichiers, signaler
   le lot restant dans la note du relecteur.

---

## Étape 2 — Extraction parallèle

Pour chaque document du lot, lire le document et extraire les valeurs pour chacune
des colonnes demandées.

**Règles d'extraction :**

- Extraire la valeur textuelle telle qu'elle apparaît dans le document, sans
  paraphrase excessive. Si la clause est présente mais ambiguë : citer le libellé
  court entre guillemets et ajouter `[review]`.
- Information absente dans le document : cellule `—`.
- Information présente mais illisible, contradictoire, ou dont l'extraction est
  incertaine : cellule `⚠️ à vérifier`.
- **Pas de criticité (🔴/🟠/🟡/🟢)** dans les cellules du tableau — ce skill
  extrait, il n'analyse pas. Exception : si une valeur extraite déclenche
  manifestement un risque signalé dans `clauses-sensibles-fr.md` (ex : non-concurrence
  sans contrepartie visible), ajouter une note `[review]` dans la cellule sans
  changer la valeur.
- Tags de provenance dans les cellules : **sans backticks**. Ex : [Pappers],
  [utilisateur fourni], [à vérifier].
- Si une colonne `parties` est demandée et qu'un SIREN de 9 chiffres est détecté,
  tenter l'enrichissement via `company_full_profile` de `@hacienda/core`. Annoter
  la cellule avec [Pappers] si l'API a répondu, [BODACC] si fallback public.

---

## Étape 3 — Consolidation du tableau

Produire un tableau Markdown avec :
- Une ligne d'en-tête : `# Doc` + une colonne par alias demandé
- Une ligne par document, dans l'ordre du lot (pas de re-tri automatique)
- Lignes incomplètes (au moins une cellule `⚠️ à vérifier`) : comptabilisées
  séparément dans la note du relecteur

```
| # | Fichier | Colonne 1 | Colonne 2 | ... |
|---|---|---|---|---|
| 1 | nda-fournisseur-A.pdf | 3 ans | — | droit français | TC Paris |
| 2 | nda-fournisseur-B.pdf | 5 ans | 2 ans sans contrepartie [review] | droit anglais [review] | LCIA |
| 3 | nda-partenaire-C.pdf | ⚠️ à vérifier | — | droit français | TC Paris |
```

Si le lot dépasse 10 lignes, générer en parallèle un fichier HTML autonome
via `renderDashboard()` de `@hacienda/core` (sortable, filtrable, ouvrable
hors-ligne, zéro CDN, XSS-safe). Voir `${CLAUDE_SKILL_DIR}/../../references/dashboard-template.md`.

---

## Étape 4 — Post-flight

Appel automatique de `verifier-citations` uniquement si les colonnes demandées
contiennent des références normatives (ex : loi applicable mentionnant un article).
Pour une extraction pure de valeurs contractuelles (durée, parties, territoire) :
`verifier-citations` n'est pas déclenché — noter `sans objet` dans la note du
relecteur champ Fraîcheur.

---

## Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait (ex : documents de
langues différentes dans le lot, dates d'expiration imminentes détectées, absence
systématique d'une clause dans tout le lot). Omettre la ligne si rien d'honnête
à dire — ne pas fabriquer.}

## Que veux-tu faire ? Choisis une option :

1. **Rédiger une note de synthèse comparative** — je produis une note structurée
   identifiant les divergences entre documents sur les colonnes clés.
2. **Escalader** — note d'escalade vers {approbateur configuré} sur les lignes
   marquées [review] ou ⚠️ à vérifier, avec décision attendue.
3. **Compléter les faits** — questions ciblées à poser aux parties ou à la
   contrepartie pour résoudre les cellules ⚠️ à vérifier.
4. **Surveiller et attendre** — ajouter le tableau au tracker du dossier avec
   date de revisite et note motivée.
5. **Autre** — précise.
```

### En-tête de confidentialité — 4 variantes selon rôle

| Rôle | En-tête à apposer |
|------|-------------------|
| Avocat inscrit à un barreau français | `CONFIDENTIEL — DOCUMENT DE TRAVAIL — Secret professionnel art. 66-5 loi n°71-1130 du 31 décembre 1971` |
| Notaire (officier public) | `CONFIDENTIEL — TRAVAIL NOTARIAL — Devoir de discrétion art. 23 loi 25 ventôse an XI` |
| Juriste in-house (non avocat) | `NOTES DE TRAVAIL INTERNES — NE CONSTITUE PAS UN AVIS JURIDIQUE — Faire valider par un avocat avant tout acte` |
| Non-juriste avec accès avocat | `NOTES DE TRAVAIL — Faire valider par [avocat référent configuré] avant tout usage externe` |

---

## Ce skill ne fait pas

- Analyse juridique clause par clause → utiliser `reviser-contrat`.
- Triage NDA avec verdict 🟢/🟠/🔴 → utiliser `reviser-nda`.
- Revue avec attribution de criticité par clause → `liste-de-points` (mode standalone).
- Due diligence dataroom complète → `due-diligence-dataroom` (v1.1, ce skill en est
  un building block).
- Donner un avis juridique sur les valeurs extraites — le tableau est un outil de
  repérage, pas d'analyse.

---

> Sortie brouillon soumise à **validation humaine** avant tout usage externe.
