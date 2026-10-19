---
name: analyser-rupture-brutale
description: >
  Analyse une relation commerciale au regard du risque de rupture brutale
  (art. L.442-1, II C.com., issu de l'ord. 2019-359 du 24 avril 2019 —
  ex-L.442-6, I, 5°). Qualifie la « relation commerciale établie »,
  évalue le préavis raisonnable (règle de pouce ≈ 1 mois par année
  d'ancienneté, modulée par exclusivité / dépendance économique), estime
  le préjudice indemnisable (marge brute manquante), et traite les cas
  de dispense de préavis. Distingue strictement L.442-1, I (déséquilibre
  significatif) et L.442-1, II (rupture brutale). Renvoie vers
  `declaration-creance` si procédure collective concomitante, et signale
  hors périmètre (spécialiste PI) une composante PI. Brouillon soumis à validation humaine (avocat).
version: "2.0.0"
argument-hint: "[relation commerciale, chronologie, side, projet de préavis]"
authors: ["Hacienda"]
tags: [rupture-brutale, distribution, l442-1, contentieux, preavis, relation-etablie]
---

# Skill — Analyse de rupture brutale (L.442-1, II)

> **BROUILLON DE REVUE, PAS AVIS JURIDIQUE.**
>
> Analyse documentaire d'une relation commerciale au regard de l'art.
> L.442-1, II C.com. (rupture brutale d'une relation commerciale établie),
> issu de l'ordonnance n° 2019-359 du 24 avril 2019 — ex-art. L.442-6, I, 5°.
> Toute sortie doit être validée par un avocat avant transmission, mise en
> demeure ou assignation.
>
> **Ne pas confondre.** L.442-1, **I** vise le déséquilibre significatif
> dans les relations commerciales (avantages sans contrepartie, obligations
> manifestement déséquilibrées). L.442-1, **II** vise la rupture brutale
> d'une relation commerciale établie. Ce skill traite **exclusivement** le
> II. Pour le I, voir `reviser-contrat`.
>
> **Safe harbor 18 mois — protection défensive, pas plafond.** L'art.
> L.442-1, II al. 2 protège l'auteur d'une rupture qui a **effectivement
> accordé** un préavis écrit de 18 mois : il ne peut alors être condamné
> pour préavis insuffisant. Ce n'est **pas** un plafond légal du préavis
> dû ; ce n'est **pas** un argument à invoquer si le préavis effectif est
> inférieur à 18 mois. Toute conclusion qui s'appuie sur le safe harbor
> est taguée `[review]`.
>
> **Si la rupture s'inscrit dans une procédure collective** (sauvegarde,
> RJ, LJ) du débiteur de l'indemnisation : renvoyer vers `declaration-creance`
> pour la déclaration de la créance d'indemnisation dans les délais
> L.622-24 C.com.
>
> **Si la relation rompue est un contrat de distribution avec composante
> PI** (licence de marque, brevet, savoir-faire) : orienter le volet PI vers
> un spécialiste PI (hors périmètre de ce plugin) ; ce
> skill couvre le volet rupture brutale.

---

## Examples

<example>
<user>/h-da:analyser-rupture-brutale ./contrat-distribution-A-B.pdf ./notification-rupture-A.pdf --review --side=victime</user>
<response>
1. Lecture profil cabinet (posture contentieuse, approbateur configuré pour mise en demeure).
2. Identification : contrat de distribution exclusive FR, ancienneté 8 ans, exclusivité totale, dépendance économique forte (≈ 70 % du CA de B). Side = victime (B, distributeur).
3. Étape 2 — Qualification 🟢 « relation établie » : 8 ans + exclusivité contractuelle + dépendance ≈ 70 % CA + tacite reconduction annuelle. L.442-1, II C.com. (ex-L.442-6, I, 5°) `[stable]`.
4. Étape 3 — Préavis : règle de pouce ≈ 1 mois par année d'ancienneté = 8 mois plancher, majoré par dépendance forte → fourchette estimée 10 à 12 mois `[review]`. Préavis effectif accordé : 3 mois → finding 🔴 préavis manifestement insuffisant. Safe harbor 18 mois non invocable par A (préavis effectif < 18 mois).
5. Étape 4 — Préjudice : (préavis raisonnable estimé − préavis effectif) × marge brute mensuelle. Avec marge mensuelle ≈ 50 k€ et fourchette 7 à 9 mois manquants → ordre de grandeur 350 à 450 k€ `[review]` (à reraffiner sur comptes audités).
6. Étape 5 — Dispense : aucune inexécution alléguée contre B, aucune force majeure invoquée → pas de base solide pour dispense de préavis.
7. Liste de points triée par criticité décroissante via `liste-de-points`.
8. Post-flight `verifier-citations` (L.442-1 II vérifié Légifrance, jurisprudence ch. com. à reraffiner Judilibre).
9. Sortie : en-tête confidentialité + note du relecteur + résumé exécutif + qualification + préavis + préjudice + dispense + liste de points + recommandation Engager + question hors checklist + arbre 5 options.
</response>
</example>

<example>
<user>/h-da:analyser-rupture-brutale ./bons-de-commande-ponctuels.pdf --review</user>
<response>
Identification : relation ponctuelle de 18 mois, bons de commande successifs sans contrat-cadre, aucune exclusivité contractuelle, aucune dépendance économique (la cible représentait < 5 % du CA de B), pas de tacite reconduction.

Étape 2 — Qualification ⛔ relation NON établie. Les critères jurisprudentiels d'ancienneté, stabilité, régularité, volume et intuitu personae ne sont pas réunis. L.442-1, II C.com. (ex-L.442-6, I, 5°) n'est pas applicable. Pas d'obligation de préavis.

Conclusion : pas d'action solide en rupture brutale. Suggérer (a) examen d'un autre fondement (rupture fautive de pourparlers art. 1112 C.civ., concurrence déloyale art. 1240 C.civ.) si faits le justifient, (b) classement sans suite.

Sortie : note du relecteur (1 ligne — aucun flag), résumé exécutif court, recommandation Renoncer.
</response>
</example>

<example>
<user>/h-da:analyser-rupture-brutale ./historique-relation-X.pdf --review</user>
<response>
Étape 1 — Détection : la contrepartie X (auteur de la rupture) est en redressement judiciaire (BODACC, jugement d'ouverture du 12 mars 2026, publication du 18 mars 2026) `[BODACC]`.

🟠 Alerte procédure collective. La créance d'indemnisation pour rupture brutale doit être déclarée auprès du mandataire judiciaire dans le délai L.622-24 C.com. (2 mois post-publication BODACC ; 4 mois si créancier hors France/UE/EEE).

Date de forclusion estimée : 18 mai 2026. Le skill `analyser-rupture-brutale` chiffre l'indemnisation (préavis manquant × marge brute) ; la déclaration de créance elle-même relève de `declaration-creance`.

Renvoi actif : `/h-da:declaration-creance --siren=<X> --nature=indemnisation-rupture-brutale --montant=<estimation chiffrée>`.

Sortie : qualification + estimation préjudice + recommandation Engager (déclarer la créance avant forclusion, parallèlement à l'éventuelle action judiciaire).
</response>
</example>

<example>
<user>/h-da:analyser-rupture-brutale ./contrat-distribution-marque-Y.pdf --review</user>
<response>
Identification : contrat de distribution exclusive de produits de marque Y, incluant une licence d'usage de la marque Y au distributeur. Composante PI forte (la marque structure l'économie du contrat).

Renvoi taxonomique : "Ce contrat comporte une composante PI structurante (licence de marque). Pour le volet PI (étendue de la licence, opposabilité de la résiliation, inscription RNM, sort du stock marqué post-rupture), ce volet est hors du périmètre de ce plugin : je te recommande de le confier à un spécialiste PI. Le présent skill `analyser-rupture-brutale` traite le volet L.442-1, II (qualification de la relation, préavis raisonnable, préjudice). Souhaites-tu (a) que je poursuive sur le seul volet rupture, le volet PI étant signalé `[review]`, ou (b) t'arrêter ici ?"

Si (b) ou (c) → poursuivre l'analyse rupture brutale standard. Si (a) seul → arrêt et renvoi.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md` :
> - **Side principal** — contentieux, contrats commerciaux, mixte
> - **Posture par défaut** — protecteur / équilibré / facilitateur
> - **Matrice d'approbateurs** — mise en demeure, action judiciaire, transaction

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : stopper et
demander `/h-da:entretien-demarrage` avant toute analyse
substantielle. Voir aussi `~/.claude/plugins/config/hacienda-juridique/company-profile.md` pour les
éléments cabinet partagés cross-plugins.

---

## Intake

1. **Mode** — `--review` (analyse d'une relation existante, défaut et unique mode v1)
2. **Side** (optionnel) — `--side=auteur` (auteur de la rupture, posture défensive) | `--side=victime` (victime de la rupture, posture offensive). Auto-détecté à partir des documents si non précisé.
3. **Documents fournis** — contrat-cadre (le cas échéant), historique commercial (bons de commande, factures, volumes), notification de rupture, échanges précontentieux.
4. **Ancienneté de la relation** — date de début effective (premier flux d'affaires, pas nécessairement la date du contrat-cadre).
5. **Volume / exclusivité / dépendance** — part du CA réalisée avec la contrepartie, présence d'une exclusivité contractuelle, intuitu personae. Si absent à l'intake : compléter par questions ouvertes.

Posture override possible : `--posture=protecteur` | `--posture=équilibré` | `--posture=facilitateur` (force une posture pour cette analyse, sans modifier le profil).

---

## Gate non-juriste

- [ ] Profil cabinet lu et posture applicable identifiée
- [ ] Side correctement identifié (auteur / victime)
- [ ] Renvoi PI effectué si distribution PI-centric (pas de revue forcée)
- [ ] Détection procédure collective → renvoi `declaration-creance` si applicable
- [ ] Qualification 🟢 / 🟡 / ⛔ documentée sur les 7 critères jurisprudentiels
- [ ] Préavis exprimé en fourchette (min-max) et non en chiffre figé
- [ ] Safe harbor 18 mois mentionné comme protection défensive uniquement (jamais comme plafond), tagué `[review]` si invoqué
- [ ] Préjudice calculé sur marge brute (pas sur chiffre d'affaires)
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur 5 champs en gras + résumé exécutif + qualification + préavis + préjudice + dispense (si applicable) + liste de points + recommandation + question hors checklist + arbre 5 options

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/analyse-rupture-brutale-<parties-slug>-YYYY-MM-DD.md
```

Si la liste de points dépasse 10 lignes ou contient des montants chiffrés
en fourchette, générer en parallèle un dashboard HTML autonome via
`renderDashboard()` de `@hacienda/core` (voir `${CLAUDE_SKILL_DIR}/../../references/dashboard-template.md`).

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur]

> **⚠️ Note du relecteur**
> - **Sources :** Légifrance ✓ / Judilibre ✓ / Pappers ✓ / BODACC ✓ (cocher ✗ si non connectée, motif)
> - **Lecture :** intégrale ({N} pages, {M} documents) | partielle (préciser périmètre)
> - **Signalé pour ton jugement :** {N} éléments marqués [review] | aucun
> - **Fraîcheur :** recherche jurisprudence ch. com. post-{date pivot} — {N} arrêts intégrés | recherche impossible (motif)
> - **Avant de t'appuyer dessus :** {action concrète OU « prêt pour relecture »}

# Résumé exécutif

{Trois phrases pour décideur — associé, DG, sponsor business. Pas de jargon.
Une ligne bottom-line (Engager / Négocier / Renoncer). Une ligne risque
dominant. Une ligne prochaine action attendue.}

# Qualification de la relation

{🟢 établie / 🟡 borderline [review] / ⛔ non établie} — justification factuelle
sur les critères jurisprudentiels (ancienneté, stabilité, régularité, volume,
exclusivité, intuitu personae, dépendance). Fondement L.442-1, II C.com.
(ex-L.442-6, I, 5°) [tag provenance].

# Préavis

| Champ | Valeur |
|---|---|
| Ancienneté | N années |
| Plancher règle de pouce | N mois |
| Facteurs de modulation | ... |
| Préavis raisonnable estimé | Fourchette X-Y mois [review] |
| Préavis effectivement accordé | Z mois |
| Différentiel | (X-Y) − Z |
| Statut | 🟢 / 🟠 / 🔴 |
| Safe harbor 18 mois | applicable / non applicable / non invocable [review] |

# Préjudice

{Chiffré en fourchette si comptes disponibles, sinon méthodologie + [review]}.
Base = marge brute, formule (préavis manquant × marge mensuelle).
Postes accessoires éventuels documentés.

# Dispense de préavis

{Section présente uniquement si une dispense est alléguée ou défendable.
Conclusion : défensible / fragile / non soutenable [review].}

# Liste de points

| # | Point | Statut | Risque | Position souhaitée | Action proposée |
|---|---|---|---|---|---|
| ... | ... | 🔴/🟠/🟡/🟢 | ... | ... | ... |

# Recommandation

{Engager / Négocier / Renoncer} — justification 2-3 lignes liée à la
posture profil et aux points 🔴 / 🟠. Si renvoi `declaration-creance`
(procédure collective concomitante) ou hors périmètre PI (composante PI : orienter vers un spécialiste PI),
mentionner explicitement.

# Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait. Omettre la ligne
si rien d'honnête à dire — ne pas fabriquer.}

# Que veux-tu faire ? Choisis une option :

1. **Rédiger** — je produis un projet de courrier de mise en demeure (côté victime) ou de réponse à mise en demeure (côté auteur), reprenant la qualification, l'estimation et la demande / défense chiffrée.
2. **Escalader** — note d'escalade vers {approbateur configuré pour action judiciaire} avec faits-clés, chiffrage, risque dominant et décision attendue.
3. **Compléter les faits** — questions ouvertes à poser à {client / contrepartie / conseil / DAF} avant d'avancer (typiquement : comptes audités, historique exact des flux, exclusivité de fait).
4. **Surveiller et attendre** — ajouter au tracker du dossier avec date de revisite (utile si la prescription ne court pas encore ou si une mise en demeure préalable est en cours d'échange).
5. **Autre** — précise.
```

### Mode silencieux (livrable externe)

Si la sortie est destinée à une contrepartie (mise en demeure adressée à
l'auteur de la rupture) ou à un destinataire non-juriste (sponsor business) :

- Conserver l'en-tête de confidentialité (s'il protège le document) et la note du relecteur.
- Retirer la narration de skill et les renvois inter-commandes (les placer dans un message séparé).
- Le livrable doit se lire comme s'il avait été rédigé par un associé.

---

## Étape 1 — Identification

1. Lire le profil cabinet (CLAUDE.md droit-affaires) et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`.
2. Identifier les parties (raison sociale, qualité — fournisseur / distributeur / prestataire / mandant, pays d'établissement), le droit applicable, la juridiction.
3. **Test PI-centric.** Si la relation rompue est un contrat de distribution avec composante PI structurante (licence de marque, brevet, savoir-faire dominant), signaler que le volet PI est hors périmètre (orientation vers un spécialiste PI) avec les options (a) poursuivre sur le seul volet rupture, le volet PI étant signalé `[review]`, (b) s'arrêter.
4. Déterminer le side (auteur / victime) à partir des documents si non précisé à l'intake.
5. **Détection SIREN et alerte procédure collective.** Si une chaîne de 9 chiffres apparaît dans les documents (regex `\b[0-9]{9}\b` + validation Luhn), tenter l'enrichissement via `company_full_profile` de `@hacienda/core`. Si BODACC remonte une procédure collective en cours pour le débiteur de l'indemnisation, signaler immédiatement (le délai de déclaration L.622-24 court) et renvoyer vers `declaration-creance`.

---

## Étape 2 — Qualification de la « relation commerciale établie »

Référentiel : art. L.442-1, II C.com. (ex-L.442-6, I, 5°) `[stable]`.

Le texte exige une « relation commerciale établie ». La jurisprudence de
la chambre commerciale de la Cour de cassation apprécie cette qualification
au moyen d'un faisceau d'indices. Le skill applique chaque critère et conclut :

| Critère | Description | Élément du dossier |
|---|---|---|
| Ancienneté | Durée écoulée depuis le premier flux d'affaires effectif | À renseigner |
| Stabilité | Reconductions tacites, contrat-cadre, comportements constants | À renseigner |
| Régularité | Flux récurrents non sporadiques (cadence des commandes) | À renseigner |
| Volume | Importance économique pour les deux parties | À renseigner |
| Exclusivité / quasi-exclusivité | Contractuelle ou de fait | À renseigner |
| Intuitu personae | Lien personnel entre les dirigeants, traitement préférentiel | À renseigner |
| Dépendance économique | Part du CA réalisée avec la contrepartie | À renseigner |

**Conclusion qualification :**

- 🟢 **Relation établie.** L'ensemble des critères pertinents est réuni. L.442-1, II C.com. est applicable. Poursuivre Étapes 3-5.
- 🟡 **Borderline `[review]`.** Certains critères réunis, d'autres manquent ou sont fragiles. Documenter les deux lectures. Risque jurisprudentiel — Judilibre obligatoire au post-flight.
- ⛔ **Relation NON établie.** Critères structurants manquants (relation ponctuelle, durée trop courte, absence de régularité). L.442-1, II C.com. inapplicable. Examiner subsidiairement art. 1112 C.civ. (rupture fautive de pourparlers), art. 1240 C.civ. (concurrence déloyale). Recommandation : Renoncer ou Compléter les faits.

Toute conclusion 🟡 borderline : tag `[review]` obligatoire.

---

## Étape 3 — Évaluation du préavis raisonnable

Le préavis raisonnable n'est pas chiffré par la loi. Il est apprécié au cas
par cas par le juge à partir des critères du faisceau d'indices.

**Règle de pouce jurisprudentielle (PAS une règle légale) :** ≈ 1 mois de
préavis par année d'ancienneté de la relation. Cette grille empirique est
modulée par le juge selon :
- **Modulation à la hausse :** forte exclusivité, dépendance économique
  (≥ 30 % CA usuel, parfois moins selon secteur), spécificité de
  l'investissement (machines dédiées, formation du personnel),
  difficulté de reconversion, secteur en contraction.
- **Modulation à la baisse :** secteur à rotation courte (mode, tech),
  contrats à exécution successive de très courte durée, faible
  spécificité de la prestation.

**Méthode du skill :**

1. Calculer le plancher = 1 mois × années d'ancienneté.
2. Identifier les facteurs de modulation présents.
3. Produire une **fourchette en mois (min-max)** et non un chiffre figé. Tag `[review]` sur la fourchette.
4. Comparer au préavis effectivement accordé.

| Champ | Contenu |
|---|---|
| Ancienneté | N années |
| Plancher règle de pouce | N mois |
| Facteurs de modulation | À documenter |
| Préavis raisonnable estimé | Fourchette X-Y mois `[review]` |
| Préavis effectivement accordé | Z mois (date notification → date effet) |
| Différentiel | (X-Y) − Z = mois manquants |

**Conclusion préavis :**

- 🟢 **Préavis suffisant** — Z ≥ X (haut de fourchette) ; auteur protégé.
- 🟠 **Préavis insuffisant** — Z dans la fourchette mais < X ; risque de condamnation.
- 🔴 **Préavis manifestement insuffisant** — Z < bas de fourchette ; risque élevé.

**Safe harbor 18 mois — protection défensive de l'auteur.**

Art. L.442-1, II al. 2 C.com. : « En cas de litige entre les parties sur la
durée du préavis, la responsabilité de l'auteur de la rupture ne peut être
engagée du chef d'une durée insuffisante dès lors qu'il a respecté un
préavis de **dix-huit mois**. » `[stable]`

Lecture canonique du skill — à ne **jamais** présenter autrement :

- Le safe harbor protège l'auteur qui a **effectivement accordé** un
  préavis écrit de 18 mois. Il est alors **immunisé** contre toute
  condamnation pour préavis insuffisant.
- Ce n'est **pas** un plafond légal du préavis dû. Un préavis raisonnable
  estimé à 24 mois reste défendable par la victime si l'auteur n'a accordé
  que 12 mois.
- Le safe harbor n'est **pas** invocable si le préavis effectivement
  accordé est inférieur à 18 mois.
- Toute conclusion qui s'appuie sur le safe harbor → tag `[review]`
  obligatoire.

Si l'auteur a accordé ≥ 18 mois et le revendique → 🟢 protection défensive
acquise (sauf collusion / dénaturation `[review]`). Si l'auteur a accordé
< 18 mois → safe harbor non invocable, l'évaluation se fait selon la grille
ci-dessus.

---

## Étape 4 — Estimation du préjudice indemnisable

Base de calcul jurisprudentielle constante : **marge brute** sur la période
de préavis manquante (PAS le chiffre d'affaires, qui inclut des coûts
variables non subis par la victime du fait de la non-exécution).

**Formule :**

```
Préjudice = (préavis raisonnable estimé − préavis effectif) × marge brute mensuelle moyenne
```

**Méthode :**

1. Calculer la marge brute mensuelle moyenne sur les 24-36 mois précédant la rupture (sur comptes audités si disponibles, sinon estimation et `[review]`).
2. Multiplier par les mois de préavis manquants (différentiel Étape 3).
3. Produire une **fourchette d'indemnisation** (min-max) calée sur la fourchette de préavis raisonnable.
4. Ajouter éventuellement des postes accessoires (investissements spécifiques non amortis, frais de licenciement consécutifs, rupture d'agence commerciale — régime distinct L.134-12 C.com. `[à vérifier]`).

**Si données comptables non fournies :** produire la méthodologie sans chiffre, tag `[review]` et demander les comptes audités N-2 / N-1 / N de la victime, ou les statistiques de marge sectorielle.

| Champ | Contenu |
|---|---|
| Marge brute mensuelle moyenne | À renseigner (€) ou `[review — comptes manquants]` |
| Mois de préavis manquants | (X-Y) − Z |
| Préjudice principal estimé | Fourchette en € `[review]` |
| Postes accessoires éventuels | À documenter |
| Indemnisation totale estimée | Fourchette consolidée `[review]` |

---

## Étape 5 — Cas de dispense de préavis

L'auteur de la rupture est dispensé de tout préavis dans trois hypothèses,
appréciées **strictement** par la jurisprudence — la simple insatisfaction
commerciale ou un manquement ordinaire ne suffisent pas.

| Cas | Fondement | Critère d'appréciation |
|---|---|---|
| Inexécution grave de l'autre partie | L.442-1, II al. 1 C.com. `[stable]` | Gravité documentée (manquement substantiel, répété, non régularisé après mise en demeure). Charge de la preuve sur l'auteur. |
| Force majeure | art. 1218 C.civ. `[stable]` | Événement extérieur, imprévisible, irrésistible. Conditions cumulatives. |
| Événements exonératoires sectoriels | Selon réglementation sectorielle `[à vérifier]` | Sanctions économiques, retraits d'agrément, embargo, etc. |

**Méthode :**

1. Identifier la dispense alléguée par l'auteur (ou explorer la défense possible si l'analyse est faite côté auteur).
2. Documenter les faits invoqués.
3. Appliquer le critère strict. Tag `[review]` systématique — la défensibilité d'une dispense est un jugement d'avocat.
4. Conclure : dispense **défensible** / **fragile** / **non soutenable**.

Si dispense non soutenable et préavis 🔴 manifestement insuffisant : la
victime a un dossier solide.

Si dispense défensible et préavis 🔴 : l'auteur a une défense, mais le
risque demeure si la juridiction écarte la dispense.

---

## Étape 6 — Liste de points (issues list)

Appel interne au skill `liste-de-points` pour produire un tableau consolidé,
trié par criticité décroissante (🔴 → 🟠 → 🟡 → 🟢) :

```
| # | Point | Statut | Risque | Position souhaitée | Action proposée |
|---|---|---|---|---|---|
```

Une ligne par finding (qualification, préavis, préjudice, dispense, alertes
transverses). Pas de remplissage. Tri stable.

Si l'analyse aboutit à ⛔ relation non établie : liste de points minimale,
recommandation Renoncer documentée.

---

## Étape 7 — Post-flight verifier-citations

Appel automatique de `verifier-citations` sur la sortie complète, mode
défaut (`articles` + `jurisprudence`). Le skill :

- Vérifie L.442-1, II C.com. sur Légifrance (version en vigueur, alerte
  abrogation / modification).
- Lookup Judilibre pour la jurisprudence ch. com. sur les critères de
  relation établie, préavis raisonnable et préjudice — fraîcheur 3 ans
  recommandée.
- Annote : `[Légifrance ✓]`, `[Judilibre ✓]`, `[abrogé]`, ou `[à vérifier]`
  en mode dégradé.

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur.

**Rappel veille.** La jurisprudence rupture brutale évolue régulièrement.
Suggérer en note du relecteur de consulter le digest produit par
`veille-jurisprudence` (V1.2) pour les arrêts post-date pivot.

---

## Ce skill ne fait pas

- Engager l'action judiciaire (acte de l'avocat plaidant).
- Traiter le déséquilibre significatif L.442-1, **I** → renvoyer `reviser-contrat`.
- Revoir un contrat de distribution PI-centric → hors périmètre : orienter vers un spécialiste PI.
- Préparer la déclaration de créance si l'auteur est en procédure collective → renvoyer `declaration-creance`.
- Donner un avis sur le régime distinct de l'agent commercial (L.134-12 C.com.) — signalement uniquement, skill dédié hors v2a.
- Chiffrer un préjudice sur comptes non audités sans tag `[review]`.

---

## Ton

Technique, structuré, factuel. Identifier clairement la position du client
(auteur ou victime). Présenter le safe harbor 18 mois exclusivement comme
protection défensive de l'auteur, jamais comme plafond légal. Exprimer le
préavis raisonnable en fourchette, pas en chiffre figé. Signaler les risques
majeurs (qualification borderline, préavis 🔴, dispense fragile). Rappeler
que la sortie est un brouillon soumis à validation humaine (avocat) avant toute mise
en demeure, transaction ou assignation.
