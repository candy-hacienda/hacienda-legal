---
name: consulter-digest
description: >
  Lit et présente le digest de veille juridique produit par l'agent
  veille-jurisprudence. Permet de filtrer par domaine de pratique, par date
  ou par criticité d'impact. Skill de lecture — ne produit pas d'analyse
  juridique nouvelle.
version: "2.0.0"
argument-hint: "[domaine, période, criticité]"
authors: ["Hacienda"]
tags: [veille, digest, jurisprudence, consultation]
---

# Skill — Consulter le digest de veille

> **LECTURE SEULE — PAS D'ANALYSE JURIDIQUE NOUVELLE.**
>
> Ce skill **lit et restitue** le digest hebdomadaire produit par l'agent
> `veille-jurisprudence`. Il applique les filtres demandés (domaine, date,
> criticité) et ordonne les entrées par pertinence selon les domaines du
> profil cabinet. Il ne réinterprète **pas** les arrêts, ne donne pas d'avis
> et ne produit aucune analyse juridique nouvelle.
>
> Si aucun digest n'est disponible sur disque, ce skill ne peut pas
> fonctionner : lancer d'abord l'agent `veille-jurisprudence` pour générer
> un digest, puis revenir ici.
>
> Les entrées du digest restituées sont des résumés produits par l'agent —
> ils demeurent des **brouillons soumis à validation humaine**.

---

## Examples

<example>
<user>/h-da:consulter-digest</user>
<response>
Lecture du digest le plus récent :
`~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/veille/latest.md`

Digest du 2026-05-19 — 2 domaines, 4 entrées.
Domaines configurés dans le profil cabinet : contrats, societes, ma, procedures-collectives.

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`
> et `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/veille-config.yaml` :
> - **Domaines de pratique configurés** — pour ordonner les entrées du digest
>   par pertinence (les domaines du profil cabinet passent en premier)
> - **Rôle de l'utilisateur courant** — conditionne l'en-tête de confidentialité
>   (avocat / notaire / juriste in-house / non-juriste)
> - **Politique PII** — `passive` / `active` (défaut) / `strict`

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : poursuivre
sans personnalisation de l'ordre — afficher le digest dans l'ordre du fichier,
sans tri par domaine cabinet.

---

## Intake

1. **Cible** — `latest` par défaut (fichier `latest.md`) ; ou une date au format
   `YYYY-MM-DD` pour lire un digest daté (`digest-YYYY-MM-DD.md`).
2. **Filtre optionnel** :
   - `--domaine=<nom>` — restreindre l'affichage à un domaine (`contrats`,
     `societes`, `ma`, `procedures-collectives`, ou tout domaine configuré)
   - `--depuis=YYYY-MM-DD` — n'afficher que les entrées postérieures à cette date
     (filtrage sur la date de la disposition ou de l'arrêt)
   - `--impact=<valeur>` — filtrer par action requise :
     `mise-a-jour-playbook` | `information-client` | `modification-modele` | `aucune`

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

```
[En-tête de confidentialité selon le rôle utilisateur — voir les 4 variantes dans CLAUDE.md du plugin §2]

