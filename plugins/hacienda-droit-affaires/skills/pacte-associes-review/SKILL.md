---
name: pacte-associes-review
description: >
  Revue d'un pacte d'associés contre le playbook du cabinet : préemption,
  agrément, inaliénabilité, drag/tag-along, anti-dilution, good/bad leaver,
  promesses croisées, non-concurrence des associés, droits de véto, clauses
  d'information et de liquidité. Triage par criticité, liste de points de
  négociation. Signale hors périmètre (spécialiste PI) si apports/licences PI substantiels.
  Brouillon soumis à validation humaine (avocat).
version: "2.1.0"
argument-hint: "[pacte, side, playbook ou points sensibles] [--pe] [--side=sponsor|management]"
authors: ["Hacienda"]
tags: [pacte-associes, societes, revue, drag-along, preemption, agrement, private-equity, pacte-investissement, lbo, management-package]
---

# Skill — Revue de pacte d'associés

> **BROUILLON DE REVUE, PAS AVIS JURIDIQUE.**
>
> Analyse documentaire d'un pacte d'associés contre le playbook configuré.
> Identifie les clauses sensibles, propose des reformulations selon la posture
> du cabinet (protecteur fondateurs / équilibré / protecteur investisseurs),
> signale les risques. Toute sortie doit être validée par un avocat avant
> transmission, signature ou ouverture de négociation.
>
> **Si le pacte porte sur des apports ou licences de propriété intellectuelle
> substantiels** (apport d'un portefeuille de brevets, licence de marque
> structurante, transfert de savoir-faire R&D au capital) : orienter le volet PI vers
> un spécialiste PI (hors périmètre de ce plugin). Ce skill
> couvre la vie sociale et les rapports entre associés, pas le cœur PI.

---

## Examples

