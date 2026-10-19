---
name: constitution-societe
description: >
  Assistance à la constitution de société : mode --comparer (aide au choix
  de forme SAS/SARL/SA) et mode --draft (brouillon assisté de statuts, chaque
  point de décision tagué [review]). Détecte la bifurcation acte sous seing
  privé vs notarié obligatoire. Brouillon soumis à validation humaine (avocat)/notaire.
version: "2.0.0"
argument-hint: "[--comparer ou --draft, forme envisagée, associés, activité]"
authors: ["Hacienda"]
tags: [constitution, societes, statuts, sas, sarl, sa, actes]
---

# Skill — Constitution de société

> **BROUILLON ASSISTÉ — validation humaine (avocat)/NOTAIRE IMPÉRATIVE.**
>
> Ce skill assiste la rédaction d'**actes constitutifs** — c'est l'opération au
> risque juridique le plus élevé du cluster « vie sociale ». Le mode `--draft`
> produit un **brouillon assisté de statuts** : chaque clause appelant un
> arbitrage juridique est taguée `[review]` et la **liste des points à arbitrer**
> est explicitée. Le livrable ne se présente **JAMAIS** comme un jeu de statuts
> « prêt à déposer », « prêt à signer » ou « définitif ».
>
> La constitution engage la forme sociale, le capital, la gouvernance et la
> responsabilité des fondateurs pour des années : une erreur à l'acte se paie
> au capital, pas à la marge. Toute sortie de ce skill doit être **validée par
> un avocat** et, lorsqu'un acte authentique est requis, par un **notaire**,
> avant tout dépôt au greffe ou signature.
>
> Ce disclaimer est un **plancher de responsabilité, pas un contrôle qualité** :
> il ne dispense ni de la relecture humaine, ni de la vérification des sources,
> ni du contrôle des seuils réglementaires.

---

## Examples

