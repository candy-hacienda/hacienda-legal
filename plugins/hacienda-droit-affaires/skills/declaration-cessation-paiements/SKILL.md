---
name: declaration-cessation-paiements
description: >
  Côté débiteur/dirigeant : prépare la déclaration de cessation des paiements
  (« dépôt de bilan ») à déposer au greffe quand l'entreprise ne peut plus faire
  face à son passif exigible avec son actif disponible (art. L.631-1 C.com.).
  Qualifie la cessation des paiements, calcule le délai légal de 45 jours
  (L.631-4 RJ / L.640-4 LJ), ALERTE si la déclaration est tardive (faute de
  gestion possible, L.651-2 insuffisance d'actif, période suspecte rallongée),
  liste les pièces obligatoires R.631-1 C.com., oriente tribunal compétent et
  RJ vs LJ, et rédige le squelette de la déclaration avec [à compléter] sur les
  chiffres. Gate : si l'entreprise n'est PAS encore en cessation des paiements,
  renvoi `prevention-difficultes` (mandat ad hoc / conciliation / sauvegarde).
  Ne fabrique jamais les chiffres du client ; n'évalue pas la responsabilité du
  dirigeant (la nomme et renvoie à un avocat). Brouillon, validation humaine
  (avocat) OBLIGATOIRE.
version: "2.0.0"
argument-hint: "[forme sociale, date présumée de cessation des paiements (ou actif disponible / passif exigible), RJ ou LJ envisagé ; côté débiteur]"
authors: ["Hacienda"]
tags: [procedures-collectives, cessation-paiements, depot-de-bilan, debiteur, l631-4]
---

# Skill — Déclaration de cessation des paiements (L.631-4)

> **BROUILLON, validation humaine (avocat) OBLIGATOIRE.**
>
> Le délai de **45 jours** pour déclarer la cessation des paiements (art. L.631-4
> C.com. pour le redressement, L.640-4 C.com. pour la liquidation)
> est une **règle dure** : la déclaration tardive est une faute de gestion
> classiquement sanctionnée (interdiction de gérer, art. L.653-8 C.com. ;
> contribution à l'insuffisance d'actif, art. L.651-2 C.com.).
> Le délai ne court pas si une **conciliation** (L.611-4) a été demandée dans
> l'intervalle.
>
> La **date de cessation des paiements** est un **jugement** (actif disponible
> vs passif exigible, art. L.631-1 C.com.) lourd de conséquences : la **période
> suspecte** (nullités L.632-1 / L.632-2) court à rebours depuis elle, et le
> tribunal peut la reporter jusqu'à **18 mois** avant le jugement (L.631-8).
> Toujours taguer la date retenue `[review]`.
>
> **Deux versions, deux destinataires.** La réponse du skill s'adresse
> **d'abord à l'avocat** : version interne, avec note du relecteur et tags de
> provenance **obligatoires**. La déclaration à **déposer au greffe** (livrable
> externe, sans en-tête de confidentialité, cf. CLAUDE.md plugin §2) n'est
> produite **que sur demande explicite** — voir « Mode silencieux ».

---

## Examples

<example>
<user>/h-da:declaration-cessation-paiements — SAS, trésorerie épuisée, passif fournisseurs+URSSAF exigible, redressement espéré</user>
<response>
1. Gate CdP (L.631-1) : sur les chiffres fournis, passif exigible > actif disponible → cessation **probable**, insuffisance provisoire ~[X] € **à confirmer par une situation de trésorerie datée**. Ne pas écrire « établie ».
2. Date de CdP : **non arrêtée** — déduite de chiffres datés, fixée par le tribunal ; le premier impayé n'est qu'un indice. Laisser `[à compléter — date à arrêter avec l'expert-comptable]` `[review]`, ne pas fabriquer de date.
3. Délai 45 j (L.631-4) : court depuis la date réelle ; **aucune échéance exacte calculable** tant que la date n'est pas arrêtée. Traiter le dépôt comme une obligation à brève échéance ; alerte retard **conditionnelle** si la date se confirme ancienne.
4. Tribunal : SAS = société commerciale → tribunal de commerce.
5. Orientation : redressement **sans le garantir** — réclamer financement/trésorerie prévisionnelle/rentabilité avant de pencher ; sinon présenter RJ et LJ. Le tribunal tranche.
6. Pièces R.631-1 (liste complète, dont état actif disponible/passif exigible + attestation sur l'honneur mandat ad hoc/conciliation < 18 mois) + squelette de déclaration ([à compléter] : chiffres, créances, inventaire).
</response>
</example>

<example>
<user>/h-da:declaration-cessation-paiements — SARL, le client dit que « ça s'est dégradé il y a ~4 mois », activité quasi arrêtée</user>
<response>
Gate CdP : cessation **probable** (à confirmer par situation datée). Date de CdP **non arrêtée** : « ~4 mois » est une approximation du client, **pas** une date — `[à compléter — à arrêter avec l'expert-comptable]` `[review]`. Ne pas convertir en date précise.
Délai 45 j : **si** la date se confirme à ~4 mois, le délai serait **vraisemblablement dépassé (à confirmer)** — pas un retard établi.
ALERTE exposition dirigeant (conditionnelle) : un dépassement exposerait personnellement le dirigeant — faute de gestion possible (interdiction de gérer L.653-8 ; insuffisance d'actif L.651-2), période suspecte depuis la date de CdP (L.632-1/2). **Nommer, pas évaluer** : faire évaluer par un avocat. Agir sans délai.
Orientation : activité quasi arrêtée → la LJ (L.640-1) est plausible **mais** réclamer les données de viabilité avant de pencher ; le tribunal décide.
</response>
</example>

<example>
<user>/h-da:declaration-cessation-paiements — on a des tensions de trésorerie mais un moratoire URSSAF en cours et une ligne de crédit dispo</user>
<response>
Gate CdP (L.631-1) : les **réserves de crédit** et **moratoires** obtenus entrent dans l'actif disponible — s'ils permettent de faire face au passif exigible, il n'y a **pas** cessation des paiements. → Probablement **pas** en CdP `[review]`.
Renvoi `/h-da:prevention-difficultes` : tant qu'il n'y a pas CdP, la **sauvegarde** (L.620-1) et les dispositifs amiables (mandat ad hoc, conciliation) restent ouverts — souvent préférables au dépôt de bilan. Ne pas déclarer une CdP qui n'est pas caractérisée.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`, bloc procédures collectives :
> - **Position** — débiteur (cas dominant ici, à confirmer)
> - **Tribunaux habituels** — repérage du greffe compétent
> - **Qualité signataire** — dirigeant de droit habilité (gérant, président, DG)

Si le bloc est `[A CONFIGURER]` : stopper et demander `/h-da:entretien-demarrage`.

---

## Intake

1. **Forme sociale / qualité du débiteur** — SAS, SARL, SA, SNC, EI, profession libérale… (**obligatoire** — détermine le tribunal compétent et l'éligibilité L.631-2)
2. **Cessation des paiements** — date présumée, OU éléments pour la qualifier : **actif disponible** (trésorerie, valeurs réalisables immédiatement, réserves de crédit, moratoires) vs **passif exigible** (dettes échues et exigées) (**obligatoire**)
3. **Procédure envisagée** — `RJ` (redressement, si poursuite d'activité envisageable) ou `LJ` (liquidation, si redressement manifestement impossible) ; à défaut, orienter
4. **Conciliation/mandat ad hoc en cours ?** (optionnel) — si une conciliation a été demandée, le délai de 45 j est suspendu/neutralisé (L.631-4) `[review]`
5. **Données financières** (optionnel à ce stade) — fournies plus tard pour compléter la déclaration ; le skill ne les invente pas

Si la forme sociale ou les éléments de CdP sont absents : stopper et demander. Pas de valeur par défaut.

---

## Gate non-juriste

- [ ] Forme sociale et éléments de cessation des paiements fournis (refus du défaut)
- [ ] Profil cabinet bloc procédures collectives lu ; qualité signataire (dirigeant de droit) identifiée
- [ ] **Gate CdP** : qualification L.631-1 explicite (actif disponible vs passif exigible, réserves de crédit/moratoires pris en compte). Cessation **probable** (insuffisance provisoire chiffrée, à confirmer par situation datée) — **pas** « établie » sur chiffres non datés. Si **pas** de CdP → renvoi `prevention-difficultes`, ne pas rédiger de déclaration
- [ ] Date de CdP **non fabriquée** : pas de date calendaire précise sur une approximation ; premier impayé = indice, pas la date ; `[à compléter]` + `[review]` (point de départ période suspecte, fixée par le tribunal)
- [ ] Délai 45 j : **aucune échéance exacte calculable** tant que la date n'est pas arrêtée ; retard présenté **conditionnellement**, jamais affirmé sur la seule ancienneté d'un impayé ; neutralisé si conciliation demandée
- [ ] Si délai **possiblement dépassé** : alerte exposition dirigeant (faute de gestion, L.653-8 ; insuffisance d'actif L.651-2) — risque cristallisé par l'**omission consciente hors conciliation** ; **recommander de documenter la chronologie** (impayés, prise de conscience, démarches) ; renvoi évaluation à un avocat — **nommée, pas évaluée**
- [ ] **Voie préventive maintenue** tant que la CdP n'est que probable : si la situation datée n'établit pas la cessation → `prevention-difficultes` ; conciliation (L.611-4) bornée (ouverte tant qu'il n'y a pas CdP > 45 j)
- [ ] Tribunal compétent identifié (TC vs tribunal judiciaire selon la qualité du débiteur)
- [ ] Orientation RJ/LJ **sans trancher** : redressement non garanti, données de viabilité (financement/trésorerie/rentabilité) réclamées ; le tribunal décide
- [ ] Checklist pièces R.631-1 **complète** (dont état actif disponible/passif exigible, attestation sur l'honneur mandat ad hoc/conciliation < 18 mois, formalités datation/signature/certification/délai 7 j/motivation des absences, SIREN/CA/ICPE) ; aucune donnée fabriquée, aucune pièce déclarée « sans objet » sans vérification
- [ ] Aucune **fabrication** : ni date, ni chiffres, ni créanciers, ni biens, ni personnes — `[à compléter]` partout où la donnée n'est pas fournie. **En particulier** : ne pas convertir une approximation (« ~10 semaines ») en **dates calendaires** ni en **jours de retard précis** — rester en semaines relatives
- [ ] Sortie comprend : qualification CdP (probable) + statut délai conditionnel + orientation RJ/LJ + projet déclaration + pièces + note du relecteur + question hors checklist + arbre 5 options

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Identité entreprise (forme sociale, dirigeants) : `company_full_profile`, `bodacc_by_siren`.
- **Pas de lookup procédure** (`bodacc_procedures`) : la DCP est **pré-procédure**, aucune annonce n'existe encore.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/declaration-cessation-paiements-<denomination-ou-siren>-<date-cdp>.md
```
Format date : `YYYY-MM-DD`.

---

## Sortie

Structurer la sortie avec : faits retenus, droit applicable, analyse, incertitudes, sources consultées, décisions proposées, prochaine action et validation humaine. Toute source non consultée directement reste `[à vérifier]`.

## Étape 1 — Gate CdP (L.631-1)

1. Lire profil cabinet (bloc procédures collectives) et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`.
2. **Qualifier la cessation des paiements** (art. L.631-1 C.com.) : *impossibilité de faire face au passif exigible avec l'actif disponible*.
   - **Actif disponible** = liquidités + valeurs réalisables immédiatement + **réserves de crédit** et **moratoires** dont bénéficie le débiteur (L.631-1 al. 2).
   - **Passif exigible** = dettes échues **et** exigées (réclamées).
   - **Moratoire — exclusion provisoire, sous réserve de son respect.** Une dette rééchelonnée par un moratoire (ex. échéancier URSSAF) sort du passif **immédiatement** exigible **tant que le moratoire est honoré** : l'exclure de l'analyse mais le dire explicitement — un **défaut sur une échéance du moratoire rend la dette à nouveau exigible** et peut (re)caractériser la cessation. Ne pas neutraliser une dette moratoriée sans ce caveat.
   - Si actif disponible ≥ passif exigible (notamment grâce à un moratoire/ligne de crédit) → **pas de CdP** → **stopper la rédaction** et renvoyer `/h-da:prevention-difficultes` (sauvegarde + amiable encore ouverts).
   - **Conclusion mesurée, jamais affirmée sur des chiffres non datés.** Tant que les chiffres ne sont pas établis par une **situation de trésorerie datée**, conclure à une cessation **probable** (et non « établie »), en chiffrant l'**insuffisance provisoire** (passif exigible − actif disponible) **sous réserve de confirmation**. Ne pas écrire « cessation établie » sur des chiffres approximatifs. Si la cessation n'est finalement pas confirmée → `/h-da:prevention-difficultes` (et borner la conciliation : ouverte tant qu'il n'y a pas CdP de plus de 45 j).
3. **Date de cessation des paiements — ne jamais la fabriquer ni l'ancrer sur le premier impayé.** La date de CdP est celle où l'actif disponible est devenu insuffisant pour couvrir le passif exigible ; elle se déduit de **chiffres datés** et est **fixée par le tribunal** (report possible jusqu'à 18 mois, L.631-8). Le **premier impayé et les mises en demeure ne sont que des _indices_, jamais la date elle-même.** Si la date n'est pas établie par des pièces datées : ne **pas** produire de date calendaire précise — la laisser en **fourchette / `[à compléter — date exacte à arrêter avec l'expert-comptable]`**, taguée `[review]` (point de départ de la période suspecte, L.632-1/L.632-2). Une approximation du client (« il y a ~10 semaines ») reste une approximation : ne pas la convertir en date précise présentée comme acquise.

## Étape 2 — Délai légal de 45 j + alerte (conditionnelle tant que la date n'est pas arrêtée)

Le délai de déclaration est de **45 jours à compter de la date réelle de cessation des paiements** (art. L.631-4 C.com. RJ / L.640-4 C.com. LJ). Il est neutralisé si une **conciliation** (L.611-4) a été demandée dans l'intervalle.

**Règle d'or : aucune échéance exacte n'est calculable tant que la date de CdP n'est pas arrêtée.** Ne **pas** inventer de date limite ni de nombre de jours de retard à partir d'une date approximative.

- **Date de CdP établie (pièces datées)** : échéance = date + 45 j (prorogée au 1er jour ouvrable suivant si week-end/férié, art. 642 CPC) ; calculer les jours restants.
- **Date de CdP non encore arrêtée** : présenter le délai **conditionnellement** — « 45 j à compter de la date qui sera retenue ; dès qu'elle est arrêtée, échéance = date + 45 j ». Le **retard est possible, à confirmer** — ne jamais l'affirmer catégoriquement sur la seule ancienneté d'un impayé.
  - **INTERDICTION ABSOLUE de fabriquer des dates.** Rester en **termes relatifs** (« ~10 semaines », « ~45 jours »). Ne **jamais** convertir une approximation en **dates calendaires** (proscrit : « entre le 10 avril et le 15 mai 2026 ») ni en **nombre de jours de retard précis** (proscrit : « dépassé d'environ 25 jours »). Produire une date ou une échéance calendaire à partir d'une approximation **est une fabrication** (cf. règle de non-supplémentation). Tout au plus : « si la CdP se confirme autour de ~10 semaines, le délai de 45 j serait vraisemblablement dépassé — à confirmer une fois la date arrêtée sur pièces datées ».

Dans tous les cas, le message d'**urgence d'agir** ne dépend pas d'une date précise : la cessation étant probable, traiter le dépôt comme une **obligation à brève échéance** et ne pas inviter à temporiser.

**Alerte exposition dirigeant (si le délai est — même conditionnellement — possiblement dépassé) — NOMMER, ne pas évaluer :**
> Un dépassement des 45 j exposerait **personnellement le dirigeant** : faute de gestion pouvant justifier une **interdiction de gérer** (art. L.653-8 C.com.) et une **action en contribution à l'insuffisance d'actif** (art. L.651-2 C.com.) ; la **période suspecte** court depuis la date de CdP (nullités L.632-1/L.632-2). Le risque se cristallise surtout en cas d'**omission consciente de déclarer** alors qu'**aucune conciliation (L.611-4) n'a été demandée** dans le délai — la demande de conciliation neutralise le délai et atténue d'autant le reproche. **Recommander de documenter la chronologie** (dates des impayés, moment de la prise de conscience de la cessation, démarches amiables entreprises) : c'est la pièce maîtresse de la défense du dirigeant. **Agir sans délai** — un retard aggraverait l'exposition. L'**évaluation** de cette responsabilité (faute caractérisée, quantum, moyens de défense, sort des cautions) relève de `/h-da:responsabilite-dirigeant` (qualification des 4 axes) puis d'un avocat. `[review]`

## Étape 3 — Tribunal compétent

| Qualité du débiteur | Juridiction |
|---|---|
| Commerçant, artisan, société commerciale (SAS, SARL, SA, SNC…) | **Tribunal de commerce** |
| Profession libérale, agriculteur, association, société civile, autre personne morale de droit privé non commerçante | **Tribunal judiciaire** |

Fondement : éligibilité L.631-2 C.com. ; compétence selon la qualité du débiteur `[à vérifier]` (confirmer le greffe compétent localement).

## Étape 4 — Orientation RJ vs LJ (sans trancher, et seulement avec les données)

- **Redressement judiciaire (RJ)** — activité poursuivie, redressement **possible** (L.631-1).
- **Liquidation judiciaire (LJ)** — redressement **manifestement impossible** (art. L.640-1 C.com.).
- **Ne pas choisir la procédure à la place du dirigeant ni du tribunal.** Évaluer le redressement **sans le garantir** et **réclamer d'abord les données** qui conditionnent ce jugement : financement disponible, trésorerie prévisionnelle, rentabilité / carnet de commandes. Sans ces données, présenter les **deux voies**, pas une recommandation ferme.
- Mention obligatoire : **c'est le tribunal qui qualifie et décide** ; le dirigeant *demande* l'ouverture de la procédure. `[review]`

## Étape 5 — Pièces à joindre (R.631-1 C.com.)

Checklist (art. R.631-1 C.com. `[à vérifier]` — confirmer la liste en vigueur sur Légifrance) — tabulaire → **dashboard HTML auto** :

| # | Pièce | Source | Statut |
|---|---|---|---|
| 1 | Comptes annuels du dernier exercice | client | [à compléter] |
| 2 | Situation de trésorerie datée de moins d'un mois | client | [à compléter] |
| 3 | **État du passif exigible et de l'actif disponible** (établissant la cessation) | client | [à compléter] |
| 4 | État chiffré des créances et des dettes avec noms et domiciles des créanciers | client | [à compléter] |
| 5 | État actif et passif des sûretés + engagements hors bilan | client | [à compléter] |
| 6 | Inventaire sommaire des biens | client | [à compléter] |
| 7 | Nombre de salariés + chiffre d'affaires (dernier exercice) + SIREN | client | [à compléter] |
| 8 | Nom et adresse des représentants du personnel (CSE) | client | [à compléter] |
| 9 | **Attestation sur l'honneur** d'absence (ou existence) de mandat ad hoc / conciliation dans les **18 derniers mois** | dirigeant | [à compléter] |
| 10 | Le cas échéant : liste des membres tenus solidairement / indéfiniment du passif ; documents **ICPE** si activité classée | client | [à compléter] |

**Formalités des pièces :** chaque pièce doit être **datée, signée et certifiée sincère et véritable** par le dirigeant. Une pièce qui ne peut être fournie au dépôt peut être produite dans un **délai de 7 jours** (à confirmer sur Légifrance `[à vérifier]`), et **toute absence ou impossibilité doit être motivée** dans la déclaration.

Ne **jamais** renseigner une donnée à la place du client : `[à compléter]` partout où la donnée n'est pas fournie, et **ne pas affirmer qu'une pièce est « sans objet » sans vérification** (`[review]`).

## Étape 6 — Rédaction de la déclaration (squelette)

```
[Identité débiteur : dénomination, forme sociale, SIREN, siège, représentant légal]

À : Monsieur/Madame le Président du [Tribunal de commerce / Tribunal judiciaire] de [ville]

OBJET : DÉCLARATION DE CESSATION DES PAIEMENTS — DEMANDE D'OUVERTURE D'UNE PROCÉDURE DE [REDRESSEMENT / LIQUIDATION] JUDICIAIRE

Le débiteur soussigné déclare se trouver en état de cessation des paiements au sens de l'art. L.631-1 C.com., étant dans l'impossibilité de faire face à son passif exigible avec son actif disponible.

- Date de cessation des paiements : [date] [review]
- Actif disponible : [à compléter — €]
- Passif exigible : [à compléter — €]
- Procédure demandée : [redressement judiciaire (L.631-4) / liquidation judiciaire (L.640-4)]

Conformément à l'art. R.631-1 C.com., sont jointes les pièces listées au bordereau ci-annexé.

Les pièces listées au bordereau R.631-1 ci-annexé sont **datées, signées et certifiées sincères et véritables**. Les pièces non disponibles à ce jour seront produites dans le **délai de 7 jours** (R.631-1 `[à vérifier]`) ; leur absence est motivée au bordereau.

Fait à [ville], le [date].
Signature, qualité du signataire (dirigeant de droit habilité : [gérant / président / DG]).
```

## Étape 7 — Post-flight `verifier-citations`

Appel automatique sur la sortie complète. Articles à vérifier : **L.631-1, L.631-2, L.631-4, L.631-8, L.632-1, L.632-2, L.640-1, L.640-4, L.651-2, L.653-8 C.com., R.631-1 C.com., art. 642 CPC**. Tag `[Légifrance]` uniquement si l'article a été lu via `legifrance_get_article` dans la session (l'index `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md` donne les identifiants, ce n'est pas une vérification) ; sinon `[à vérifier]`. Si PISTE non configuré : mode dégradé documenté.

## Étape 8 — Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — voir CLAUDE.md du plugin]

> ⚠️ Note du relecteur
> - **Sources :** Légifrance ✓ / Pappers ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** éléments financiers fournis : {liste} | aucun (squelette seul)
> - **Signalé pour ton jugement :** date de CdP [review] ; orientation RJ/LJ [review] ; {alerte tardive le cas échéant}
> - **Fraîcheur :** vérification jurisprudence post-{date} sur la date de CdP / déclaration tardive — {N} arrêts [Judilibre] | recherche impossible
> - **Avant de t'appuyer dessus :** {action concrète — ex. faire confirmer la date de CdP et l'actif disponible par l'expert-comptable} | « prêt pour dépôt au greffe »

# Qualification de la cessation des paiements
- Actif disponible vs passif exigible (L.631-1) : [synthèse chiffrée] → cessation **probable**, insuffisance provisoire [N] € **à confirmer par une situation de trésorerie datée** [review]
- **Voie préventive — à garder ouverte tant que la CdP n'est pas confirmée** : si la situation datée n'établit **pas** la cessation → `/h-da:prevention-difficultes` (mandat ad hoc / conciliation). La **conciliation (L.611-4)** reste accessible tant qu'il n'y a pas cessation des paiements **depuis plus de 45 jours** ; tant qu'elle l'est, elle est souvent préférable au dépôt de bilan. `[review]`
- {Si pas de CdP du tout : renvoi prevention-difficultes — pas de déclaration}

# Statut délai de déclaration (conditionnel)
- Date de cessation des paiements : **non arrêtée** — [fourchette / à compléter, à arrêter avec l'expert-comptable] [review] (le premier impayé est un indice, pas la date ; fixée par le tribunal)
- Délai légal : 45 jours à compter de la date retenue (L.631-4 / L.640-4) — **aucune échéance exacte calculable** tant que la date n'est pas arrêtée
- Lecture conditionnelle : {si la date se confirme autour de [période], le délai serait vraisemblablement dépassé — à confirmer} ; dans tous les cas, dépôt = obligation à brève échéance
- {Alerte exposition dirigeant si délai possiblement dépassé : bloc responsabilité — nommée, pas évaluée}

# Tribunal compétent et orientation
- Tribunal : [TC / TJ de ville]
- Orientation : redressement non garanti — données de viabilité (financement/trésorerie/rentabilité) à fournir ; sinon présenter RJ **et** LJ. Le tribunal décide [review]

# Déclaration de cessation des paiements — projet
[texte complet du template Étape 6]

# Pièces à joindre (R.631-1)
[checklist Étape 5]

# Une question hors de ma checklist habituelle
{Observation transversale — ex. caution personnelle du dirigeant, compte courant d'associé débiteur, actif immobilier susceptible de modifier l'orientation LJ. Omettre si rien d'honnête.}

# Que veux-tu faire ? Choisis une option et je la déroule :
1. **Rédiger** — je complète la déclaration et le bordereau de pièces dès que tu fournis les chiffres.
2. **Escalader** — note vers {approbateur / avocat référent configuré} : faits-clés, délai, exposition dirigeant.
3. **Compléter les faits** — questions à l'expert-comptable / dirigeant (situation de trésorerie datée, date de CdP à arrêter sur pièces, état des créances, données de viabilité).
4. **Surveiller et attendre** — j'ajoute l'échéance des 45 j au tracker ; rappel avant dépôt.
5. **Autre** — précise.
```

### Mode silencieux (livrable externe — déclaration déposée au greffe)

**Quand l'appliquer.** Par défaut, produis la version interne pour l'avocat (note du relecteur et tags compris). Le mode silencieux ne s'applique que lorsque l'utilisateur demande explicitement la version à déposer au greffe ; même alors, la note du relecteur et le statut de vérification des citations sont livrés dans un message d'accompagnement séparé.

La déclaration est un livrable externe (CLAUDE.md §2) : retirer l'en-tête de confidentialité avocat dans la version déposée ; conserver la note du relecteur dans le message d'accompagnement, pas dans la déclaration ; couper la narration de skill et les renvois inter-commandes ; consolider les tags `[Légifrance]` en pied si besoin.

---

## Ce skill ne fait pas

- La **fixation de la date** de cessation des paiements (le tribunal la fixe, L.631-8) — le skill ne fabrique pas de date : il l'établit sur pièces datées ou la laisse `[à compléter]` `[review]`, le premier impayé n'étant qu'un indice.
- L'**évaluation** de la responsabilité du dirigeant (faute de gestion, insuffisance d'actif L.651-2, sanctions, sort des cautions) → `/h-da:responsabilite-dirigeant` / avocat. Le skill **nomme** l'exposition, il ne l'évalue pas.
- Le **dépôt physique** au greffe et la comparution (actes du dirigeant / de l'avocat).
- Le **choix amiable vs collectif** quand il n'y a pas (encore) cessation des paiements → `prevention-difficultes`.
- Le **montage de cession** (pre-pack, plan de cession) → `pre-pack-cession` / avocat restructuring.
- Le conseil fiscal lié à la défaillance → hors scope, renvoi.

---

## Ton

Technique, factuel, **urgence calibrée par les jours restants**. Sur la déclaration tardive : honnêteté directe (l'exposition dirigeant est réelle et personnelle) sans dramatiser ni évaluer — nommer, renvoyer à l'avocat. Sur l'absence de CdP : ne pas pousser au dépôt de bilan quand la prévention reste ouverte (le dépôt est rarement la meilleure option si la sauvegarde est encore accessible). La déclaration engage l'ouverture d'une procédure et la date de période suspecte : le brouillon est soumis à validation humaine (avocat) avant dépôt.
