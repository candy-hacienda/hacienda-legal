# Régimes CGV / CGU — B2B et B2C — droit français

Référence de travail pour le skill `cgv-generator` du plugin
`hacienda-droit-affaires`. Le document est organisé en **deux parties
strictement séparées** : la Partie B2B relève du **Code de commerce**, la
Partie B2C relève du **Code de la consommation**. Les deux régimes ne se
confondent jamais — appliquer le mauvais cadre à un public donné est une faute.

> **Sources primaires :** Légifrance, Judilibre, Eurlex.
> Toute citation non relue en session doit être traitée comme `[à vérifier]`.
>
> **État de l'index.** Les articles du **Code de la consommation** (L.111-1,
> L.212-1, L.217-x, L.221-18, L.221-21 et s., R.212-1, R.212-2) sont en grande
> partie **hors** de `articles-c-civ-c-com-index.md` ou y figurent en
> `[a compléter]` — ils doivent donc être tagués `[à vérifier]` dans toute
> sortie tant qu'ils ne sont pas vérifiés en session. Les articles du Code de
> commerce L.441-1 et L.441-10 figurent à l'index mais en `[a compléter]`
> (LEGIARTI non relu) : ils restent `[à vérifier]` jusqu'à vérification.

---

## Préambule — comment qualifier le régime

Avant toute rédaction, le régime applicable doit être **déterminé**, pas
deviné. Le critère est la **qualité du cocontractant** :

- **B2B** — le client est un **professionnel** agissant pour les besoins de son
  activité. Cadre : **Code de commerce**, droit commun des contrats du Code
  civil. Les CGV sont le « socle unique de la négociation commerciale »
  (art. L.441-1 C.com. [à vérifier]).
- **B2C** — le client est un **consommateur** : personne physique agissant à
  des fins n'entrant pas dans le cadre de son activité commerciale,
  industrielle, artisanale, libérale ou agricole. Cadre : **Code de la
  consommation**, d'ordre public protecteur.
- **Mixte** — l'activité s'adresse aux **deux publics** (ex. un éditeur de
  logiciel vendant à des entreprises et à des particuliers). Deux corps de
  règles s'appliquent : il faut soit **deux jeux de conditions distincts**,
  soit un jeu commun dont chaque clause est valide sous le régime le plus
  exigeant — le plus souvent le B2C. Le skill DEMANDE explicitement le régime
  s'il n'est pas précisé : il ne suppose jamais.

La figure du **non-professionnel** (personne morale n'agissant pas dans le
cadre de son activité, ex. une association) bénéficie de certaines protections
consuméristes (notamment clauses abusives art. L.212-2 C.conso [à vérifier]) :
en cas de doute sur la qualité du cocontractant, signaler `[review]`.

---

# PARTIE B2B — CGV (Code de commerce)

## B2B.1 — Nature et fonction des CGV

Les CGV B2B constituent, lorsqu'elles existent, le **socle unique de la
négociation commerciale** entre le vendeur/prestataire et son client
professionnel (art. L.441-1 C.com. [à vérifier]). Elles encadrent la relation
de manière standardisée ; des conditions particulières peuvent y déroger par
négociation.

## B2B.2 — Structure type d'une CGV B2B

Ossature recommandée — chaque clause d'arbitrage est ensuite taguée `[review]`
par le skill :

1. **Objet et champ d'application** — produits/prestations visés ; primauté des
   CGV sur les conditions d'achat du client.
2. **Commandes** — modalités de passation, d'acceptation, conditions de
   réserve (cf. clauses-sensibles-fr.md n° 23 — réserve sur disponibilité).
3. **Prix** — barème des prix unitaires, devise, base HT/TTC, conditions des
   réductions de prix (rabais, remises, ristournes).
4. **Conditions de règlement** — délai de paiement, date de départ du délai,
   moyens de paiement, escompte éventuel pour paiement anticipé.
5. **Pénalités de retard et indemnité forfaitaire de recouvrement** — clause
   obligatoire et automatique (cf. clauses-sensibles-fr.md n° 18).
6. **Livraison et transfert des risques** — délais, modalités, point de
   transfert des risques (cf. clauses-sensibles-fr.md n° 28).
7. **Réserve de propriété** — suspension du transfert de propriété jusqu'au
   paiement intégral (cf. clauses-sensibles-fr.md n° 16).
8. **Réception et réclamations** — délai de contestation, procédure
   (cf. clauses-sensibles-fr.md n° 27).