> **⚠️ Note du relecteur**
> - **Sources :** Digest du {YYYY-MM-DD} — Légifrance {✓/✗} / Judilibre ch. commerciale {✓/✗} (statut repris de l'en-tête du digest)
> - **Lecture :** digest {complet | filtré sur domaine "{domaine}" | filtré sur impact "{impact}" | filtré depuis {YYYY-MM-DD}} — {N} entrée(s) restituée(s) sur {N total}
> - **Signalé pour ton jugement :** {N} éléments marqués [review] dans le digest | aucun
> - **Fraîcheur :** digest produit le {YYYY-MM-DD} — éléments postérieurs au {last_run} — {N} textes / {N} arrêts
> - **Avant de t'appuyer dessus :** {action concrète — ex. « lancer un nouveau digest si la date est > 7 jours » | « prêt pour consultation »}

{Digest filtré et restitué, structuré par domaine selon l'ordre de pertinence}

{Note du relecteur de l'agent veille-jurisprudence, si présente dans le digest}

## Contrats commerciaux

### Jurisprudence chambre commerciale

**Cour de cassation, ch. com., 2026-05-14, n° 24-18.302**
- **Source :** Judilibre [Judilibre]
- **Résumé :** La chambre commerciale rappelle qu'une clause limitative de responsabilité qui prive l'obligation essentielle de sa substance est réputée non écrite (art. 1170 C.civ.).
- **Impact pratique :** Revoir les clauses de plafonnement dans les contrats de prestation, en particulier quand le plafond est symbolique au regard du prix du contrat.
- **Action requise :** modification modèle

---

## Sociétés

### Nouvelles dispositions

**Décret n°2026-412 du 2026-05-02**
- **Source :** Légifrance JORF
- **Résumé :** Simplification des formalités de dépôt des comptes annuels pour les SAS de moins de 50 salariés.
- **Impact pratique :** Mise à jour des procédures de clôture pour les portefeuilles SAS de taille intermédiaire.
- **Action requise :** mise à jour playbook

---

⚠️ Note du relecteur
- Sources : digest du 2026-05-19 — Légifrance ✓ / Judilibre ch. commerciale ✓
- Fraîcheur : éléments postérieurs au 2026-05-12 — 1 texte / 1 arrêt
- Signalé pour ton jugement : aucun [review] dans ce digest
- Avant de t'appuyer dessus : valider la pertinence de l'action requise par domaine.
</response>
</example>

<example>
<user>/h-da:consulter-digest --domaine=societes</user>
<response>
Filtre appliqué : domaine = `societes`.
Lecture de `latest.md` — digest du 2026-05-19.

## Sociétés — 1 entrée après filtrage

### Nouvelles dispositions

**Décret n°2026-412 du 2026-05-02**
- **Source :** Légifrance JORF
- **Résumé :** Simplification des formalités de dépôt des comptes annuels pour les SAS de moins de 50 salariés.
- **Impact pratique :** Mise à jour des procédures de clôture pour les portefeuilles SAS de taille intermédiaire.
- **Action requise :** mise à jour playbook

---

⚠️ Note du relecteur
- Sources : digest du 2026-05-19 (filtré sur domaine "societes")
- Fraîcheur : éléments postérieurs au 2026-05-12
- Signalé pour ton jugement : aucun [review]
- Avant de t'appuyer dessus : valider la pertinence de l'action requise.
</response>
</example>

<example>
<user>/h-da:consulter-digest --domaine=ma</user>
<response>
Lecture de `latest.md` — digest du 2026-05-19.
Filtre appliqué : domaine = `ma`.

Aucune entrée trouvée pour le domaine "ma" dans ce digest.

Le digest le plus récent ne contient pas d'évolution sur ce domaine cette semaine.
Pour vérifier un digest antérieur : `/h-da:consulter-digest 2026-05-12 --domaine=ma`.
Pour générer un nouveau digest à jour : lancer l'agent `veille-jurisprudence`.
</response>
</example>

<example>
<user>/h-da:consulter-digest 2026-05-12</user>
<response>
Digest demandé : 2026-05-12.
Recherche de `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/veille/digest-2026-05-12.md`.

Aucun digest disponible pour la date 2026-05-12.

Digests disponibles : le plus récent est `latest.md` (2026-05-19).
Pour consulter le dernier digest : `/h-da:consulter-digest` (sans date).
Pour générer un digest couvrant une période antérieure : lancer l'agent `veille-jurisprudence`.
</response>
</example>

---

## Étape 1 — Localiser le digest

1. Déterminer le chemin cible d'après l'intake :
   - **`latest` (défaut)** :
     `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/veille/latest.md`
   - **Date demandée** :
     `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/veille/digest-YYYY-MM-DD.md`
2. Tenter de lire le fichier.
3. **Si le fichier est absent** : ne pas générer de contenu de remplacement.
   Afficher :

   > Aucun digest disponible à ce chemin.
   > Pour générer le digest de cette semaine, lancer l'agent `veille-jurisprudence`.
   > Pour consulter un digest existant : vérifier la date ou utiliser
   > `/h-da:consulter-digest` sans paramètre (dernier digest).

   Arrêter l'exécution du skill.

---

## Étape 2 — Lire et filtrer

1. Charger le contenu du digest localisé à l'étape 1.
2. Extraire la date du digest depuis l'en-tête
   (`Veille droit des affaires — YYYY-MM-DD`).
3. Appliquer les filtres de l'intake dans l'ordre :
   - **`--domaine=`** : ne conserver que les sections dont le titre de domaine
     correspond au filtre (correspondance insensible à la casse, partielle acceptée).
   - **`--depuis=`** : ne conserver que les entrées dont la date de la disposition
     (JORF) ou de l'arrêt (Judilibre) est postérieure ou égale à la date filtre.
   - **`--impact=`** : ne conserver que les entrées dont le champ
     "Action requise" correspond à la valeur demandée (normaliser les espaces et
     majuscules pour la comparaison).
4. Si l'application des filtres aboutit à zéro entrée : signaler explicitement
   ("Aucune entrée après filtrage") et proposer d'élargir les critères ou de
   consulter sans filtre.

---

## Étape 3 — Restituer

1. Afficher le digest filtré, structuré par domaine, dans cet ordre de
   priorité :
   - **Domaines configurés dans le profil cabinet** (ordre du
     `veille-config.yaml`) en premier.
   - **Autres domaines** présents dans le digest ensuite, dans l'ordre du fichier.
2. Pour chaque domaine, restituer les entrées dans l'ordre du fichier
   (nouvelles dispositions puis jurisprudence chambre commerciale).
3. Restituer chaque entrée avec l'intégralité de ses champs tels qu'ils figurent
   dans le digest : source, référence, résumé, impact pratique, action requise.
   **Ne pas reformuler, ne pas interpréter, ne pas enrichir** — lecture fidèle.
4. La note du relecteur de **ce skill** est placée en **tête** du livrable —
   bloc unique au-dessus du digest restitué, conformément au CLAUDE.md du
   plugin §2 (voir § Sortie).
5. Si le digest contient la note du relecteur de l'agent `veille-jurisprudence`,
   la conserver dans le corps, juste après le digest restitué : elle fait partie
   du digest lu et n'est ni refondue ni déplacée.

---

## Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait — ex. action requise "modification modèle" sans précision du modèle concerné, plusieurs entrées sur un même thème signalant une tendance jurisprudentielle. Omettre la ligne si rien d'honnête à signaler.}

## Que veux-tu faire ? Choisis une option et je la déroule :

1. **Approfondir une entrée** — je restitue l'entrée sélectionnée avec le contexte jurisprudentiel ou législatif disponible dans le digest, sans ajouter d'analyse nouvelle.
2. **Escalader** — note d'escalade vers l'approbateur configuré avec les entrées à impact élevé (action requise "modification modèle" ou "mise à jour playbook") et la décision attendue.
3. **Compléter les faits** — questions ouvertes à poser pour évaluer si une entrée du digest appelle une action immédiate sur un dossier en cours.
4. **Surveiller et attendre** — noter le digest consulté au tracker avec date et domaines couverts, revisite prévue au prochain digest hebdomadaire.
5. **Autre** — précise ce que tu veux en faire.
```

---

## Ce skill ne fait pas

- **Générer un digest** — c'est le rôle de l'agent `veille-jurisprudence`.
  Si aucun digest n'est disponible, lancer l'agent, puis revenir ici.
- **Analyser ou réinterpréter les arrêts** — le skill lit et restitue
  fidèlement ; l'avocat qualifie et décide.
- **Vérifier les sources citées dans le digest** — la vérification des
  citations est faite par l'agent au moment de la production du digest.
- **Modifier un playbook ou un modèle de contrat** — il signale l'action
  requise, l'humain l'exécute.
- **Couvrir la chambre sociale ou d'autres formations** en v1.2 — la veille
  est limitée à la chambre commerciale (voir `veille-config.yaml`).

---

## Ton

Simple, fidèle, orienté action. Ce skill sert un seul objectif : mettre le
digest sous les yeux de l'utilisateur, dans le bon ordre, avec les bons
filtres. Il ne commente pas, ne glose pas, ne complète pas. Si une action
est requise dans le digest, il la signale clairement dans la note du
relecteur et dans l'arbre de décision. La décision appartient à l'avocat.

> Points non vérifiés dans une source consultée sont marqués `[à vérifier]`.