<example>
<user>/h-da:pacte-associes-review ./pacte-associes-startup.pdf --review --side=fondateur</user>
<response>
1. Lecture profil cabinet (posture pacte = protecteur fondateurs, matrice d'approbateurs)
2. Identification : pacte d'associés, SAS, 3 fondateurs + 1 investisseur, droit français
3. Pas de composante PI substantielle détectée → pas de renvoi PI
4. Analyse clause par clause contre `clauses-pacte-associes-fr.md` (préemption, agrément, inaliénabilité, drag/tag-along, anti-dilution, leaver, promesses croisées, non-concurrence, véto, information/liquidité)
5. Liste de points triée par criticité (🔴 → 🟢) via skill `liste-de-points`
6. Post-flight `verifier-citations` (articles C.com. et C.civ. vérifiés contre l'index)
7. Sortie : en-tête confidentialité + note du relecteur (5 champs) + résumé exécutif + liste de points + recommandation + question hors checklist + arbre de décision 5 options
</response>
</example>

<example>
<user>/h-da:pacte-associes-review ./pacte-v2.pdf</user>
<response>
Identification : pacte d'associés, SAS. Détection d'une clause d'inaliénabilité de 15 ans.
Finding 🔴 — clause d'inaliénabilité :
- En SAS, l'inaliénabilité statutaire est plafonnée à 10 ans par l'art. L.227-13 C.com. Une durée de 15 ans excède le plafond légal : la clause statutaire est nulle, à tout le moins réductible à 10 ans [review].
- Même stipulée dans le pacte seul, une inaliénabilité de 15 ans est très exposée : sa validité suppose une durée raisonnable et un intérêt sérieux et légitime (transposition art. 900-1 C.civ [à vérifier]). 15 ans sans justification explicite est disproportionné [review].
Recommandation : ramener la durée à une valeur conforme (≤ 10 ans en SAS, idéalement 3 à 5 ans) et documenter l'intérêt légitime au préambule. Sortie complète avec liste de points et formulations alternatives selon posture.
</response>
</example>

<example>
<user>/h-da:pacte-associes-review ./pacte-jv-techno.pdf</user>
<response>
Détection d'une composante PI substantielle : le pacte organise l'apport au capital d'un portefeuille de brevets et une licence croisée de savoir-faire entre les associés. Renvoi taxonomie :
"Ce pacte comporte un volet propriété intellectuelle substantiel — apport de brevets au capital et licence de savoir-faire entre associés. L'analyse des spécificités PI (évaluation des apports, périmètre de licence, inscription au RNB pour opposabilité) est hors du périmètre de ce plugin : je te recommande de la confier à un spécialiste PI. Souhaites-tu (a) que je poursuive sur les seules clauses de vie sociale (préemption, agrément, drag/tag, leaver, véto), le volet PI étant signalé `[review]`, ou (b) t'arrêter ici ?"
</response>
</example>

<example>
<user>/h-da:pacte-associes-review ./pacte-investissement-lbo.pdf --pe --side=management</user>
<response>
1. Lecture profil
2. Identification : pacte d'investissement, SAS HoldCo FR, sponsor + managers rollover → signaux PE
3. Gate France/Lux : HoldCo FR, docs FR → jambe FR couverte
4. Étape 2bis : 5 axes P1-P5, side=management
5. Bloc « Architecture documentaire & précédence » : conflit détecté entre le pacte d'investissement et le pacte existant non résolu par clause de précédence → 🔴
6. Liste de points : bad leaver à valeur nominale indifférencié → 🔴 (léonine [review]) ; véto sponsor très large → gestion de fait [review] ; requalification fiscale/sociale du sweet equity → nommée et renvoyée
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md` :
> - **Posture pacte d'associés** — protecteur fondateurs / équilibré / protecteur investisseurs (bloc « vie sociale »)
> - **Formes sociales pratiquées** — SAS / SARL / SA / SNC / SCI / autres (bloc « vie sociale »)
> - **Positions playbook** — préemption, agrément, inaliénabilité, drag/tag, leaver, non-concurrence des associés
> - **Matrice d'approbateurs** — par type d'acte

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : stopper et
demander `/h-da:entretien-demarrage` avant toute revue
substantielle. Voir aussi `~/.claude/plugins/config/hacienda-juridique/company-profile.md` pour les
éléments cabinet partagés cross-plugins.

---

## Intake

1. **Mode** — `--review` (analyser un pacte existant, défaut)
2. **Fichier pacte** — chemin du PDF / DOCX / Markdown
3. **Side** (optionnel) — `--side=fondateur` | `--side=investisseur` | `--side=societe` (auto-détecté si non précisé ; détermine la posture appliquée)
4. **Forme sociale concernée** (optionnel) — `--forme=SAS` | `--forme=SARL` | `--forme=SA` (auto-détectée à partir du document si non précisée ; conditionne les fondements d'agrément et d'inaliénabilité)
5. **Mode `--pe`** (optionnel) — overlay Private Equity / pacte d'investissement. Active l'étape 2bis. Auto-proposé si des signaux PE sont détectés (voir `${CLAUDE_SKILL_DIR}/../../references/pe-overlay-fr.md`).
6. **Side PE** (avec `--pe`) — `--side=sponsor | management`. En mode `--pe`, `--side` bascule sur ce couple (la lecture side-aware et le glossaire deviennent sponsor/manager). Hors `--pe`, les sides standard fondateur/investisseur/société s'appliquent.

---

## Gate non-juriste

- [ ] Forme sociale correctement identifiée (conditionne les fondements d'agrément et d'inaliénabilité)
- [ ] Profil cabinet lu et posture pacte applicable identifiée
- [ ] Renvoi PI effectué si le pacte comporte un volet PI substantiel (pas de revue PI forcée)
- [ ] 11 clauses passées en revue contre `clauses-pacte-associes-fr.md`
- [ ] Distinction non-concurrence d'associé / non-concurrence salariée correctement appliquée (pas de reproche sur l'absence de contrepartie)
- [ ] Liste de points triée par criticité décroissante, sans doublon, sans remplissage
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur (5 champs) + résumé exécutif + liste de points + recommandation + question hors checklist + arbre de décision 5 options
- [ ] Si `--pe` : module `pe-overlay-fr.md` chargé, gate France/Lux posé, 5 axes P1-P5 passés, side sponsor/management appliqué
- [ ] Si `--pe` : requalification fiscale/sociale du management package nommée et renvoyée, jamais traitée au fond
- [ ] Hors `--pe` : revue standard 11 clauses strictement inchangée

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/revue-pacte-associes-<parties-slug>-YYYY-MM-DD.md
```

Si la liste de points dépasse 10 lignes ou contient des dates / montants
sérialisables, générer en parallèle un dashboard HTML autonome via
`renderDashboard()` de `@hacienda/core` (voir `${CLAUDE_SKILL_DIR}/../../references/dashboard-template.md`).

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — voir CLAUDE.md §2]

> **⚠️ Note du relecteur**
> - **Sources :** Légifrance ✓ / Judilibre ✓ / Pappers ✓ / BODACC ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** intégrale ({N} pages) | partielle (pages X à Y)
> - **Signalé pour ton jugement :** {N} éléments marqués [review] | aucun
> - **Fraîcheur :** recherche des évolutions depuis {date} — {N} mises à jour intégrées | rien trouvé
> - **Avant de t'appuyer dessus :** {1-2 actions concrètes OU « prêt pour relecture »}

{Si mode --pe : bloc « Architecture documentaire & précédence » — matrice statuts / pacte existant / pacte d'investissement + conflits de précédence. Sinon, omettre.}

# Résumé exécutif

{Trois phrases pour fondateur / DG / sponsor. Pas de jargon. Une ligne de
bottom-line : signer en l'état / négocier sur N points / refuser. Une ligne
de risque dominant. Une ligne de prochaine action attendue.}

# Liste de points

| # | Clause | Statut | Risque | Position souhaitée | Formulation proposée |
|---|---|---|---|---|---|
| ... | ... | 🔴/🟠/🟡/🟢 | ... | ... | ... |

# Recommandation

{Signer / Négocier / Refuser} — justification 2-3 lignes liée à la posture
pacte configurée et aux points 🔴 / 🟠.

# Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait. Omettre la ligne
si rien d'honnête à dire — ne pas fabriquer.}

# Que veux-tu faire ? Choisis une option :

1. **Rédiger** — je produis un projet de courrier de négociation reprenant la liste de points priorisée.
2. **Escalader** — note d'escalade vers {approbateur configuré} avec faits-clés, risque dominant et décision attendue.
3. **Compléter les faits** — questions ouvertes à poser à {fondateurs / investisseur / société / conseil} avant d'avancer.
4. **Surveiller et attendre** — j'ajoute le sujet au tracker du dossier avec note motivée et date de revisite.
5. **Autre** — précise ce que tu veux en faire.
```

### Mode silencieux (livrable externe)

Si l'utilisateur précise que la sortie est destinée à une contrepartie (co-associés, investisseur) ou à un destinataire non-juriste :
- Conserver l'en-tête de confidentialité (s'il protège le document) et la note du relecteur.
- Retirer la narration de skill et les renvois inter-commandes (les placer dans un message séparé).
- Le livrable doit se lire comme s'il avait été rédigé par un associé.

---

## Étape 1 — Identification

1. Lire le profil cabinet (CLAUDE.md droit-affaires) et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`. Identifier la posture pacte (protecteur fondateurs / équilibré / protecteur investisseurs) et les formes sociales pratiquées.
2. Identifier la **forme sociale** de la société dont les titres sont visés (SAS, SARL, SA…) et les **parties** (fondateurs, managers, investisseurs, société elle-même si signataire), leur qualité et le side de l'utilisateur. La forme sociale conditionne les fondements applicables :
   - SAS → agrément art. L.227-14 C.com. ; inaliénabilité statutaire art. L.227-13 C.com. (plafond 10 ans) ; décisions collectives art. L.227-9 C.com.
   - SARL → agrément légal des cessions à tiers art. L.223-14 C.com. ; décisions art. L.223-29 `[à vérifier]` / L.223-30 C.com.
   - SA / société par actions non cotée → clause d'agrément statutaire art. L.228-23 C.com., procédure art. L.228-24 C.com.
3. **Test composante PI.** Si le pacte organise un apport au capital de droits de PI substantiels (brevets, marques, logiciels, savoir-faire R&D) ou une licence de PI structurante entre associés → signaler que ce volet est hors périmètre (orientation vers un spécialiste PI), avec les options (a) poursuivre sur les clauses de vie sociale seulement, le volet PI étant signalé `[review]`, (b) s'arrêter. Ne pas analyser le volet PI à fond ici.
4. **Détection PE.** Repérer les signaux PE (voir `${CLAUDE_SKILL_DIR}/../../references/pe-overlay-fr.md` §signaux). Si présents et que `--pe` n'est pas posé : proposer l'overlay PE et attendre l'acceptation avant d'exécuter l'étape 2bis. Ne pas activer l'overlay sans flag ni acceptation.

---

## Étape 2 — Analyse clause par clause

Pour chaque clause de pacte identifiée (voir `${CLAUDE_SKILL_DIR}/../../references/clauses-pacte-associes-fr.md`, 11 clauses), produire une ligne de tableau :

| Champ | Contenu |
|---|---|
| Citation | Numéro d'article du pacte + libellé court (5-15 mots) |
| Comparaison playbook | Conforme / écart léger / écart majeur, par rapport à la posture pacte configurée |
| Statut | 🟢 OK / 🟡 À discuter / 🟠 À négocier / 🔴 Bloquant |
| Article applicable | art. xxx + `[tag provenance]` (voir `articles-c-civ-c-com-index.md`) |
| Risque | 1-2 phrases concrètes pour le client |
| Position souhaitée | Selon posture pacte (protecteur fondateurs / équilibré / protecteur investisseurs) |
| Formulation proposée | Texte de remplacement prêt à coller |

**Règles d'analyse :**

- Les articles cités doivent exister dans `articles-c-civ-c-com-index.md`. Un article absent de l'index, ou présent en `[a compléter]`, est tagué `[à vérifier]`. À ce jour : L.227-13, L.227-14, L.227-15, L.223-14, L.228-24, L.227-9, L.223-30, L.225-100, 1231-5, 1170, 1592 sont dans l'index avec un identifiant Légifrance réel ; L.227-1, L.228-23, 1123, 1124, 1102, 1843-4, 1844-1, 900-1, L.225-132 ne le sont pas (→ `[à vérifier]`).
- Tag de provenance placé **après** la citation, sans backticks dans les cellules de tableau.
- Les arrêts cités sont tagués `[Judilibre]` si consultés en session ou `[connaissance modèle — à vérifier]` / `[à vérifier]` sinon. Pas de fausse jurisprudence.
- Tag inline `[review]` sur les jugements subjectifs : proportionnalité d'une non-concurrence d'associé (durée / périmètre / activités), caractère raisonnable d'une durée d'inaliénabilité borderline, caractère confiscatoire d'une décote bad leaver, qualification d'une promesse de rachat en clause léonine, risque de gestion de fait sur un véto large.
- Respecter le plancher de sévérité cross-skill : si `verifier-citations` remonte 🔴, ne pas dégrader silencieusement.

**Points de fond à ne pas manquer :**

- **Inaliénabilité (clause 3).** En SAS, l'inaliénabilité statutaire est plafonnée à 10 ans (art. L.227-13 C.com.). Une durée supérieure → 🔴 (nullité ou réduction). Toute inaliénabilité, même de pacte, suppose une durée limitée et un intérêt sérieux et légitime.
- **Non-concurrence des associés (clause 9).** L'exigence de contrepartie financière de la jurisprudence Cass. soc. 10 juil. 2002 ne s'applique **pas** à l'associé qui s'oblige en sa seule qualité d'associé : l'absence de contrepartie n'entraîne pas la nullité. La clause reste soumise au **contrôle de proportionnalité** (durée / périmètre géographique / activités). Ne pas reprocher l'absence de contrepartie ; reprocher, le cas échéant, la disproportion. Si le débiteur cumule la qualité de salarié, vérifier le risque de requalification.
- **Agrément (clause 2).** Distinguer agrément statutaire (opposable, violation → nullité, art. L.227-15 C.com. en SAS) et agrément du pacte (effet relatif, violation → dommages-intérêts). Fondement par forme sociale : L.227-14 (SAS), L.223-14 (SARL), L.228-23 (clause statutaire en société par actions non cotée).
- **Drag-along (clause 4).** Une clause de drag-along sans seuil de déclenchement chiffré est un défaut rédactionnel majeur → 🟠/🔴. Vérifier aussi l'égalité des conditions et le périmètre des garanties imposées au minoritaire.
- **Good/bad leaver (clause leaver).** Un rachat à la **valeur nominale pour toute cause de départ, sans distinction good leaver / bad leaver** (y compris décès, invalidité, retraite, révocation sans cause), crée une **décote potentiellement confiscatoire** → 🔴. Exposer **deux fondements cumulatifs** : (i) contrôle de proportionnalité et valorisation par expert (art. 1843-4 C.civ `[à vérifier]`), la décote indifférenciée étant disproportionnée ; (ii) **risque de requalification en clause léonine (art. 1844-1 al. 2 C.civ `[à vérifier]`)** lorsque la décote revient à priver systématiquement l'associé sortant de la valeur de ses titres. Exiger une distinction **good leaver** (juste valeur / expertise) / **bad leaver** (décote justifiée et définie). Ne pas confondre avec la **promesse de rachat à prix plancher au profit de l'investisseur**, qui relève elle aussi du contrôle léonine (1844-1) mais sous l'angle de l'exonération des pertes — les deux clauses appellent l'article, à des titres distincts.

---

## Étape 2bis — Overlay Private Equity (mode `--pe` uniquement)

Ne s'exécute que si `--pe` est posé OU si des signaux PE ont été détectés (étape 1) et l'utilisateur a accepté la proposition. Sinon, sauter entièrement cette étape : la revue standard est complète sans elle.

1. Charger `${CLAUDE_SKILL_DIR}/../../references/pe-overlay-fr.md`.
2. **Gate d'application France/Lux.** Si le pacte vise une entité luxembourgeoise ou que les documents sont régis par le droit luxembourgeois : couvrir la seule jambe FR et exclure les docs Lux (formulation type du module). Ne pas analyser un pacte Lux comme un pacte FR.
3. Basculer le side sur **sponsor / management**.
4. Passer les **5 axes P1-P5** du module. Les findings P2-P5 se fondent dans la liste de points (étape 3), triés par criticité, avec le side appliqué.
5. Produire le **bloc « Architecture documentaire & précédence »** (P1) : matrice statuts ↔ pacte existant ↔ pacte d'investissement + liste des conflits de précédence. Ce bloc se place **au-dessus** de la liste de points dans la sortie.
6. **Anti-fabrication** : requalification fiscale/sociale = nommée et renvoyée ; pas de quantum ; léonine / gestion de fait = `[review]` ; instruments → `financement-startup` ; pas de date fabriquée.

---

## Étape 3 — Liste de points

Appel interne au skill `liste-de-points` pour produire un tableau consolidé, trié par criticité décroissante (🔴 → 🟠 → 🟡 → 🟢) :

```
| # | Clause | Statut | Risque | Position souhaitée | Formulation proposée |
|---|---|---|---|---|---|
```

La liste de points est l'artefact central transmis à la contrepartie ou à l'équipe de négociation. Une ligne par clause. Pas de doublon. Tri stable par numéro de clause à criticité égale.

Si le pacte n'a aucun écart par rapport au playbook : retourner une liste vide explicite — `Aucun point de vigilance identifié contre le playbook configuré. Lecture intégrale sans alerte.` — et ne pas fabriquer de findings de remplissage.

---

## Étape 4 — Post-flight

Appel automatique de `verifier-citations` sur la sortie complète, mode défaut (`articles` + `jurisprudence`). Le skill :

- Extrait toutes les citations (art. NNN C.civ, L.NNN-N C.com., arrêts Cass.).
- Vérifie l'existence et la version en vigueur via Légifrance / Judilibre.
- Annote la sortie : `[Légifrance ✓]`, `[Judilibre ✓]`, `[abrogé]`, ou `[à vérifier]` en mode dégradé.

Si une citation `[abrogé]` est remontée → ligne dédiée dans la note du relecteur en 🔴 avec le remplacement applicable.

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur (« `verifier-citations` non exécuté — N citations à valider manuellement contre Légifrance »).

---

## Ce skill ne fait pas

- Signer ou exécuter le pacte (acte des associés).
- Rédiger un pacte d'associés depuis zéro (revue uniquement en v1.1).
- Revoir le volet PI d'un pacte → hors périmètre : orienter vers un spécialiste PI.
- Rédiger ou réviser les statuts de la société → autre skill « vie sociale ».
- Faire le focus GAP M&A → renvoyer `gap-review` (v1).
- Donner un avis fiscal détaillé (régime des BSA de relution, plus-values de cession) — signalement uniquement.
- Donner un avis social complet sur un dirigeant cumulant un contrat de travail — la clause est analysée, la stratégie sociale est renvoyée à un spécialiste social (hors périmètre de ce plugin).
- (mode PE) Traiter le volet **fonds** (règlement / LPA / side letters) → `fonds-pe-fr-triage` (vague ultérieure).
- (mode PE) Donner un avis **fiscal/social** sur le management package — requalification signalée et renvoyée.
- (mode PE) **Rédiger** le pacte d'investissement (review only).
- (mode PE) Couvrir les **documents luxembourgeois** (gate France/Lux).

---

## Ton

Technique, structuré, factuel. Identifier clairement le side du client
(fondateur / investisseur / société) et appliquer la posture pacte
correspondante. Signaler systématiquement les risques majeurs : inaliénabilité
excédant le plafond légal SAS, non-concurrence d'associé disproportionnée,
drag-along sans seuil de déclenchement, promesse de rachat à prix garanti
risquant la clause léonine. Rappeler que la sortie est un brouillon soumis à
validation humaine (avocat) avant toute transmission, signature ou ouverture de
négociation formelle.
