---
name: cgv-generator
description: >
  Génère des CGV (B2B, Code de commerce) ou des CGU/CGV (B2C, Code de la
  consommation) sous forme de brouillon assisté : chaque clause appelant un
  arbitrage est taguée [review]. Détecte le régime à l'intake et applique le
  cadre correspondant. Ne produit jamais un document prêt à publier. Brouillon
  soumis à validation humaine (avocat).
version: "2.0.0"
argument-hint: "[B2B/B2C, secteur, canal, clauses à générer ou réviser]"
authors: ["Hacienda"]
tags: [cgv, cgu, generation, b2b, b2c, code-consommation, l441-1]
---

# Skill — Générateur de CGV / CGU

> **BROUILLON ASSISTÉ — validation humaine (avocat) IMPÉRATIVE — JAMAIS « PRÊT À PUBLIER ».**
>
> Ce skill assiste la rédaction d'**actes juridiques** — des conditions
> générales de vente ou d'utilisation. Le mode `--draft` produit un **brouillon
> assisté** : chaque clause appelant un arbitrage juridique est taguée
> `[review]` et la **liste des points à arbitrer** est explicitée. Le livrable
> ne se présente **JAMAIS** comme un document « prêt à publier », « finalisé »,
> « à signer » ou « définitif ».
>
> Ce skill applique **deux régimes distincts** : les **CGV B2B** relèvent du
> **Code de commerce**, les **CGU/CGV B2C** relèvent du **Code de la
> consommation**, d'ordre public protecteur. **Appliquer le mauvais régime à un
> public donné est une faute** : un délai de paiement à 90 jours en B2B, une
> clause de liste noire R.212-1 en B2C, une rétractation insérée à tort dans des
> CGV B2B — autant d'erreurs que ce skill doit prévenir. Le régime est détecté
> ou **explicitement demandé** à l'intake.
>
> Des CGV mal rédigées exposent à l'amende administrative (délais de paiement),
> à la nullité de clauses (clauses abusives), et engagent le professionnel face
> à ses clients pour la durée de leur diffusion. Toute sortie de ce skill doit
> être **validée par un avocat** avant publication.
>
> Ce disclaimer est un **plancher de responsabilité, pas un contrôle qualité** :
> il ne dispense ni de la relecture humaine, ni de la vérification des sources,
> ni du contrôle du régime applicable.

---

## Examples