9. **Garanties** — garantie des vices cachés (art. 1641 C.civ.), garantie
   commerciale éventuelle (cf. clauses-sensibles-fr.md n° 20 et 21).
10. **Responsabilité** — limitation de responsabilité aménagée
    (cf. clauses-sensibles-fr.md n° 9 et 24).
11. **Propriété intellectuelle** — étendue des droits concédés
    (cf. clauses-sensibles-fr.md n° 25).
12. **Données personnelles** — notice RGPD (cf. clauses-sensibles-fr.md n° 26).
13. **Force majeure / imprévision** — cf. clauses-sensibles-fr.md n° 6 et 29.
14. **Résiliation** — cf. clauses-sensibles-fr.md n° 5.
15. **Droit applicable et juridiction** — cf. clauses-sensibles-fr.md n° 10.

## B2B.3 — Mentions obligatoires de l'art. L.441-1 C.com.

Les CGV communiquées entre professionnels comprennent obligatoirement
(art. L.441-1 C.com. [à vérifier]) :

- les **conditions de règlement** ;
- les **éléments de détermination du prix** tels que le **barème des prix
  unitaires** ;
- les **réductions de prix** éventuelles.

Règle de **communication** : toute personne exerçant des activités de
production, de distribution ou de services est tenue de **communiquer ses CGV**
à tout acheteur professionnel qui en fait la demande pour une activité
professionnelle (art. L.441-1 C.com. [à vérifier]). Les CGV peuvent être
**différenciées selon les catégories** d'acheteurs ; la catégorisation doit
reposer sur des critères objectifs.

> **Point de rédaction.** L'absence de barème de prix unitaire et de conditions
> de règlement dans des CGV B2B est une lacune de conformité, pas une option de
> style. Le skill tague `[review]` le barème de prix et les conditions de
> règlement, mais signale que leur **présence** n'est pas négociable.

## B2B.4 — Plafond des délais de paiement (art. L.441-10 C.com.)

Le délai convenu entre les parties pour régler les sommes dues ne peut
**dépasser** (art. L.441-10, I C.com. [à vérifier]) :

- **60 jours à compter de la date d'émission de la facture** ; ou
- par dérogation, si elle est expressément stipulée au contrat et ne constitue
  pas un abus manifeste à l'égard du créancier, **45 jours fin de mois à
  compter de la date d'émission de la facture**.

**Règle de lecture — la première des deux échéances à survenir.** Lorsque le
contrat retient le régime « 45 jours fin de mois », l'échéance se calcule à
partir de la date d'émission de la facture ; en pratique, c'est la **première
échéance à survenir** entre les deux modes de calcul autorisés qui doit être
respectée. Le délai doit être **explicitement fixé** dans les CGV ; à défaut de
stipulation, le délai légal supplétif est de **30 jours** suivant la réception
des marchandises ou l'exécution de la prestation [à vérifier].

Le **dépassement** des plafonds expose à une **amende administrative** et la
clause dérogatoire non justifiée est nulle. Des **délais spécifiques** existent
par secteur (produits périssables, secteur du transport, achats en franchise
de TVA destinés à l'export…) : signaler `[review]` si l'activité relève d'un
régime sectoriel particulier.

> **Erreur classique à bloquer.** Une CGV stipulant « payable à 90 jours net »
> dépasse le plafond légal : la clause est irrégulière. Le skill ne reproduit
> jamais un délai supérieur au plafond — il le tague `[review]` et signale la
> non-conformité.

## B2B.5 — Pénalités de retard et indemnité forfaitaire

Lien : clauses-sensibles-fr.md n° 18. Rappels structurants pour la rédaction :

- Les **pénalités de retard** sont dues **de plein droit**, dès le jour suivant
  la date d'échéance, **sans rappel ni mise en demeure** (art. L.441-10, II
  C.com. [à vérifier]). Une clause les soumettant à une demande préalable est
  contraire à ce caractère automatique.
- Le **taux** des pénalités ne peut être inférieur à un plancher : trois fois
  le taux d'intérêt légal, ou le taux BCE de refinancement le plus récent
  majoré de 10 points [à vérifier] — retenir au moins ce plancher.
- L'**indemnité forfaitaire pour frais de recouvrement** (montant fixé par
  voie réglementaire — 40 € [à vérifier], art. D.441-5 C.com. [à vérifier]) est
  **obligatoire** ; une clause la supprimant est nulle.

