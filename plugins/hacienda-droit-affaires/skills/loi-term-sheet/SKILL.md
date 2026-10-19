---
name: loi-term-sheet
description: >
  Revue ou rédaction de lettre d'intention / LOI / term sheet M&A. Distingue
  les clauses binding des clauses non-binding, vérifie exclusivité,
  confidentialité, bonne foi des pourparlers (1104, 1112 C.civ), conditions
  suspensives esquissées et calendrier. Mode --review et --draft. Brouillon
  soumis à validation humaine (avocat).
version: "2.0.0"
argument-hint: "[--review ou --draft, NBO/LOI/term sheet, side]"
authors: ["Hacienda"]
tags: [loi, term-sheet, lettre-intention, ma, pourparlers, binding]
---

# Skill — LOI / Term sheet

> **BROUILLON DE TRAVAIL, PAS AVIS JURIDIQUE.**
>
> Revue ou rédaction d'une lettre d'intention (LOI), d'un term sheet ou d'une
> head of terms d'opération M&A. Toute sortie doit être validée par un avocat
> avant transmission, signature ou ouverture de négociation formelle.
>
> **Le piège central de ces documents est la confusion binding / non-binding.**
> Une LOI ou un term sheet se présente presque toujours comme « non engageant »,
> mais comporte presque toujours, en réalité, des clauses qui engagent
> juridiquement. Une clause mal qualifiée peut lier une partie qui se croyait
> libre. La qualification d'une stipulation ne dépend **pas du titre du
> document** ni d'une mention générale « sans engagement » : elle dépend du
> contenu de la clause et de l'intention réelle des parties. C'est le cœur de
> ce skill.

---

## Examples