<example>
<user>/h-da:cgv-generator --draft --regime=B2B</user>
<response>
1. Lecture profil cabinet (bloc « contrats commerciaux » : posture par défaut, clauses jamais acceptées, matrice d'approbateurs).
2. Intake : régime **B2B**, société de prestation de services informatiques vendant à des clients professionnels, canal sans objet (B2B).
3. Étape 1 — confirmation du régime : B2B → cadre Code de commerce.
4. Étape 2 — brouillon de CGV B2B selon `${CLAUDE_SKILL_DIR}/../../references/regimes-cgv-cgu-fr.md` partie B2B : mentions obligatoires art. L.441-1 C.com. [à vérifier] (conditions de règlement, barème de prix unitaires, réductions de prix). **Chaque arbitrage tagué `[review]`** : conditions de règlement, barème de prix, clause de réserve de propriété, limitation de responsabilité, droit applicable. Vérification du plafond de paiement L.441-10 C.com. [à vérifier] (60 j / 45 j fin de mois).
5. Étape 4 — post-flight `verifier-citations`.
6. Sortie : note du relecteur + brouillon de CGV `[review]`-tagué + **liste explicite des points à arbitrer** — le livrable est présenté comme un brouillon de travail, jamais comme « prêt à publier ».
</response>
</example>

<example>
<user>/h-da:cgv-generator --draft --regime=B2C — vente à distance de cosmétiques</user>
<response>
1. Lecture profil cabinet.
2. Intake : régime **B2C**, vente de cosmétiques, **canal = vente à distance** (site e-commerce).
3. Étape 1 — confirmation du régime + canal : B2C, vente à distance → la rétractation L.221-18 C.conso [à vérifier] s'applique.
4. Étape 3 — brouillon de CGU/CGV B2C selon la partie B2C : information précontractuelle art. L.111-1 C.conso [à vérifier], droit de rétractation **14 jours** art. L.221-18 C.conso [à vérifier] + formulaire type, garantie légale de conformité art. L.217-3 et s. C.conso [à vérifier], médiation de la consommation. **Contrôle : aucune clause de liste noire R.212-1 [à vérifier]** ; les clauses de liste grise R.212-2 [à vérifier] taguées `[review]`. Signalement : certains cosmétiques descellés peuvent relever d'une exception de rétractation pour raison d'hygiène (art. L.221-28 C.conso [à vérifier]) → `[review]`.
5. Étape 4 — post-flight `verifier-citations` (articles C.conso hors index → `[à vérifier]`).
6. Sortie : note du relecteur + brouillon de CGU/CGV `[review]`-tagué + liste des points à arbitrer — brouillon, jamais « prêt à publier ».
</response>
</example>

<example>
<user>/h-da:cgv-generator --draft — un éditeur de logiciel vend en SaaS à des entreprises ET à des particuliers</user>
<response>
Intake : le régime n'est pas précisé et l'activité s'adresse aux **deux publics**.
Le skill ne suppose pas : il **demande explicitement** le régime, puis qualifie le besoin comme **mixte (B2B + B2C)**.
Étape 1 — détermination du régime : mixte. Conséquence exposée au client — deux corps de règles s'appliquent : soit **deux jeux de conditions distincts** (CGV B2B + CGU/CGV B2C), soit un jeu commun dont chaque clause satisfait le régime le plus exigeant (le B2C). Le skill recommande la séparation des jeux pour éviter qu'une clause valable en B2B ne contamine le jeu B2C.
Étapes 2 et 3 — le skill produit le brouillon B2B (Code de commerce : L.441-1, plafond L.441-10) **et** le brouillon B2C (Code de la consommation : information précontractuelle, rétractation L.221-18, garantie de conformité L.217-3 et s., contrôle liste noire R.212-1). Aucune clause n'est transposée d'un régime à l'autre sans vérification.
Sortie : deux brouillons `[review]`-tagués, présentés comme projets de travail.
</response>
</example>

<example>
<user>/h-da:cgv-generator --draft --regime=B2C — le client veut une clause « toute réclamation interdite passé 24h, le vendeur peut modifier le service à tout moment »</user>
<response>
Régime B2C → contrôle systématique des clauses abusives consuméristes.
La clause demandée combine deux stipulations relevant de la **liste noire** R.212-1 C.conso [à vérifier] :
- 🔴 **Modification unilatérale du service par le professionnel sans accord du consommateur** — clause irréfragablement présumée abusive (liste noire) : elle ne peut pas figurer dans le brouillon. Réputée non écrite par l'art. L.212-1 C.conso [à vérifier].
- 🔴 **Délai de réclamation de 24 h supprimant en pratique les garanties légales** — une clause réduisant ou supprimant les droits légaux du consommateur (garantie de conformité L.217-3 et s. C.conso [à vérifier], d'ordre public) relève également de la liste noire.
Le skill **refuse d'insérer** ces clauses, l'explique au client, et propose à la place des stipulations conformes : modification encadrée par l'accord du consommateur ou un préavis avec faculté de résiliation ; renvoi aux garanties légales d'ordre public. Le finding 🔴 est porté dans la note du relecteur et dans la liste des points à arbitrer.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`,
> bloc « contrats commerciaux » du §1 :
> - **Posture contractuelle par défaut** — protecteur / équilibré / facilitateur
>   (calibre le niveau de protection des clauses : pénalités, réserve de
>   propriété, limitation de responsabilité, garanties)
> - **Clauses « jamais acceptées »** — listées dans le bloc contrats commerciaux
>   (à ne pas insérer dans le brouillon)
> - **Positions clés** — clause pénale (1231-5 C.civ.), limitation de
>   responsabilité, droit applicable et juridiction
> - **Matrice d'approbateurs** — type d'acte → approbateur (escalade des
>   findings 🔴)
> - **Rôle de l'utilisateur courant** — conditionne l'en-tête de confidentialité
>   (avocat / notaire / juriste in-house / non-juriste)

Si le bloc « contrats commerciaux » est encore en `[A CONFIGURER]` : stopper et
demander `/h-da:entretien-demarrage`. Sans posture
contractuelle renseignée, le calibrage des clauses (pénalités, limitation de
responsabilité, garanties) ne peut pas être effectué. Voir aussi
`~/.claude/plugins/config/hacienda-juridique/company-profile.md` pour les éléments cabinet partagés.

---

## Intake

1. **Mode** — `--draft` (brouillon assisté de CGV / CGU). C'est le seul mode du
   skill. La revue d'une CGV/CGU **existante** relève du skill `reviser-contrat`
   — ne pas la traiter ici.
2. **Régime** — `--regime=B2B` (Code de commerce) | `--regime=B2C` (Code de la
   consommation) | `--regime=mixte` (les deux). **Obligatoire** : si le régime
   n'est pas précisé, **le DEMANDER explicitement**. Ne jamais le supposer — le
   régime commande le cadre juridique tout entier.
3. **Activité et nature des prestations / produits** — vente de biens,
   fourniture de services, contenu numérique, SaaS ; nature exacte des
   produits ou prestations.
4. **Canal de vente** — `présentiel` (en établissement) | `à distance`
   (e-commerce, vente hors établissement). **Détermine la rétractation en
   B2C** : le droit de rétractation L.221-18 C.conso ne s'applique qu'en vente
   à distance et hors établissement. À préciser obligatoirement dès que le
   régime est B2C ou mixte.
5. **Spécificités** (optionnel) — clauses souhaitées par le client, contraintes
   particulières (réserve de propriété, garantie commerciale, exclusivité,
   régime sectoriel de délais de paiement).

Si le mode est absent, l'assumer comme `--draft` (mode unique). Si le **régime**
est absent, **stopper et demander** — pas de valeur par défaut sur le régime.

---

## Gate non-juriste

- [ ] Mode `--draft` retenu (mode unique) ; revue d'une CGV existante renvoyée à `reviser-contrat`
- [ ] **Régime** détecté ou explicitement demandé (B2B / B2C / mixte) — jamais supposé
- [ ] Profil cabinet bloc « contrats commerciaux » lu (posture, clauses jamais acceptées, approbateurs)
- [ ] Si B2C ou mixte : canal de vente vérifié (présentiel vs à distance — détermine la rétractation)
- [ ] B2B : mentions obligatoires art. L.441-1 C.com. présentes (conditions de règlement, barème de prix unitaires, réductions de prix)
- [ ] B2B : plafond des délais de paiement art. L.441-10 C.com. respecté (60 j / 45 j fin de mois) — aucun délai hors plafond reproduit
- [ ] B2C : information précontractuelle, rétractation L.221-18 (14 jours) si vente à distance, garantie de conformité L.217-3 et s., médiation de la consommation présentes
- [ ] B2C : AUCUNE clause de liste noire R.212-1 dans le brouillon ; clauses de liste grise R.212-2 taguées `[review]`
- [ ] Chaque clause d'arbitrage taguée `[review]` ; liste des points à arbitrer explicite ; livrable NON présenté comme « prêt à publier »
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]` ; tous les articles du Code de la consommation en `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur (5 champs) + régime déterminé + brouillon(s) + points à arbitrer + question hors checklist + arbre de décision 5 options

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/cgv-<regime>-<activite-slug>-YYYY-MM-DD.md
```

Format date : `YYYY-MM-DD`. Pour le régime mixte, le skill peut produire deux
fichiers suffixés `-b2b` et `-b2c`.

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — voir les 4 variantes dans CLAUDE.md du plugin §2]

> **⚠️ Note du relecteur**
> - **Sources :** Légifrance ✓ / Judilibre ✓ (cocher ✗ si non connectée)
> - **Lecture :** intake fourni par l'utilisateur — {régime retenu (B2B / B2C / mixte), activité, canal de vente}
> - **Signalé pour ton jugement :** {N} éléments marqués [review] (conditions de règlement, barème de prix, réserve de propriété, limitation de responsabilité, rétractation, clauses liste grise, médiateur) | {N} findings 🔴 (clause liste noire R.212-1 refusée, délai de paiement hors plafond L.441-10) | aucun
> - **Fraîcheur :** articles du Code de la consommation (L.111-1, L.212-1, L.217-x, L.221-18, R.212-1, R.212-2) NON figés dans l'index — {N} articles [à vérifier] à confirmer sur Légifrance ; régime garantie de conformité refondu par l'ord. 2021-1247
> - **Avant de t'appuyer dessus :** {action concrète — ex. faire vérifier les articles C.conso sur Légifrance ; confirmer le médiateur de la consommation adhéré} | « prêt pour relecture avocat »

# Régime déterminé
[B2B / B2C / mixte + canal de vente ; conséquences sur le cadre applicable — Code de commerce et/ou Code de la consommation]

# {Pour B2B / mixte} Brouillon assisté de CGV B2B — PROJET DE TRAVAIL
[projet de CGV structuré, mentions L.441-1 présentes, plafond L.441-10 vérifié, chaque clause d'arbitrage taguée [review] — NE PAS présenter comme prêt à publier]

# {Pour B2C / mixte} Brouillon assisté de CGU/CGV B2C — PROJET DE TRAVAIL
[projet de CGU/CGV structuré : information précontractuelle, rétractation L.221-18 si vente à distance, garantie de conformité L.217-3 et s., médiation ; aucune clause de liste noire R.212-1 ; clauses liste grise taguées [review] — NE PAS présenter comme prêt à publier]

# Points à arbitrer
[liste explicite et numérotée des points [review] : régime et canal, conditions de règlement, barème de prix, réserve de propriété, limitation de responsabilité, droit applicable, rétractation et exceptions, coordonnées du médiateur, clauses de liste grise — un avocat doit trancher chacun. Inclure en tête tout finding 🔴 (clause de liste noire refusée, délai de paiement hors plafond).]

# Une question hors de ma checklist habituelle
{Observation transversale qu'un relecteur attentif ferait — ex. cohérence avec la politique de confidentialité RGPD du site, articulation CGV / conditions d'achat du client en B2B, régime sectoriel de délais de paiement. Omettre la ligne si rien d'honnête.}

# Que veux-tu faire ? Choisis une option et je la déroule :

1. **Rédiger** — je produis le brouillon assisté complet (CGV B2B et/ou CGU/CGV B2C + liste des points à arbitrer), prêt pour relecture avocat.
2. **Escalader** — note d'escalade vers l'approbateur configuré avec faits-clés, régime retenu, findings 🔴 et décision attendue.
3. **Compléter les faits** — questions ouvertes à poser au client avant d'avancer (qualité exacte des cocontractants, canal de vente, médiateur adhéré, régime sectoriel éventuel).
4. **Surveiller et attendre** — j'ajoute le dossier de CGV/CGU au tracker avec note motivée et date de revisite (ex. en attente de confirmation du médiateur de la consommation).
5. **Autre** — précise ce que tu veux en faire.
```

### Mode silencieux (livrable externe)

Si le brouillon de CGV/CGU est destiné à être transmis hors du périmètre cabinet
(client non-juriste, prestataire web) :
- En-tête de confidentialité : CONSERVER s'il protège le document ; l'adapter
  au destinataire (cf. CLAUDE.md §2).
- Note du relecteur : CONSERVER (point de contrôle unique).
- Narration de skill et renvois inter-commandes : COUPER (placer dans un message
  d'accompagnement séparé).
- Le statut **brouillon / projet de travail** reste affiché : un brouillon de
  CGV transmis ne devient jamais un document publiable du seul fait de l'envoi.

---

## Étape 1 — Détermination du régime

**Étape juridique active, pas une simple formalité.** Le régime conditionne
l'intégralité du brouillon.

1. Lire le profil cabinet (CLAUDE.md droit-affaires, bloc « contrats
   commerciaux ») et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`.
2. **Confirmer le régime** (intake point 2) :
   - **B2B** — client professionnel → cadre **Code de commerce** → Étape 2.
   - **B2C** — client consommateur → cadre **Code de la consommation** → Étape 3.
   - **Mixte** — les deux publics → Étapes 2 **et** 3. Exposer au client que
     deux corps de règles s'appliquent et recommander **deux jeux de conditions
     distincts** plutôt qu'un jeu commun, pour éviter qu'une clause valable en
     B2B ne contamine le jeu B2C.
   - Si le cocontractant pourrait être un **non-professionnel** (personne morale
     hors activité, ex. association) → signaler `[review]` : certaines
     protections consuméristes lui sont étendues.
4. **Si B2C ou mixte — vérifier le canal de vente** (intake point 4). Le droit
   de rétractation L.221-18 C.conso [à vérifier] ne s'applique **qu'en vente à
   distance et hors établissement**. Une vente en présentiel dans
   l'établissement n'ouvre **pas** de rétractation légale : ne pas insérer la
   clause à tort. À l'inverse, l'omettre dans une vente à distance B2C est une
   non-conformité.

Le résultat de cette étape (régime + canal) figure en tête de la **liste des
points à arbitrer** et conditionne les étapes suivantes.

---

## Étape 2 — Génération B2B (si régime B2B ou mixte)

Produire un **brouillon de CGV B2B** structuré selon
`${CLAUDE_SKILL_DIR}/../../references/regimes-cgv-cgu-fr.md` (Partie B2B) et `clauses-sensibles-fr.md`
(clauses 16 à 30). **Brouillon assisté** : chaque clause d'arbitrage est taguée
`[review]` en ligne, et le livrable ne se présente **jamais** comme « prêt à
publier ».

**Mentions obligatoires — art. L.441-1 C.com. [à vérifier]** — les CGV B2B
doivent comprendre :

- les **conditions de règlement** ;
- le **barème des prix unitaires** (ou les éléments de détermination du prix) ;
- les **réductions de prix** éventuelles (rabais, remises, ristournes).

Leur **présence** n'est pas négociable ; leur **contenu** est tagué `[review]`.

**Clauses appelant un arbitrage — tag `[review]` systématique :**

- **Conditions de règlement** — délai de paiement, date de départ du délai,
  moyens de paiement, escompte éventuel `[review]`.
- **Barème des prix** — prix unitaires, devise, base HT/TTC, modalités des
  réductions de prix `[review]`.
- **Clause de réserve de propriété** — suspension du transfert de propriété
  jusqu'au paiement intégral ; rappeler qu'elle doit être stipulée par écrit
  **avant ou lors de la livraison** pour être opposable, y compris en procédure
  collective (cf. clauses-sensibles-fr.md n° 16) `[review]`.
- **Limitation de responsabilité** — plafond aménagé sans priver l'obligation
  essentielle de sa substance (art. 1170 C.civ.), carve-outs dol
  et faute lourde (cf. clauses-sensibles-fr.md n° 9 et 24) `[review]`.
- **Droit applicable et juridiction** — selon la posture du cabinet
  (cf. clauses-sensibles-fr.md n° 10) `[review]`.

**Vérification du plafond des délais de paiement — art. L.441-10 C.com.
[à vérifier].** Le délai de paiement convenu ne peut dépasser **60 jours à
compter de la date d'émission de la facture**, ou **45 jours fin de mois à
compter de la date d'émission de la facture** si cette dérogation est
expressément stipulée — la **première échéance à survenir** s'applique. Le skill
ne reproduit **jamais** un délai supérieur au plafond : si le client demande un
délai excédant le plafond (ex. 90 jours), le signaler en `[review]` comme
**non-conforme** et proposer un délai conforme. Inclure systématiquement la
clause **pénalités de retard + indemnité forfaitaire de recouvrement** (caractère
automatique, de plein droit — cf. clauses-sensibles-fr.md n° 18).

Le **contrôle des clauses abusives B2B** (déséquilibre significatif L.442-1
C.com., contrat d'adhésion 1171 C.civ.) s'applique
au brouillon : éviter toute asymétrie non justifiée, en particulier sur la
modification unilatérale, la résiliation et les pénalités.

---

## Étape 3 — Génération B2C (si régime B2C ou mixte)

Produire un **brouillon de CGU/CGV B2C** structuré selon
`${CLAUDE_SKILL_DIR}/../../references/regimes-cgv-cgu-fr.md` (Partie B2C). **Brouillon assisté** : chaque
clause d'arbitrage taguée `[review]`, livrable jamais « prêt à publier ».

> **Avertissement.** Les articles du Code de la consommation cités ci-dessous
> (L.111-1, L.212-1, L.217-x, L.221-18, R.212-1, R.212-2) sont **hors index ou
> en `[a compléter]`** : ils doivent être tagués `[à vérifier]` dans la sortie.

**Inclure obligatoirement :**

- **Information précontractuelle** — caractéristiques essentielles, prix, délai
  d'exécution, identité du professionnel, garanties légales (art. L.111-1
  C.conso [à vérifier]).
- **Droit de rétractation** — si le canal est la vente à distance / hors
  établissement : délai de **14 jours**, sans motivation, **formulaire type**
  de rétractation (art. L.221-18 et s. C.conso [à vérifier]). La clause générée
  doit fixer le **point de départ** du délai, qui diffère selon l'objet : à la
  **conclusion du contrat** pour une prestation de services, à la **réception
  du bien** pour une vente de bien (cf. `${CLAUDE_SKILL_DIR}/../../references/regimes-cgv-cgu-fr.md`
  Partie B2C) → `[review]`. Vérifier les éventuelles **exceptions** (art.
  L.221-28 C.conso [à vérifier] — biens sur mesure, biens descellés non
  retournables pour hygiène, contenu numérique exécuté avec renoncement
  exprès) → `[review]` si l'activité en relève.
- **Garantie légale de conformité** — art. L.217-3 et s. C.conso [à vérifier],
  régime refondu par l'ordonnance n° 2021-1247 du 29 septembre 2021, applicable
  depuis le 1er janvier 2022 ; **2 ans** avec présomption d'antériorité du
  défaut **24 mois** pour les biens neufs. Mention **explicite et d'ordre
  public** — ne jamais l'écarter ni la réduire.
- **Médiation de la consommation** — clause d'information sur le médiateur
  compétent (art. L.612-1 et L.616-1 C.conso [à vérifier]) ; pour les contrats
  en ligne, mention de la plateforme RLL. Les coordonnées du médiateur
  effectivement adhéré sont laissées en `[review]` — le skill ne les invente
  pas.

**Contrôle systématique des clauses abusives consuméristes — art. L.212-1
C.conso [à vérifier] :**

- **AUCUNE clause figurant en liste noire** (art. R.212-1 C.conso [à vérifier])
  ne doit apparaître dans le brouillon. Ces clauses sont **irréfragablement
  présumées abusives** et **réputées non écrites**. Si une clause demandée par
  le client relève de la liste noire (ex. modification unilatérale du service,
  suppression du droit à réparation, charge de preuve inversée, entrave au droit
  d'agir en justice) → finding **🔴**, refus d'insertion, explication au client,
  proposition d'une clause conforme.
- Les clauses relevant de la **liste grise** (art. R.212-2 C.conso [à vérifier])
  sont **présumées abusives sauf preuve contraire** : ne les insérer que si
  justifiées, et les **taguer `[review]`** systématiquement.

Aucune clause B2C ne doit réduire les droits légaux du consommateur (garanties,
réparation, accès au juge). Aucune clause de rétractation ne doit être insérée
si le canal est uniquement le **présentiel en établissement**.

---

## Étape 4 — Post-flight

Appel automatique de `verifier-citations` sur la sortie complète (mode défaut
`articles`). Le skill :

- extrait toutes les citations (art. L.NNN-N C.com., art. L.NNN-N et R.NNN-N
  C.conso, art. NNN C.civ.) ;
- vérifie l'existence et la version en vigueur via Légifrance ;
- annote : `[Légifrance ✓]`, `[abrogé]`, ou `[à vérifier]` en mode dégradé.

Articles attendus présents dans `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md` avec
identifiant Légifrance réel (→ à lire via `legifrance_get_article` ; `[Légifrance ✓]` seulement après lecture dans la session, sinon `[à vérifier]`) : 1170, 1171 C.civ. ; L.442-1
C.com. En `[a compléter]` (→ `[à vérifier]` obligatoire) : L.441-1, L.441-10
C.com., D.441-5 C.com. **Tous les articles du Code de la consommation**
(L.111-1, L.212-1, L.212-2, L.217-3 et s., L.221-5, L.221-18, L.221-28, L.612-1,
L.616-1, R.212-1, R.212-2) sont **hors index ou en `[a compléter]`** → tag
`[à vérifier]` obligatoire.

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur
(« `verifier-citations` non exécuté — N citations à valider manuellement contre
Légifrance »).

---

## Ce skill ne fait pas

- La **revue d'une CGV / CGU existante** (entrante) → renvoyer vers
  `/h-da:reviser-contrat` (mode `--review`). Ce skill
  **génère**, il ne revoit pas.
- La **publication** des CGV/CGU sur un site, leur intégration technique, leur
  acceptation par les utilisateurs — actes du professionnel et de son
  prestataire web.
- La rédaction de la **politique de confidentialité RGPD** complète — le skill
  insère une clause de renvoi ; l'analyse RGPD dédiée relève de
  un spécialiste RGPD (hors périmètre de ce plugin).
- Le **conseil fiscal** (TVA, base de prix HT/TTC) — signalement uniquement.
- La détermination du **médiateur de la consommation** adhéré par le
  professionnel — le skill laisse l'emplacement en `[review]`, il ne choisit
  pas le médiateur.
- La rédaction de **conditions générales d'achat** (côté acheteur) — hors
  périmètre.
- La rédaction de **conditions particulières** négociées dérogeant aux CGV —
  hors périmètre v1.2.

---

## Ton

Technique, structuré, prudent. La détermination du **régime** (B2B vs B2C) est
le premier acte juridique du skill et ne se devine pas : en cas d'ambiguïté, le
régime est **demandé**, jamais supposé. Le mode `--draft` produit un **brouillon
assisté** — jamais des CGV « prêtes à publier » — où chaque point de décision
est tagué `[review]`. En B2B, signaler sans détour tout délai de paiement
excédant le plafond L.441-10 C.com. : ce n'est pas un arbitrage mais une
non-conformité. En B2C, refuser toute clause de liste noire R.212-1 et rappeler
le caractère d'ordre public des garanties légales et du droit de rétractation.
Toute sortie est un brouillon soumis à validation humaine (avocat) avant publication.