## B2B.6 — Contrôle des clauses abusives en B2B

Le B2B n'échappe pas au contrôle des clauses déséquilibrées — par des
fondements **distincts** du régime consumériste :

- **Déséquilibre significatif entre professionnels** — art. L.442-1, I, 2°
  C.com. (LEGIARTI000047381704, présent à l'index — citer `[Légifrance]`) :
  engage la responsabilité de celui qui soumet ou tente de soumettre un
  partenaire commercial à des obligations créant un déséquilibre significatif.
  C'est un délit civil (responsabilité, nullité de la clause, amende civile),
  pas une nullité automatique. Cf. clauses-sensibles-fr.md n° 7.
- **Clause abusive en contrat d'adhésion** — art. 1171 C.civ.
  (LEGIARTI000032041039, présent à l'index — citer `[Légifrance]`) : dans un
  contrat d'adhésion, toute clause **non négociable, déterminée à l'avance par
  l'une des parties**, créant un déséquilibre significatif, est réputée non
  écrite. Des CGV imposées sans négociation peuvent qualifier le contrat
  d'adhésion. Cf. clauses-sensibles-fr.md n° 8.

> **Distinction à tenir.** Le déséquilibre significatif **B2B** (L.442-1 C.com.)
> et les clauses abusives **B2C** (L.212-1 C.conso) sont deux régimes séparés,
> au champ et aux sanctions différents. Ne jamais transposer l'un à l'autre.
> L'article 1171 C.civ. est, lui, transversal mais conditionné à la
> qualification de **contrat d'adhésion**.

---

# PARTIE B2C — CGU / CGV (Code de la consommation)

> **Avertissement de régime.** Tous les articles du Code de la consommation
> cités ci-dessous sont **hors index ou en `[a compléter]`** dans
> `articles-c-civ-c-com-index.md`. Ils doivent être tagués **`[à vérifier]`**
> dans toute sortie tant qu'ils ne sont pas relus en session via Légifrance.
> Le régime B2C est **d'ordre public** : les clauses qui réduisent les droits
> du consommateur sont réputées non écrites.

## B2C.1 — Structure type d'une CGV / CGU B2C

Ossature recommandée pour une vente ou une fourniture de services à des
consommateurs :

1. **Identification du professionnel** — dénomination, coordonnées, RCS, contact.
2. **Objet et champ d'application** — biens / services / contenus numériques.
3. **Information précontractuelle** — caractéristiques essentielles, prix,
   modalités d'exécution (art. L.111-1 C.conso [à vérifier]).
4. **Commande** — étapes, confirmation, formation du contrat.
5. **Prix et paiement** — prix TTC, modalités, sécurisation du paiement.
6. **Livraison et exécution** — délais, transfert des risques (à la livraison
   effective au consommateur).
7. **Droit de rétractation** — modalités et délai, formulaire type
   (art. L.221-18 et s. C.conso [à vérifier]) — en **vente à distance / hors
   établissement**.
8. **Garantie légale de conformité** — art. L.217-3 et s. C.conso [à vérifier].
9. **Garantie légale des vices cachés** — art. 1641 C.civ.
10. **Garantie commerciale éventuelle** — distincte des garanties légales.
11. **Responsabilité** — sans réduction des droits légaux du consommateur.
12. **Données personnelles** — notice RGPD.
13. **Médiation de la consommation** — coordonnées du médiateur, plateforme RLL.
14. **Droit applicable et règlement des litiges**.

## B2C.2 — Information précontractuelle (art. L.111-1 C.conso)

Avant la conclusion du contrat, le professionnel communique au consommateur, de
manière lisible et compréhensible (art. L.111-1 C.conso [à vérifier]) :

- les **caractéristiques essentielles** du bien ou du service ;
- le **prix** du bien ou du service ;
- en l'absence d'exécution immédiate, la **date ou le délai** de livraison ou
  d'exécution ;
- les **informations relatives à l'identité** du professionnel, à ses
  coordonnées, à ses activités ;
- les informations relatives aux **garanties légales** et à leurs modalités de
  mise en œuvre, ainsi qu'aux **autres conditions contractuelles**.

En vente à distance et hors établissement, l'information précontractuelle est
renforcée (art. L.221-5 C.conso [à vérifier]) et inclut notamment les
**conditions, délai et modalités d'exercice du droit de rétractation** ainsi que
le **formulaire type de rétractation**.

## B2C.3 — Droit de rétractation (art. L.221-18 C.conso)

Dans les contrats conclus **à distance** et **hors établissement**, le
consommateur dispose d'un délai de **quatorze (14) jours** pour exercer son
droit de rétractation, **sans avoir à motiver sa décision ni à supporter
d'autres coûts** que ceux prévus par la loi (art. L.221-18 C.conso
[à vérifier]).

Points de rédaction :

- **Point de départ du délai** — pour un contrat de **prestation de services**,
  à compter de la conclusion du contrat ; pour un contrat de **vente de bien**,
  à compter de la **réception du bien** par le consommateur [à vérifier].
- **Champ** — la rétractation ne s'applique **qu'en vente à distance et hors
  établissement**. Une vente conclue **en présentiel dans l'établissement** du
  professionnel **n'ouvre pas** de droit de rétractation légal. Le canal de
  vente doit donc être vérifié avant d'insérer la clause.
- **Exceptions** — certaines catégories de biens et services sont **exclues**
  du droit de rétractation (art. L.221-28 C.conso [à vérifier]) : biens
  confectionnés sur demande, biens descellés non retournables pour des raisons
  d'hygiène, contenu numérique fourni sur support immatériel dont l'exécution a
  commencé avec l'accord du consommateur et renoncement exprès, etc. Si
  l'activité relève d'une exception, le skill le signale `[review]`.
- **Formulaire type** — un formulaire type de rétractation doit être mis à
  disposition du consommateur.

> **Erreur de régime à bloquer.** Insérer une clause de rétractation de 14 jours
> dans des CGV **B2B** est une erreur : la rétractation L.221-18 est une
> protection **consumériste**. À l'inverse, omettre la clause dans une vente à
> distance **B2C** est une non-conformité.

## B2C.4 — Clauses abusives consuméristes (art. L.212-1 C.conso)

Dans les contrats conclus entre professionnels et consommateurs, sont abusives
les clauses qui ont pour objet ou pour effet de créer, **au détriment du
consommateur, un déséquilibre significatif** entre les droits et obligations des
parties au contrat (art. L.212-1 C.conso [à vérifier]). Une clause abusive est
**réputée non écrite**.

Le pouvoir réglementaire fixe deux listes :

- **Liste noire — clauses irréfragablement présumées abusives** (art. R.212-1
  C.conso [à vérifier]). Ces clauses sont **interdites par principe** : elles
  sont abusives **de manière irréfragable**, sans que le professionnel puisse en
  rapporter la preuve contraire. Exemples typiques de clauses visées : celles
  qui suppriment ou réduisent le droit à réparation du consommateur en cas de
  manquement du professionnel ; celles qui réservent au professionnel le droit
  de modifier unilatéralement les caractéristiques du bien ou du service ;
  celles qui imposent au consommateur la charge de la preuve incombant
  normalement au professionnel ; celles qui suppriment ou entravent le droit
  d'agir en justice du consommateur. **Aucune clause de la liste noire ne peut
  figurer dans des CGV/CGU B2C.**
- **Liste grise — clauses présumées abusives sauf preuve contraire**
  (art. R.212-2 C.conso [à vérifier]). Ces clauses sont **présumées abusives** ;
  le professionnel peut tenter de rapporter la preuve de leur caractère non
  abusif. Exemples typiques : clauses réservant au professionnel un délai
  excessif pour exécuter, ou un droit de résiliation discrétionnaire. Toute
  clause relevant de la liste grise doit être **signalée `[review]`** : sa
  validité dépend d'une appréciation au cas par cas.

> **Contrôle systématique du skill en B2C.** (1) **Aucune** clause figurant en
> **liste noire** R.212-1 ne doit apparaître dans le brouillon — détection et
> exclusion impératives, finding 🔴 si une telle clause est demandée. (2) Toute
> clause relevant de la **liste grise** R.212-2 est insérée seulement si elle
> est justifiée, et **systématiquement taguée `[review]`**.

## B2C.5 — Garantie légale de conformité (art. L.217-3 et s. C.conso)

Le régime de la garantie légale de conformité a été **refondu par l'ordonnance
n° 2021-1247 du 29 septembre 2021**, applicable aux contrats conclus **depuis le
1er janvier 2022** [à vérifier]. Repères pour la rédaction :

- **Champ** — le professionnel délivre un bien conforme au contrat et répond des
  défauts de conformité existant au moment de la délivrance (art. L.217-3 C.conso
  [à vérifier]). Le régime couvre les biens, y compris les biens comportant des
  éléments numériques, et les contenus et services numériques.
- **Critères de conformité** — le bien doit correspondre à la description, être
  propre à l'usage habituellement attendu, être délivré avec les accessoires et
  les mises à jour prévus (art. L.217-4 et L.217-5 C.conso [à vérifier]).
- **Durée et présomption** — l'action en garantie de conformité s'exerce dans un
  délai de **deux (2) ans** à compter de la délivrance du bien ; pour les
  **biens neufs**, les défauts apparaissant dans un délai de **24 mois** sont
  **présumés exister** au moment de la délivrance (art. L.217-7 C.conso
  [à vérifier]). Pour les biens d'occasion, la durée de présomption est réduite
  [à vérifier].
- **Caractère d'ordre public** — la garantie légale de conformité est **d'ordre
  public** : toute clause qui l'écarte, la limite ou la réduit est **réputée non
  écrite**. Les CGV B2C doivent la **mentionner explicitement**, sans tenter de
  la contractualiser à la baisse.
- **Articulation** — la garantie légale de conformité (C.conso, B2C) **coexiste**
  avec la garantie légale des vices cachés (art. 1641 C.civ., B2B et B2C) ;
  toutes deux sont distinctes d'une **garantie commerciale** volontaire. Cf.
  clauses-sensibles-fr.md n° 20 et 21.

> **Erreur de régime à bloquer.** Une clause « toute garantie est exclue » dans
> des CGV B2C est nulle : les garanties légales sont d'ordre public. En B2B, la
> garantie des vices cachés est en revanche aménageable contractuellement (sans
> exclusion totale si le vendeur est professionnel du même secteur).

## B2C.6 — Obligation d'information sur la médiation de la consommation

Tout professionnel doit permettre au consommateur de recourir gratuitement à un
**médiateur de la consommation** en vue de la résolution amiable d'un litige.
Le professionnel **communique au consommateur** les coordonnées du ou des
médiateurs compétents dont il relève (art. L.612-1 et L.616-1 C.conso
[à vérifier]) ; cette information figure de manière visible et lisible dans les
CGV/CGU et sur le site internet. Pour les litiges issus d'un contrat conclu en
ligne, mentionner également l'existence de la **plateforme européenne de
règlement en ligne des litiges (RLL)** [à vérifier].

> **Point de rédaction.** Le skill insère une clause « médiation de la
> consommation » avec un emplacement `[review]` pour les coordonnées du
> médiateur effectivement adhéré par le professionnel — le skill ne connaît pas
> le médiateur retenu et ne l'invente pas.

---

# Tableau récapitulatif — où va quel régime

| Sujet | B2B (Code de commerce) | B2C (Code de la consommation) |
|---|---|---|
| Texte cadre | art. L.441-1 C.com. [à vérifier] | art. L.111-1 C.conso [à vérifier] |
| Mentions obligatoires | conditions de règlement, barème prix unitaires, réductions de prix | information précontractuelle : caractéristiques essentielles, prix, délai, identité, garanties |
| Délais de paiement | plafond 60 j / 45 j fin de mois — art. L.441-10 C.com. [à vérifier] | sans plafond légal spécifique B2C |
| Rétractation | aucune | 14 jours en vente à distance / hors établissement — art. L.221-18 C.conso [à vérifier] |
| Clauses déséquilibrées | déséquilibre significatif L.442-1 C.com. [Légifrance] ; adhésion 1171 C.civ. [Légifrance] | clauses abusives L.212-1 C.conso [à vérifier] — liste noire R.212-1, liste grise R.212-2 [à vérifier] |
| Garanties | vices cachés 1641 C.civ. — aménageable | conformité L.217-3 et s. C.conso [à vérifier] — d'ordre public ; vices cachés 1641 C.civ. |
| Médiation | non imposée | obligatoire — art. L.612-1 C.conso [à vérifier] |

---

## Renvois

- Clauses détaillées (réserve de propriété, délais de paiement, pénalités,
  garanties, limitation de responsabilité, imprévision…) :
  `references/clauses-sensibles-fr.md` n° 16 à 30.
- Index des articles vérifiés et de leurs LEGIARTI :
  `references/articles-c-civ-c-com-index.md`.
- Revue d'une CGV/CGU **existante** (entrante) : skill `reviser-contrat` — le
  présent régime sert la **génération**, pas la revue.