<example>
<user>/h-da:loi-term-sheet ./LOI-cible-X.pdf --review --side=acquereur</user>
<response>
1. Lecture profil cabinet (bloc M&A / Corporate : side habituel acquéreur, taille de deals, matrice d'approbateurs)
2. Identification : LOI intitulée « non contraignante », opération de cession de titres, droit français, side utilisateur = acquéreur
3. Cartographie binding / non-binding clause par clause — détection de 3 clauses binding malgré le chapeau « sans engagement » : exclusivité (12 mois), confidentialité, prise en charge des frais par le cédant
4. Finding 🔴 — l'exclusivité et la clause de frais engagent juridiquement le cédant alors que le document se présente comme non contraignant : qualification non intentionnelle probable, à clarifier par une clause de binding/non-binding explicite
5. Analyse des clauses sensibles : durée d'exclusivité 12 mois jugée excessive 🟠 ; bonne foi des pourparlers (1104 C.civ) et risque de rupture abusive (1112 C.civ `[à vérifier]`)
6. Liste de points triée par criticité (🔴 → 🟢) via skill `liste-de-points`
7. Post-flight `verifier-citations` sur la sortie
8. Sortie : en-tête confidentialité + note du relecteur (5 champs) + résumé exécutif + tableau binding / non-binding + liste de points + recommandation + question hors checklist + arbre de décision 5 options
</response>
</example>

<example>
<user>/h-da:loi-term-sheet ./term-sheet-acquisition.pdf --review</user>
<response>
Identification : term sheet d'acquisition, clause d'exclusivité de 18 mois.
Finding 🟠 — clause d'exclusivité :
- L'exclusivité (ou « no-shop ») est une clause typiquement binding, même dans un term sheet présenté comme non engageant : elle interdit au cédant de négocier avec des tiers pendant sa durée.
- Une durée de 18 mois est excessive au regard de la pratique : l'exclusivité doit couvrir le temps raisonnablement nécessaire à la due diligence et à la négociation du SPA, généralement quelques semaines à quelques mois selon la taille du deal. 18 mois immobilise le cédant bien au-delà du besoin et expose à un déséquilibre `[review]`.
- Vérifier en outre que l'exclusivité est assortie d'une date de fin certaine, d'un périmètre défini (titres / actifs visés) et, le cas échéant, d'une faculté de sortie si l'acquéreur n'avance pas de bonne foi.
Recommandation : ramener la durée à une valeur proportionnée (souvent 6 à 12 semaines, prorogeable une fois) et borner le périmètre. Sortie complète avec tableau binding / non-binding et liste de points.
</response>
</example>

<example>
<user>/h-da:loi-term-sheet --draft --side=acquereur</user>
<response>
Mode `--draft`, side acquéreur. Intake : contexte du deal (taille, calendrier visé), périmètre de l'opération, points déjà arbitrés.
Le skill produit un projet de LOI structuré avec, pour chaque clause, sa qualification binding / non-binding **explicite** :
- Clauses non-binding (indicatives) : prix indicatif et fourchette de valorisation, structure envisagée, conditions suspensives esquissées, calendrier prévisionnel.
- Clauses binding (engageantes) : exclusivité bornée, confidentialité, sort des frais, bonne foi des pourparlers, droit applicable et juridiction.
- Une clause de qualification dédiée énonce sans ambiguïté quelles stipulations engagent et lesquelles n'engagent pas, pour éviter le piège de la qualification implicite.
Sortie : brouillon de LOI + note du relecteur + tableau binding / non-binding + recommandation + arbre de décision 5 options. Brouillon soumis à validation humaine (avocat).
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md` :
> - **Posture contractuelle** — protecteur / équilibré / facilitateur (bloc « contrats commerciaux »)
> - **Side habituel M&A** — cédant / acquéreur / conseil des deux (bloc « M&A / Corporate »)
> - **Taille de deals typique et posture DD** — pour calibrer le calendrier et l'exclusivité (bloc « M&A / Corporate »)
> - **Matrice d'approbateurs** — par type d'acte (bloc « M&A / Corporate » ; la signature d'un SPA y figure ; une LOI engageante s'escalade de préférence au même approbateur)

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : stopper et
demander `/h-da:entretien-demarrage` avant toute revue ou
rédaction substantielle. Voir aussi `~/.claude/plugins/config/hacienda-juridique/company-profile.md` pour
les éléments cabinet partagés cross-plugins.

---

## Intake

1. **Mode** — `--review` (analyser une LOI / term sheet existant) | `--draft` (rédiger un projet)
2. **Fichier** — chemin du PDF / DOCX / Markdown (requis si `--review`)
3. **Side** — `--side=acquereur` | `--side=cedant` (auto-détecté en `--review` si non précisé ; détermine la posture appliquée)
4. **Contexte du deal** — taille de l'opération, calendrier visé (signing / closing envisagés), périmètre (cession de titres / d'actifs). En `--draft`, ces éléments sont demandés à l'utilisateur ; en `--review`, ils sont extraits du document et complétés au besoin.

---

## Gate non-juriste

- [ ] Document correctement identifié (LOI / term sheet / head of terms) et side de l'utilisateur déterminé
- [ ] Profil cabinet lu et posture applicable identifiée
- [ ] Cartographie binding / non-binding réalisée clause par clause
- [ ] Qualification fondée sur le contenu des clauses, pas sur le titre du document ni sur le chapeau « sans engagement »
- [ ] Toute clause binding non intentionnelle signalée 🔴
- [ ] Liberté de rompre les pourparlers (1112 C.civ) et faute dans la rupture (bonne foi, 1104 C.civ) correctement distinguées
- [ ] Articles hors index ou en `[a compléter]` (1112, 1123, 1124 C.civ) tagués `[à vérifier]`
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur (5 champs) + résumé exécutif + tableau binding / non-binding + liste de points + recommandation + question hors checklist + arbre de décision 5 options

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Points sociaux de due diligence : `boss_recherche`, `boss_get_document`. Points fiscaux : `bofip_rechercher` / `bofip_consulter` ne donnent que des circulaires ministérielles (fonds CIRC), **pas la base BOFiP-Impôts** — toute doctrine fiscale reste `[à vérifier]` sur bofip.impots.gouv.fr, sans tag `[BOFiP]`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/loi-term-sheet-<parties-slug>-YYYY-MM-DD.md
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

# Résumé exécutif

{Trois phrases pour acquéreur / cédant / DG / sponsor. Pas de jargon. Une ligne
de bottom-line : signer la LOI en l'état / négocier sur N points / ne pas
signer. Une ligne de risque dominant — typiquement le risque d'engagement non
intentionnel. Une ligne de prochaine action attendue.}

# Tableau binding / non-binding

| # | Clause | Qualification | Intentionnel ? | Sévérité |
|---|---|---|---|---|
| ... | ... | Binding / Non-binding | Oui / Non / À clarifier | 🔴/🟠/🟡/🟢 |

{Une ligne par clause du document. La colonne « Intentionnel ? » indique si la
qualification binding correspond manifestement à la volonté affichée du
document. Toute clause binding non intentionnelle est en 🔴.}

# Liste de points

| # | Clause | Statut | Risque | Position souhaitée | Formulation proposée |
|---|---|---|---|---|---|
| ... | ... | 🔴/🟠/🟡/🟢 | ... | ... | ... |

# Recommandation

{Signer la LOI / Négocier / Ne pas signer} — justification 2-3 lignes liée à la
posture configurée et aux points 🔴 / 🟠, en particulier les engagements
binding non intentionnels.

# Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait. Omettre la ligne
si rien d'honnête à dire — ne pas fabriquer.}

# Que veux-tu faire ? Choisis une option :

1. **Rédiger** — je produis un projet de LOI / term sheet révisé (ou un courrier de négociation) reprenant le tableau binding / non-binding et la liste de points priorisée.
2. **Escalader** — je rédige une note d'escalade vers {approbateur configuré} avec faits-clés, risque dominant et décision attendue.
3. **Compléter les faits** — questions ouvertes à poser à {PM / client / contrepartie / conseil} avant d'avancer.
4. **Surveiller et attendre** — j'ajoute le sujet au tracker du dossier avec note motivée et date de revisite.
5. **Autre** — précise ce que tu veux en faire.
```

### Mode silencieux (livrable externe)

Si l'utilisateur précise que la sortie est destinée à une contrepartie ou à un destinataire non-juriste :
- Conserver l'en-tête de confidentialité (s'il protège le document) et la note du relecteur.
- Retirer la narration de skill et les renvois inter-commandes (les placer dans un message séparé).
- Le livrable doit se lire comme s'il avait été rédigé par un associé.