<example>
<user>/h-da:constitution-societe --comparer</user>
<response>
1. Lecture profil cabinet (bloc « vie sociale » : formes pratiquées, posture rédaction statuts, notaire partenaire).
2. Cadrage du besoin : 3 fondateurs, ambition de lever des fonds d'ici 18 mois, président souhaitant le régime assimilé salarié, besoin de souplesse pour accueillir des investisseurs.
3. Recommandation depuis `${CLAUDE_SKILL_DIR}/../../references/comparatif-formes-sociales-fr.md` : **SAS** — souplesse statutaire (organes librement définis, pas d'agrément légal imposé), accueil naturel d'investisseurs (actions de préférence, BSA), président assimilé salarié. La SARL est écartée (agrément légal des cessions à tiers art. L.223-14 C.com., rigidité face à une levée ; gérant majoritaire = TNS).
4. Tags `[review]` sur les arbitrages dépendant de critères fiscaux/sociaux (régime social effectif, option IR éventuelle) → renvoi expert-comptable.
5. Sortie : note du relecteur + tableau comparatif + recommandation motivée + question hors checklist + arbre de décision 5 options.
</response>
</example>

<example>
<user>/h-da:constitution-societe --draft --forme=SAS</user>
<response>
1. Lecture profil cabinet (posture rédaction statuts).
2. Intake : SAS, 2 associés, apports en numéraire uniquement, gouvernance simple (un président).
3. Étape 1 — détection bifurcation actes : apports en numéraire seulement → **acte sous seing privé suffit**, pas de commissaire aux apports. Aucun acte notarié requis.
4. Étape 2 — brouillon assisté de statuts : mentions obligatoires art. L.210-2 C.com. (forme, durée, dénomination, siège, objet, capital) + clauses SAS. **Chaque clause d'arbitrage est taguée `[review]`** : montant et libération du capital, clause d'agrément éventuelle (art. L.227-14 C.com.), modalités de direction, règles des décisions collectives (art. L.227-9 C.com.), inaliénabilité éventuelle (plafond 10 ans art. L.227-13 C.com.), choix SSP vs notarié.
5. Étape 3 — post-flight `verifier-citations`.
6. Sortie : note du relecteur + brouillon de statuts `[review]`-tagué + **liste explicite des points à arbitrer** — le livrable est présenté comme un brouillon de travail, pas comme des statuts prêts à déposer.
</response>
</example>

<example>
<user>/h-da:constitution-societe --draft --forme=SARL</user>
<response>
Intake : SARL, 3 associés, dont un apporte un **local commercial** en nature.
Étape 1 — détection bifurcation actes :
- L'apport porte sur un **immeuble** → 🔴 **acte notarié obligatoire**. Motif : la mutation d'un droit réel immobilier doit être publiée au service de la publicité foncière, laquelle n'accepte que des actes authentiques. Un apport d'immeuble par simple SSP serait inopposable aux tiers. Renvoi vers le **notaire partenaire** configuré au profil cabinet.
- L'apport en nature pose la question de l'évaluation → **commissaire aux apports** (art. L.223-9 C.com.) : désignation de principe ; dispense possible à l'unanimité **et** sous double seuil réglementaire — seuils chiffrés `[à vérifier]` (réglementaires). La dispense ne supprime pas la responsabilité solidaire des associés sur la valeur retenue, 5 ans `[à vérifier]`.
Le skill produit le brouillon assisté en signalant que la forme de l'acte n'est pas un arbitrage : elle est imposée. Validation notaire impérative.
</response>
</example>

<example>
<user>/h-da:constitution-societe --draft --forme=SAS — un associé apporte un brevet valorisé 90 000 €</user>
<response>
Étape 1 — détection bifurcation actes :
- Apport en nature d'un brevet (bien meuble incorporel) → pas d'immeuble → **acte SSP suffit** quant à la forme.
- Apport en nature → **commissaire aux apports** : désignation de principe (régime SARL art. L.223-9 C.com. étendu à la SAS `[à vérifier]`). La dispense suppose l'unanimité **et** le respect d'un double seuil réglementaire (montant unitaire de l'apport / fraction du capital) — seuils chiffrés `[à vérifier]`. Une valorisation de 90 000 € peut excéder le seuil de dispense unitaire selon le décret en vigueur → **signalement : commissaire aux apports probablement requis, vérifier le seuil `[à vérifier]`**.
- Même en cas de dispense, les associés restent solidairement responsables 5 ans de la valeur attribuée au brevet `[à vérifier]`.
Renvoi : l'évaluation d'un brevet relève d'une expertise PI → signaler que le périmètre et la valorisation du droit de PI peuvent appeler un spécialiste PI (hors périmètre de ce plugin). Le brouillon de statuts est produit avec point `[review]` sur le traitement de l'apport.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`,
> sous-bloc « vie sociale » du §1 :
> - **Formes sociales pratiquées** — SAS / SARL / SA / SNC / SCI / autres (oriente le périmètre du `--comparer` et la validité de la forme demandée en `--draft`)
> - **Posture rédaction statuts** — standard / sur-mesure investisseurs / minimaliste (calibre le niveau de détail et le sur-mesure du brouillon)
> - **Notaire partenaire (apports en nature, fonds de commerce)** — destinataire du renvoi lorsqu'un acte authentique est requis
> - **Rôle de l'utilisateur courant** — conditionne l'en-tête de confidentialité (avocat / notaire / juriste in-house / non-juriste)
Si le sous-bloc « vie sociale » est encore en `[A CONFIGURER]` : stopper et
demander `/h-da:entretien-demarrage`. Sans notaire partenaire
renseigné, le renvoi en cas d'acte authentique requis ne peut pas être adressé.

---

## Intake

1. **Mode** — `--comparer` (aide au choix de forme) | `--draft` (brouillon assisté de statuts). **Obligatoire** : si absent, demander.
2. **Forme visée** (si `--draft`) — `--forme=SAS` | `--forme=SARL` | `--forme=SA`. Obligatoire en mode `--draft` ; en `--comparer`, c'est la sortie.
3. **Nombre et type d'associés** — combien d'associés, personnes physiques ou morales, présence d'un associé unique (SASU / EURL).
4. **Nature des apports** — numéraire / nature / industrie. Pour les apports en nature, **préciser la nature exacte du bien** (meuble, immeuble, fonds de commerce, droit de PI) — c'est ce qui déclenche la bifurcation des actes.
5. **Spécificités** (optionnel) — gouvernance souhaitée (organes, direction collégiale), présence ou entrée prévue d'investisseurs, contraintes particulières.

Si le mode est absent, ou si `--draft` est demandé sans `--forme` : stopper et
demander explicitement. Pas de valeur par défaut sur la forme sociale.

---

## Gate non-juriste

- [ ] Mode (`--comparer` | `--draft`) fourni ; en `--draft`, `--forme` fournie (refus du défaut)
- [ ] Profil cabinet sous-bloc « vie sociale » lu (formes pratiquées, posture statuts, notaire partenaire)
- [ ] Nature exacte des apports identifiée (meuble / immeuble / fonds de commerce / industrie / numéraire)
- [ ] `--draft` : bifurcation des actes tranchée — SSP ou 🔴 acte notarié obligatoire, avec motif exposé
- [ ] `--draft` : règle du commissaire aux apports signalée en présence d'apports en nature ; seuils chiffrés tagués `[à vérifier]` ; responsabilité 5 ans des associés explicitée
- [ ] `--draft` : mentions obligatoires de l'art. L.210-2 C.com. présentes dans le brouillon
- [ ] `--draft` : chaque clause d'arbitrage taguée `[review]` ; liste des points à arbitrer explicite ; livrable NON présenté comme « prêt à déposer »
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]` ; articles hors index / `R.xxx` en `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur (5 champs) + {comparatif ou bifurcation + brouillon + points à arbitrer} + question hors checklist + arbre de décision 5 options + footer A si applicable

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/constitution-<forme>-<denomination-slug>-YYYY-MM-DD.md
```

Format date : `YYYY-MM-DD`. Pour le mode `--comparer`, suffixer `-comparatif`.

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — voir les 4 variantes dans CLAUDE.md du plugin §2]

> **⚠️ Note du relecteur**
> - **Sources :** Légifrance ✓ / Judilibre ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** intake fourni par l'utilisateur — {synthèse des apports et de la forme}
> - **Signalé pour ton jugement :** {N} éléments marqués [review] (forme/capital, agrément, quorum/majorité, direction, inaliénabilité, SSP/notarié) | aucun
> - **Fraîcheur :** seuils réglementaires (capital SA, commissaire aux apports, commissaire aux comptes) NON figés — {N} seuils [à vérifier] à confirmer sur décret en vigueur
> - **Avant de t'appuyer dessus :** {action concrète — ex. faire valider la forme de l'acte par le notaire si apport d'immeuble ; confirmer les seuils réglementaires} | « prêt pour relecture avocat »

# {Pour --comparer} Tableau comparatif et recommandation
[table comparative restreinte aux axes pertinents + recommandation motivée + formes écartées et pourquoi]

# {Pour --draft} Bifurcation des actes
[conclusion de l'Étape 1 : SSP suffit / 🔴 acte notarié obligatoire + motif ; commissaire aux apports : requis / dispense possible sous seuil [à vérifier]]

# {Pour --draft} Brouillon assisté de statuts — PROJET DE TRAVAIL
[projet de statuts structuré, chaque clause d'arbitrage taguée [review] — NE PAS présenter comme prêt à déposer]

# {Pour --draft} Points à arbitrer
[liste explicite et numérotée des points [review] : forme/montant du capital, libération, traitement des apports et commissaire aux apports, clause d'agrément, quorum/majorité, modalités de direction, inaliénabilité éventuelle, choix SSP/notarié — un avocat (et le notaire si acte authentique) doit trancher chacun]

# Une question hors de ma checklist habituelle
{Observation transversale qu'un relecteur attentif ferait — ex. cohérence objet social / activité réglementée, pacte d'associés à articuler avec les statuts, fiscalité du dirigeant à cadrer avec l'expert-comptable. Omettre la ligne si rien d'honnête.}

# Que veux-tu faire ? Choisis une option et je la déroule :

1. **Rédiger** — je produis le brouillon assisté complet (statuts projet + liste des points à arbitrer + check-list des pièces de constitution), prêt pour relecture avocat/notaire.
2. **Escalader** — note d'escalade vers l'approbateur configuré (ou le notaire partenaire si acte authentique requis) avec faits-clés, forme de l'acte et décision attendue.
3. **Compléter les faits** — questions ouvertes à poser aux fondateurs / à l'expert-comptable / au notaire avant d'avancer (nature exacte des apports, valorisation, régime social et fiscal souhaité).
4. **Surveiller et attendre** — j'ajoute le dossier de constitution au tracker avec note motivée et date de revisite (ex. en attente de l'évaluation d'un apport en nature).
5. **Autre** — précise ce que tu veux en faire.
```

### Mode silencieux (livrable externe)

Si le brouillon de statuts est destiné à être transmis hors du périmètre cabinet
(co-fondateurs non-juristes, notaire) :
- En-tête de confidentialité : CONSERVER s'il protège le document ; l'adapter
  au destinataire (un notaire a son propre en-tête, cf. CLAUDE.md §2).
- Note du relecteur : CONSERVER (point de contrôle unique).
- Narration de skill et renvois inter-commandes : COUPER (placer dans un message
  d'accompagnement séparé).
- Le statut **brouillon / projet de travail** reste affiché : un brouillon de
  statuts transmis ne devient jamais un document final du seul fait de l'envoi.

---

## Étape 1 (--comparer) — Cadrage du besoin

Avant de recommander une forme, cerner le besoin réel. Questions de cadrage :

- **Nombre d'associés** — un seul (SASU / EURL) ou plusieurs ? la SA exige 2 associés minimum `[à vérifier]` ; la SARL plafonne à 100 `[à vérifier]`.
- **Ambition de levée de fonds** — une entrée d'investisseurs à terme oriente vers une forme souple (actions de préférence, BSA, gouvernance modulable).
- **Régime social souhaité du dirigeant** — assimilé salarié (président de SAS, gérant minoritaire de SARL) ou travailleur non salarié (gérant majoritaire de SARL) ? Arbitrage **coût de cotisations / niveau de protection** — dépend de critères sociaux et fiscaux → `[review]`, renvoi expert-comptable.
- **Besoin de souplesse statutaire** — gouvernance sur-mesure, organes ad hoc, liberté des règles de cession : la SAS offre la plus grande liberté ; la SARL est plus encadrée (agrément légal des cessions à tiers, régime impératif de révocation du gérant) ; la SA est la plus formelle.
- **Capital disponible** — la SA impose un capital minimum de 37 000 € `[à vérifier]` ; SAS et SARL n'ont pas de plancher légal.
- **Apports en industrie** — un associé n'apportant que son savoir-faire/travail oriente hors de la SA (apport en industrie interdit en SA, art. L.225-3 C.com.).

Ne pas trancher tant que ces points ne sont pas couverts ou explicitement écartés.

---

## Étape 2 (--comparer) — Recommandation

1. Construire la **table comparative** depuis `${CLAUDE_SKILL_DIR}/../../references/comparatif-formes-sociales-fr.md`
   (Partie 1), restreinte aux axes pertinents pour le besoin cadré. Tags de
   provenance après chaque citation, **sans backticks dans les cellules**.
2. Formuler une **recommandation motivée** : une forme privilégiée, les formes
   écartées et **pourquoi**. La motivation s'appuie sur les axes décisifs du
   dossier (cession de titres, régime social, souplesse, capital, levée).
3. Taguer `[review]` les arbitrages qui dépendent de **critères fiscaux ou
   sociaux** : choix IS/IR, régime social effectif du dirigeant, optimisation
   de rémunération. Renvoi explicite à l'**expert-comptable** — ce skill ne
   donne pas de conseil fiscal détaillé.
4. Rappeler que la recommandation de forme est un **point de départ** : la
   rédaction des statuts (mode `--draft`) reste à faire et à valider.

---

## Étape 1 (--draft) — Détection bifurcation actes

**Étape juridique active, pas une simple mention.** Avant toute rédaction,
analyser la **nature des apports déclarés** (intake point 4) et trancher la
forme de l'acte. Logique tirée de `${CLAUDE_SKILL_DIR}/../../references/comparatif-formes-sociales-fr.md`
(Partie 2) :

1. **Apports en numéraire uniquement** → acte **sous seing privé (SSP)** suffit.
   Pas de commissaire aux apports.

2. **Apport en nature d'un immeuble** — terrain, local, bâtiment, droit réel
   immobilier, **ou fonds de commerce comprenant un immeuble** → signaler
   🔴 **« acte notarié obligatoire »**. Motif à exposer (le *pourquoi*, pas
   seulement la règle) : la mutation d'un droit réel immobilier doit, pour être
   **opposable aux tiers**, être **publiée au service de la publicité foncière** ;
   or la publicité foncière n'accepte que des **actes authentiques**. Un apport
   d'immeuble par simple SSP serait impubliable, donc inopposable. La forme de
   l'acte n'est alors **pas un arbitrage** : elle est imposée. Renvoyer au
   **notaire partenaire** configuré (bloc « vie sociale »).

3. **Apport en nature de biens meubles** — matériel, stock, créances, droit de
   PI mobilier, fonds de commerce **sans immeuble** → acte **SSP suffit** quant
   à la forme.

4. **Tout apport en nature** (meuble ou immeuble) → signaler la règle du
   **commissaire aux apports** :
   - **désignation de principe** pour évaluer chaque apport (SARL : art. L.223-9
     C.com., désignation à l'unanimité ou par justice ; régime
     étendu à la SAS `[à vérifier]` ; SA : régime distinct `[à vérifier]`) ;
   - **dispense possible** sous **deux conditions cumulatives** : décision
     **unanime** des associés **et** respect d'un **double seuil réglementaire**
     (montant unitaire de l'apport / fraction du capital). Les **seuils chiffrés**
     sont **réglementaires** (`R.xxx`, hors index) et évoluent → `[à vérifier]`,
     renvoi au décret en vigueur ;
   - **la dispense ne supprime pas la responsabilité** : les associés restent
     **solidairement responsables, 5 ans, de la valeur attribuée** aux apports
     en nature `[à vérifier]`. À expliciter systématiquement au client.

5. **Apport en industrie** — signaler qu'il est **interdit en SA** (art. L.225-3
   C.com.) ; possible en SAS et SARL (art. L.223-7 al. 2 C.com.
   pour la SARL) ; il ne concourt pas à la formation du capital.

Le résultat de cette étape conditionne le brouillon et figure en tête de la
**liste des points à arbitrer**.

---

## Étape 2 (--draft) — Brouillon assisté de statuts

Produire un **projet de statuts structuré**, adapté à la forme. **Brouillon
assisté** : chaque clause appelant un arbitrage juridique est taguée `[review]`
en ligne, et le livrable ne se présente **jamais** comme « prêt à déposer ».

**Socle commun — mentions obligatoires de l'art. L.210-2 C.com.** —
toute société commerciale, quelle que soit sa forme, doit faire figurer dans ses
statuts :

- la **forme** de la société ;
- la **durée** (99 ans maximum — art. L.210-2 C.com.) `[review]` ;
- la **dénomination sociale** `[review]` (vérifier la disponibilité auprès de l'INPI — hors périmètre du skill) ;
- le **siège social** `[review]` ;
- l'**objet social** `[review]` (à calibrer : ni trop étroit, ni purement formel) ;
- le **montant du capital social** `[review]`.

**Clauses appelant un arbitrage — tag `[review]` systématique :**

- **Forme et montant du capital** — montant retenu, division en actions/parts,
  modalités de **libération** (numéraire : libération partielle possible, solde
  dans le délai légal ; apports en nature : libération intégrale) `[review]`.
- **Apports** — description et évaluation de chaque apport ; traitement du
  commissaire aux apports / dispense (issu de l'Étape 1) `[review]`.
- **Clause d'agrément** — en SAS, agrément seulement si clause statutaire
  (art. L.227-14 C.com., adoption à l'unanimité, violation →
  nullité art. L.227-15 C.com.) ; en SARL, agrément des cessions
  à tiers **légal et obligatoire** (art. L.223-14 C.com.) ; en SA,
  agrément possible par clause statutaire (art. L.228-23 C.com. `[à vérifier]`,
  procédure L.228-24 C.com.) `[review]`.
- **Règles de quorum et de majorité** des décisions collectives — SAS : grande
  liberté statutaire (art. L.227-9 C.com.) ; SARL : majorités
  légales (art. L.223-30 C.com. pour les modifications
  statutaires) ; SA : quorum et majorité d'AGO (art. L.225-98 C.com.)
  et d'AGE (art. L.225-96 C.com. `[à vérifier]`) `[review]`.
- **Modalités de direction** — président de SAS et organes complémentaires
  éventuels ; gérant(s) de SARL ; conseil d'administration ou directoire en SA ;
  étendue des pouvoirs, durée du mandat, révocation `[review]`.
- **Clause d'inaliénabilité éventuelle** — en SAS, l'inaliénabilité statutaire
  est **plafonnée à 10 ans** (art. L.227-13 C.com.) : une durée
  supérieure est nulle ou réductible `[review]`.
- **Choix SSP vs notarié** — reporter ici la conclusion de l'Étape 1 ; si un
  immeuble figure aux apports, le choix est **imposé** (notarié), non arbitré.

**Règle de présentation — non négociable.** Le brouillon est annoncé comme un
**projet de travail** : ni « statuts prêts à déposer », ni « prêts à signer »,
ni « définitifs ». Une phrase d'en-tête le rappelle. Chaque `[review]` signale
un arbitrage que l'avocat (et le notaire si acte authentique) doit trancher.

---

## Étape 3 (--draft) — Post-flight

Appel automatique de `verifier-citations` sur la sortie complète (mode défaut
`articles`). Le skill :

- extrait toutes les citations (art. L.NNN-N C.com., art. NNN C.civ) ;
- vérifie l'existence et la version en vigueur via Légifrance ;
- annote : `[Légifrance ✓]`, `[abrogé]`, ou `[à vérifier]` en mode dégradé.

Articles attendus présents dans `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md` avec
identifiant Légifrance réel (→ à lire via `legifrance_get_article` ; `[Légifrance ✓]` seulement après lecture dans la session, sinon `[à vérifier]`) : L.210-2, L.210-6, L.223-2,
L.223-7, L.223-9, L.223-14, L.223-30, L.225-3, L.225-98, L.227-9, L.227-13,
L.227-14, L.227-15, L.228-24. En `[a compléter]` ou absents (→ `[à vérifier]`
obligatoire) : L.223-1, L.225-1, L.225-96, L.227-1, L.228-23, et **tout article
réglementaire `R.xxx`** (seuils commissaire aux apports).

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur
(« `verifier-citations` non exécuté — N citations à valider manuellement contre
Légifrance »).

---

## Ce skill ne fait pas

- Le **dépôt au greffe**, l'immatriculation au RCS, les formalités de publicité
  (acte des fondateurs / du conseil).
- La **réception de l'acte authentique** lorsqu'un apport d'immeuble l'exige —
  acte du **notaire** ; le skill détecte la bifurcation et renvoie, il ne se
  substitue pas au notaire.
- L'**évaluation** d'un apport en nature — c'est l'office du commissaire aux
  apports ; le skill signale la règle, il ne valorise pas le bien.
- La rédaction d'un **pacte d'associés** → renvoyer vers `pacte-associes-review`
  (revue de pacte, v1.1).
- Le **conseil fiscal** (choix IS/IR, régime social et fiscal du dirigeant,
  optimisation de rémunération) → renvoi expert-comptable, signalement uniquement.
- La rédaction de statuts de **formes hors SAS/SARL/SA** (SNC, SCI, SCOP,
  associations) — hors périmètre v1.1.
- La **modification statutaire** d'une société existante (transfert de siège,
  changement d'objet, augmentation de capital) — hors périmètre.
- La vérification de **disponibilité de la dénomination** auprès de l'INPI et du
  RCS — à mener par le cabinet.

---

## Ton

Technique, structuré, prudent. La constitution est l'acte fondateur : une erreur
de forme sociale, de capital ou de clause se paie longtemps. Le mode `--comparer`
recommande et motive sans trancher les arbitrages fiscaux/sociaux (renvoi
expert-comptable). Le mode `--draft` produit un **brouillon assisté** — jamais
des statuts « prêts à déposer » — où chaque point de décision est tagué `[review]`.
Signaler sans détour la **bifurcation acte notarié** dès qu'un immeuble figure
aux apports : ce n'est pas une option mais une condition de régularité. Rappeler
que la dispense de commissaire aux apports n'efface pas la responsabilité des
associés sur la valeur retenue. Toute sortie est un brouillon soumis à validation
avocat — et notaire lorsqu'un acte authentique est requis — avant signature ou
dépôt.