---

## Étape 1 — Identification

1. Lire le profil cabinet (CLAUDE.md droit-affaires) et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`. Identifier la posture contractuelle et le side habituel M&A.
2. Identifier le document : LOI / lettre d'intention / term sheet / head of terms ; les parties (cédant, acquéreur, qualité, pays d'établissement) ; le périmètre de l'opération ; le droit applicable annoncé ; le side de l'utilisateur.
3. Repérer la **mention générale d'engagement** du document (« sans engagement », « non contraignant », « subject to contract », « binding / non-binding »). Cette mention oriente la lecture mais **ne tranche pas** la qualification clause par clause : elle est consignée, puis confrontée au contenu réel à l'étape 2.

---

## Étape 2 — Cartographie binding / non-binding

C'est l'étape centrale du skill. Passer en revue **chaque clause** du document et la classer :

- **Non-binding (indicative)** — n'engage pas juridiquement les parties ; exprime une intention, une fourchette ou une orientation appelée à être renégociée et figée dans le contrat définitif (SPA, acte de cession).
- **Binding (engageante)** — engage juridiquement la partie concernée dès la signature de la LOI / du term sheet, indépendamment de la conclusion du contrat définitif.

**Point juridique clé.** Sont **typiquement binding même dans une LOI ou un term sheet présenté comme « non engageant »** :

- la clause d'**exclusivité** (no-shop / no-talk) — elle interdit effectivement de négocier avec des tiers ;
- la clause de **confidentialité** — elle protège les informations échangées et survit à l'échec des pourparlers ;
- le **sort des frais** (qui paie les conseils, la due diligence, les frais de rupture / break-up fee) ;
- la **loi applicable et la juridiction / clause d'arbitrage** ;
- l'engagement de **bonne foi** dans la conduite des négociations.

À l'inverse, sont **typiquement non-binding** : le prix indicatif et la fourchette de valorisation, la structure envisagée de l'opération, les conditions suspensives seulement esquissées, le calendrier prévisionnel, les déclarations et garanties annoncées pour le futur SPA.

**Règle de qualification.** La qualification d'une clause **ne dépend pas du titre du document** ni d'un chapeau général « sans engagement ». Elle dépend du **contenu de la stipulation** et de l'**intention réelle des parties**. Une clause d'exclusivité rédigée en termes impératifs (« le cédant s'interdit de… ») engage le cédant, quand bien même la LOI s'intitulerait « non contraignante » : la mention générale ne neutralise pas une obligation précise et impérative. À l'inverse, une clause expressément qualifiée de non-binding et rédigée comme une simple orientation n'engage pas.

**Signalement.** Marquer 🔴 toute clause **binding non intentionnelle** — c'est-à-dire toute clause qui engage juridiquement une partie alors que le document, par son titre ou son chapeau, laisse croire qu'aucun engagement n'est pris, sans clause de qualification claire pour lever l'ambiguïté. C'est le piège classique : une LOI « non engageante » qui contient en réalité une exclusivité ferme et une prise en charge des frais.

Le remède recommandé est une **clause de qualification dédiée** (binding / non-binding clause) énumérant sans ambiguïté les stipulations qui engagent et celles qui n'engagent pas. Son absence est elle-même un défaut rédactionnel à signaler.

---

## Étape 3 — Analyse des clauses sensibles

Pour chaque clause sensible, produire une analyse de fond. Réutiliser
`${CLAUDE_SKILL_DIR}/../../references/clauses-sensibles-fr.md` pour les clauses communes (notamment
**confidentialité** — bloc 11 ; **droit applicable et juridiction** — bloc 10 ;
**changement de contrôle** — bloc 15) : s'y référer pour la matrice de risque
et les formulations alternatives selon la posture, **sans recopier** la
référence. Pour l'**exclusivité**, ne pas utiliser le bloc 3 de
`clauses-sensibles-fr.md` : ce bloc traite l'exclusivité en contexte de
distribution commerciale (droit de la concurrence, art. L.420-1 C.com.),
contexte distinct de l'exclusivité « no-shop » d'une LOI M&A. La qualification
de la clause no-shop est traitée directement à l'Étape 2 du présent skill
(cartographie binding / non-binding) ; les critères de proportionnalité sont
développés au §Exclusivité ci-dessous.

Points de fond propres à la LOI / au term sheet :

- **Exclusivité (no-shop).** Vérifier durée, périmètre (titres / actifs visés, parties tenues), point de départ et date de fin certaine, faculté de sortie si la contrepartie n'avance pas de bonne foi. Une durée doit couvrir le temps raisonnablement nécessaire à la due diligence et à la négociation du SPA — quelques semaines à quelques mois selon la taille du deal. Une exclusivité de 12 mois ou plus est, dans la pratique courante, **excessive** et immobilise le cédant au-delà du besoin → `[review]` sur l'appréciation de proportionnalité. **Règle de proportionnalité par rapport au calendrier.** Rapprocher la durée d'exclusivité du calendrier prévisionnel du deal : si l'exclusivité excède significativement le temps réellement nécessaire aux étapes annoncées (due diligence, négociation du SPA), signaler le déséquilibre — l'exclusivité immobilise le cédant et doit rester proportionnée au besoin `[review]`.
- **Confidentialité.** Définition utile des informations protégées, exceptions standard, durée proportionnée, sort des informations en cas d'échec des pourparlers (restitution / destruction). Renvoi `${CLAUDE_SKILL_DIR}/../../references/clauses-sensibles-fr.md` bloc 11. Si le dossier est PI-centric ou R&D, orienter vers un spécialiste PI (hors périmètre de ce plugin).
- **Bonne foi des pourparlers et rupture des négociations.** Deux principes à **ne pas confondre** :
  1. La **liberté de rompre les pourparlers** est le principe. Une partie peut, en principe, mettre fin aux négociations précontractuelles sans avoir à se justifier (art. 1112 C.civ — absent de l'index avec un identifiant Légifrance réel → `[à vérifier]`).
  2. Mais l'**initiative, le déroulement et la rupture** des pourparlers doivent respecter les exigences de la **bonne foi** (art. 1104 C.civ). La rupture peut donc être **fautive** lorsqu'elle est abusive — par exemple rupture brutale après avoir entretenu artificiellement la croyance en la conclusion du contrat. La faute n'est pas la rupture elle-même mais les **circonstances** qui l'entachent. En cas de rupture fautive, la réparation ne peut pas compenser la perte des avantages attendus du contrat non conclu ni la perte de chance de les obtenir (art. 1112 al. 2 C.civ `[à vérifier]`) : elle couvre les frais engagés et l'atteinte à des intérêts distincts.
- **Devoir précontractuel d'information.** Celui des contractants qui connaît une information dont l'importance est déterminante pour le consentement de l'autre doit l'en informer dès lors que, légitimement, ce dernier ignore cette information ou fait confiance à son cocontractant (art. 1112-1 C.civ). Ce devoir ne porte pas sur l'estimation de la valeur de la prestation. Pertinent dès le stade de la LOI, notamment côté cédant sur la cible.
- **Conditions suspensives esquissées.** En LOI / term sheet, les conditions suspensives (obtention de financement, autorisations réglementaires / concurrence, résultat satisfaisant de la due diligence, accord des organes sociaux) sont en règle générale seulement **annoncées** et non-binding : elles seront figées dans le SPA. Vérifier qu'aucune n'est rédigée en termes impératifs qui la rendraient prématurément contraignante, et signaler les conditions potestatives (dépendant de la seule volonté d'une partie).
- **Calendrier.** Le calendrier prévisionnel (étapes de DD, signing, closing) est en principe non-binding. Vérifier qu'il n'est pas rédigé comme une obligation de résultat datée et qu'il est cohérent avec la durée d'exclusivité.
- **Sort des frais.** Qui supporte les frais de conseils, de due diligence, et le cas échéant une break-up fee. Cette clause est **typiquement binding**. Une prise en charge des frais par une seule partie, insérée dans un document présenté comme non engageant, engage pourtant cette partie → à signaler comme clause binding, et à examiner sous l'angle de l'équilibre.

**Règles d'analyse :**

- Les articles cités doivent exister dans `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md`. Présents avec un identifiant Légifrance réel (citables `[Légifrance ✓]` seulement après lecture dans la session, sinon `[à vérifier]`) : **1104** (bonne foi), **1112-1** (devoir précontractuel d'information). En `[a compléter]` dans l'index → tag `[à vérifier]` obligatoire : **1112** (liberté de rompre les pourparlers), **1123** (pacte de préférence), **1124** (promesse unilatérale). Vérifier chaque article dans l'index avant de le taguer.
- Tag de provenance placé **après** la citation, **sans backticks** dans les cellules de tableau (backticks admis dans le corps narratif).
- Les arrêts cités sont tagués `[Judilibre]` si consultés en session, sinon `[connaissance modèle — à vérifier]` ou `[à vérifier]`. Pas de fausse jurisprudence.
- Tag inline `[review]` sur les jugements subjectifs : caractère proportionné ou excessif d'une durée d'exclusivité, caractère intentionnel ou non d'une qualification binding, caractère abusif d'une rupture de pourparlers, caractère potestatif d'une condition suspensive.
- Respecter le plancher de sévérité cross-skill : si `verifier-citations` remonte 🔴, ne pas dégrader silencieusement.

---

## Étape 4 — Liste de points

Appel interne au skill `liste-de-points` pour produire un tableau consolidé, trié par criticité décroissante (🔴 → 🟠 → 🟡 → 🟢) :

```
| # | Clause | Statut | Risque | Position souhaitée | Formulation proposée |
|---|---|---|---|---|---|
```

La liste de points est l'artefact central transmis à la contrepartie ou à l'équipe de négociation. Une ligne par clause. Pas de doublon. Tri stable par numéro de clause à criticité égale.

Si le document n'a aucun écart par rapport au playbook : retourner une liste vide explicite — `Aucun point de vigilance identifié contre le playbook configuré. Lecture intégrale sans alerte.` — et ne pas fabriquer de findings de remplissage.

En mode `--draft`, la liste de points recense les arbitrages laissés ouverts dans le projet de LOI (durée d'exclusivité à confirmer, périmètre, montant de la break-up fee, conditions suspensives à figer dans le SPA).

---

## Étape 5 — Post-flight

Appel automatique de `verifier-citations` sur la sortie complète, mode défaut (`articles` + `jurisprudence`). Le skill :

- Extrait toutes les citations (art. NNN C.civ, L.NNN-N C.com., arrêts Cass.).
- Vérifie l'existence et la version en vigueur via Légifrance / Judilibre.
- Annote la sortie : `[Légifrance ✓]`, `[Judilibre ✓]`, `[abrogé]`, ou `[à vérifier]` en mode dégradé.

Si une citation `[abrogé]` est remontée → ligne dédiée dans la note du relecteur en 🔴 avec le remplacement applicable.

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur (« `verifier-citations` non exécuté — N citations à valider manuellement contre Légifrance »).

---

## Ce skill ne fait pas

- Signer ou exécuter la LOI / le term sheet (acte des parties).
- Réviser ou rédiger le contrat définitif (SPA, acte de cession) → `reviser-contrat` (v1) pour le tronc commercial, ou skill SPA dédié.
- Faire le focus GAP M&A → renvoyer `gap-review` (v1).
- Revoir le volet PI d'une opération PI-centric → hors périmètre : orienter vers un spécialiste PI.
- Réviser un pacte d'associés → renvoyer `pacte-associes-review`.
- Donner un avis fiscal détaillé sur la structuration du deal (droits d'enregistrement, régime des plus-values) — signalement uniquement.
- Donner un avis concurrence complet sur le contrôle des concentrations — signalement uniquement.

---

## Ton

Technique, structuré, factuel. Identifier clairement le side de l'utilisateur
(acquéreur / cédant) et appliquer la posture correspondante. Signaler
systématiquement le risque majeur de ces documents : l'engagement juridique non
intentionnel résultant d'une clause binding insérée dans un document présenté
comme non contraignant. Ne jamais laisser entendre qu'une mention générale
« sans engagement » suffit à neutraliser une clause d'exclusivité, de
confidentialité ou de prise en charge des frais. Ne pas confondre la liberté de
principe de rompre les pourparlers et la faute qui peut entacher la rupture.
Rappeler que la sortie est un brouillon soumis à validation humaine (avocat) avant toute
transmission, signature ou ouverture de négociation formelle.
