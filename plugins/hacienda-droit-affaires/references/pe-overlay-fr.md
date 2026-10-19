# Référence — Overlay Private Equity (« --pe ») pour revue pacte d'associés

Module partagé chargé par `pacte-associes-review` **uniquement** quand le mode
`--pe` est posé (ou accepté après auto-détection). Hors mode `--pe`, ignorer
ce module : la revue standard 11 clauses est inchangée.

> **Périmètre.** Cible un **pacte d'associés dans un contexte Private Equity** :
> pacte d'investissement sponsor + managers (LBO / MBO / build-up) superposé à un
> pacte existant et aux statuts d'une entité française (SAS/HoldCo/BidCo). La
> doctrine est **side-aware** (lecture inversée sponsor / management). Le manager
> avec rollover n'est pas un fondateur ; le sponsor n'est pas un investisseur lambda.

---

## Gate d'application France/Lux (vérifier avant d'exécuter l'overlay)

1. **Entité visée par le pacte est luxembourgeoise (SCSp, RAIF, SàRL Lux, etc.)** →
   ce n'est PAS un pacte FR : les documents constitutifs du fonds luxembourgeois,
   son LPA/side letters, son AIFM et les contraintes de droit luxembourgeois sont
   **hors périmètre Hacienda DA**. **STOP overlay** → renvoyer vers un conseil
   luxembourgeois.
2. **Structure mixte fonds Lux → BidCo FR → cible FR** → l'overlay couvre la
   **jambe française** : SPA FR, BidCo FR, GAP, pacte FR, management package régi
   par droit français et closing FR. Les documents constitutifs du fonds
   luxembourgeois restent hors périmètre.

   > *Formulation type :* « Je traite la jambe française de l'opération : cible FR,
   > SPA/GAP/pacte/management package régis par droit français et closing FR. Les
   > documents constitutifs du fonds luxembourgeois, son LPA/side letters, son AIFM,
   > son dépositaire et les contraintes de droit luxembourgeois sont hors périmètre
   > Hacienda DA et doivent être validés par un conseil luxembourgeois. »

3. **Aucun signal PE réel dans le document** → pas d'overlay ; revue standard.
4. **Volet fonds uniquement** (règlement/LPA/side letters d'un FCPR/FPCI/SLP) →
   hors périmètre de cet overlay ; skill dédié `fonds-pe-fr-triage` (à venir — vague ultérieure).

---

## Signaux de détection (pour la proposition auto, hors flag)

Mention de *pacte d'investissement* ; *sponsor* / *fonds* / *GP* ; *BidCo* /
*HoldCo* / *NewCo* / *TopCo* ; *management package* / *MEP* ; *rollover* /
*reinvest* ; *sweet equity* ; *ratchet* ; *envy ratio* ; *liquidation preference* ;
*leaver* indexé sur un LBO ; *drag* « sortie sponsor » ; *reserved matters* /
*veto sponsor* ; *accession deed* / *adhésion au pacte*.

Un seul signal sérieux suffit à **proposer** l'overlay.

---

## Axe P1 — Précédence & architecture documentaire (axe lourd)

### Ce que la revue standard ne couvre pas

Dans un deal PE, le pacte d'investissement se **superpose** à un pacte d'associés
existant (voire à plusieurs niveaux de pactes dans un empilement HoldCo/MidCo) et
aux statuts. La revue standard lit un pacte isolé ; l'overlay P1 cartographie la
**matrice documentaire complète** et ses conflits de précédence.

### Matrice de précédence à produire

```
Statuts (rang 1 — ordre public) ↔ Pacte d'investissement (rang 2) ↔ Pacte existant (rang 3) ↔ SPA (rang 4)
```

Vérifier pour chaque document :

- **Clause de précédence** : le pacte d'investissement prévaut-il expressément sur
  le pacte existant en cas de conflit ? Si silence → ambiguïté `[review]`.
- **Clause d'accession / adhésion** (*accession deed*) : les managers rollovers
  ont-ils signé une adhésion au pacte d'investissement ? Défaut d'adhésion = droits
  et obligations non opposables `[review]`.
- **Clause d'amendment** : quelle majorité déclenche la modification du pacte
  d'investissement ? Vérifier si elle est cohérente avec le pacte existant.
- **Clause de termination / caducité** du pacte existant : est-il expressément
  résilié ou subsiste-t-il en parallèle ? Coexistence sans précédence = **risque de
  conflit bloquant** `[review]`.
- **Cohérence statuts ↔ pacte ↔ SPA** : les clauses d'inaliénabilité (L.227-13
  C.com.) et d'agrément (L.227-14/15 C.com.) des statuts sont-elles alignées avec
  les restrictions de transfert du pacte d'investissement ? Tout conflit non résolu
  = `[review]`.

> **FAIL-type P1** : rater un conflit de précédence pacte/statuts qui piège le
> client (le manager rollover non-adhérent au pacte d'investissement peut se
> soustraire au drag — dommage irréparable au closing).

---

## Axe P2 — Gouvernance sponsor

### Ce que la revue standard couvre déjà

Véto, droits d'information, board composition de base.

### Ce que l'overlay PE ajoute

**Reserved matters / véto sponsor.** Une liste de reserved matters (décisions
réservées à l'approbation du sponsor) trop large crée un risque de **gestion de
fait** `[review]` : si le sponsor prend effectivement les décisions de gestion au
travers des reserved matters, il peut être requalifié en dirigeant de fait et
exposé à la responsabilité pour insuffisance d'actif (L.651-2 C.com. `[à vérifier]`,
déjà dans l'index). La qualification est une appréciation jurisprudentielle — jamais
conclure ici, qualifier le **risque** `[review]`.

Signaux de véto trop large : toute dépense au-dessus d'un seuil très bas, tout
recrutement, toute décision commerciale courante, toute ligne de contrat.

**Board composition.** Vérifier :
- La répartition des sièges sponsor / management au board ou comité de direction.
- Les règles de quorum et de deadlock : un deadlock non résolu bloque la société.
- La représentation des co-investisseurs et minoritaires.

**Information rights.** Calibrer :
- Reporting financier (mensuel/trimestriel) exigé par le sponsor → confidentialité
  envers les banques et tiers.
- Droits d'audit sur place : fréquence, préavis, périmètre.
- Droits d'information renforcés des LP via le sponsor (information rights cascade).

---

## Axe P3 — Économie & préférences

### Ce que la revue standard couvre déjà

Anti-dilution (ratchet anti-dilutif basique).

### Ce que l'overlay PE ajoute

**Liquidation preference.** Mécanisme contractuel (aucun article dédié en droit
français — voir note index) permettant au sponsor de récupérer en priorité son
investissement (parfois avec multiple) avant tout partage de la valeur résiduelle.

Vérifier :
- Le multiple de la préférence (1x, 1,5x, 2x) et son assiette (investissement
  nominal / montant libéré / valeur économique).
- La nature : *participating* (le sponsor participe à l'upside résiduel après
  récupération de sa préférence) vs *non-participating* (le sponsor choisit entre
  sa préférence et sa quote-part au pro rata).
- L'articulation avec le ratchet et le sweet equity.
- **Léonine watch** : si la liquidation preference garantit au sponsor un
  rendement fixe ou l'exonère de toute perte quelle que soit la performance, risque
  de qualification en clause léonine (art. 1844-1 al. 2 C.civ `[à vérifier]`).
  La qualification est une appréciation de fait `[review]` — jamais conclure.

**Ratchet (MEP).** Distinguer :
- *Ratchet sponsor/co-investisseur* : ajustement de la répartition selon un TRI
  ou un multiple à la sortie.
- *Ratchet management* : relution progressive des managers selon la performance
  (mécanisme autonome du sweet equity).
- Formule mal relue = économie fausse → toujours vérifier le calcul de partage sur
  un scénario de sortie fictif.

**Sweet equity.** Titres souscrits par les managers à economics asymétriques
(upside disproportionné si performance). Les instruments sous-jacents (BSA, ADP,
BSPCE, AGA, OC/OCA `[à vérifier]`) relèvent de `financement-startup` — **renvoi
systématique** ; l'overlay PE ne les traite pas au fond. L'overlay signale les
mécanismes et leur articulation dans le pacte.

> **Requalification fiscale/sociale** du management package = **nommée et
> renvoyée**, jamais traitée au fond (voir Anti-fabrication PE).

---

## Axe P4 — Management & leaver PE

### Ce que la revue standard couvre déjà

Good/bad leaver (binaire), non-concurrence d'associé.

### Ce que l'overlay PE ajoute

**Vesting / reverse vesting.** Vérifier :
- La durée du vesting et les jalons (temps, performance, événement).
- Le calendrier de *reverse vesting* (rachat progressif si départ avant terme).
- La mécanique d'accélération (change of control, départ involontaire, IPO).

**Leaver indexé package.** Dans un contexte PE, le prix du leaver est souvent
indexé sur le package d'entrée ou sur une valeur de marché calculée selon une
formule. Vérifier :
- La définition exhaustive des catégories (good / bad / early / intermediate leaver).
- Le prix associé à chaque catégorie : valeur nominale, valeur de souscription,
  fair market value par expert (1843-4 C.civ `[à vérifier]`), décote.
- Le risque de clause confiscatoire sur le bad leaver à prix nominal trop large
  `[review]`.

**Adhésion rollover au pacte.** Les managers qui réinvestissent dans BidCo/HoldCo
doivent avoir signé une *accession deed* au pacte d'investissement (voir P1). Vérifier :
- L'adhésion effective (date, signataire, titres visés).
- La cohérence entre les droits du manager au pacte d'investissement et ses
  obligations dans le SPA (rollover, non-compete, représentations).

**Cumul des qualités.** Un manager PE cumule souvent : associé (actionnaire de
HoldCo) + salarié (contrat de travail de la cible) + mandataire social (président
/ DG de la cible ou BidCo). Ce cumul génère des régimes juridiques distincts :
- Non-concurrence d'associé (libre, sans contrepartie obligatoire au titre du pacte).
- Non-concurrence salariée (contrepartie financière obligatoire en droit FR).
- Non-concurrence du mandataire social (régime intermédiaire `[à vérifier]`).

> **Requalification fiscale/sociale** du management package : les gains réalisés
> par les managers sur le sweet equity peuvent être requalifiés en salaires ou en
> revenus professionnels selon leur nature et les conditions de souscription.
> **Ce sujet est nommé et renvoyé vers un fiscaliste/socialiste spécialisé.**
> Hacienda DA ne donne aucun avis de fond sur la requalification, le régime fiscal
> applicable, ni les taux ou conditions d'imposition. `[à vérifier]`.

---

## Axe P5 — Liquidité & sortie sponsor

### Ce que la revue standard couvre déjà

Drag/tag, liquidité de base.

### Ce que l'overlay PE ajoute

**Drag sous l'angle sortie sponsor.** La clause de drag est ici lue du point de
vue du sponsor qui veut sortir à des conditions optimales. Vérifier :

- **Seuil de déclenchement** : le drag est-il subordonné à un prix minimum (TRI
  minimum, multiple minimum) ou déclenché librement ? Un drag sans seuil de prix
  minimum expose les minoritaires à une sortie à conditions défavorables `[review]`.
- **Égalité des conditions** : le drag garantit-il que les minoritaires entraînés
  reçoivent exactement les mêmes prix et conditions que le sponsor ? Toute
  différence de traitement est un signal `[review]`.
- **Garanties imposées aux minoritaires** : le drag peut-il contraindre les
  managers/minoritaires à donner des garanties personnelles à l'acquéreur ? Si oui
  et si la garantie dépasse les représentations sur leur situation personnelle, c'est
  un point de négociation fort `[review]`.

**Put/call.** Vérifier :
- La formule de prix du put manager (sortie à valeur de marché ou prix plancher ?).
- La formule de prix du call sponsor (achat à valeur de marché ou décote ?).
- La cohérence entre put/call et le mécanisme de leaver.

**ROFR / préemption.** Vérifier :
- L'articulation entre la préemption statutaire (L.227-14 C.com.) et la préemption
  contractuelle du pacte d'investissement.
- La priorité entre le sponsor et les co-investisseurs en cas de ROFR.
- Le délai d'exercice et les conséquences du non-exercice.

**Lock-up IPO.** Si une sortie en bourse est envisagée, vérifier :
- La durée du lock-up post-IPO imposée aux managers.
- Les conditions de libération anticipée.
- L'articulation avec le droit à la liquidité des managers (put post lock-up ?).

---

## Glossaire PE FR praticien

> Actif partagé de tous les futurs modes PE Hacienda (glossaire complet intégré dès v2.1.0).
> Disciplines : `[jargon marché]` = terme marché effectivement employé, souvent anglais ;
> `[formel]` = rattachement juridique/documentaire français ; `[à vérifier]` = point non
> vérifié en source primaire.

| Terme marché | Sens pratique | Équivalent / terme juridique formel | Notes |
|---|---|---|---|
| Private equity / PE | Capital-investissement, investissement en titres non cotés. | Capital-investissement. `[formel]` | AMF emploie capital-investissement / private equity. |
| LBO | Acquisition avec effet de levier, souvent via holding de reprise. | Capital-transmission, acquisition financée par dette et fonds propres. `[formel]` | Dette, CP financement, management package et pacte sont les zones de friction. |
| Sponsor | Fonds ou investisseur financier qui porte l'opération. `[jargon marché]` | Investisseur financier / acquéreur indirect. | Côté SPA, le sponsor agit souvent via BidCo/NewCo. |
| Fund / fonds | Véhicule d'investissement PE. `[jargon marché]` | FCPR, FPCI, FPS, SLP, autre FIA. `[formel]` | Fonds Lux hors périmètre sauf effets FR. |
| GP | General Partner / sponsor gestionnaire dans le langage marché. `[jargon marché]` | Société de gestion / associé commandité selon structure. | Sur fonds FR, ne pas sur-traduire : identifier le rôle réel. |
| LP | Limited Partner / investisseur du fonds. `[jargon marché]` | Porteur de parts / associé commanditaire / investisseur. | `[à vérifier]` selon véhicule. |
| LPA | Document de fonds appelé "LPA" par usage marché. `[jargon marché]` | Règlement du fonds, statuts de SLP, documentation de souscription. `[formel]` | Courant même si fonds FR ≠ limited partnership agreement. |
| PPM / IM | Mémorandum d'information investisseur. `[jargon marché]` | Document d'information / mémorandum de placement privé. | Commercialisation et informations investisseurs `[à vérifier]`. |
| Term sheet fonds | Résumé économique et juridique du fonds avant docs définitifs. `[jargon marché]` | Projet de conditions de souscription / règlement / statuts. | Douleur : cohérences avec side letters et closing investors. |
| Subscription booklet | Pack de souscription investisseur. `[jargon marché]` | Bulletin de souscription, KYC, déclarations investisseur. | Très opérationnel, source d'allers-retours. |
| Commitment | Engagement total de souscription d'un LP. `[jargon marché]` | Engagement de souscription / engagement d'apport. `[formel]` | Ne pas confondre avec equity commitment d'un deal. |
| Capital call / drawdown | Appel de fonds fait aux LP. `[jargon marché]` | Appel de fonds / libération progressive. `[formel]` | Critique pour funds flow d'acquisition. |
| Defaulting LP | LP qui ne répond pas à un appel de fonds. `[jargon marché]` | Porteur défaillant. | Sanctions et dilution/cession forcée `[à vérifier]`. |
| Closing fonds / final closing | Date(s) d'entrée d'investisseurs dans le fonds. `[jargon marché]` | Clôture de souscription initiale / finale. `[formel]` | Attention égalisation, rétrocession frais, late interest. |
| Equalisation | Mise à niveau économique des LP entrant après premier closing. `[jargon marché]` | Ajustement d'entrée tardive. | `[à vérifier]` selon règlement. |
| Management fee | Rémunération de gestion prélevée par la société de gestion. `[jargon marché]` | Frais de gestion. `[formel]` | Base commitment / invested capital : point économique central. |
| Carried interest / carry | Part de performance revenant à l'équipe de gestion. `[jargon marché]` | Parts/actions de carried, droits spécifiques. | Fiscalité du carried = signaler et renvoyer, jamais traiter au fond. |
| Waterfall | Ordre de distribution des produits du fonds. `[jargon marché]` | Clause de répartition/distribution. `[formel]` | Hurdle, catch-up, carry, clawback à modéliser. |
| Hurdle / preferred return | Rendement préférentiel à atteindre avant carry. `[jargon marché]` | Rendement prioritaire. | Courant en pratique. |
| Catch-up | Rattrapage permettant au GP de toucher le carry après hurdle. `[jargon marché]` | Mécanisme de rattrapage. | Douleur : formule mal relue = économie fausse. |
| Clawback | Restitution si carry trop versé au regard de la perf finale. `[jargon marché]` | Mécanisme de restitution / ajustement. | Souvent lié à escrow / garantie. |
| Escrow / holdback carry | Mise en réserve d'une partie du carry. `[jargon marché]` | Séquestre / retenue. `[formel]` | Sert à sécuriser clawback. |
| GP commitment | Investissement propre du GP / équipe. `[jargon marché]` | Souscription de la société de gestion / équipe. | Alignement d'intérêts. |
| LPAC / advisory committee | Comité consultatif d'investisseurs. `[jargon marché]` | Comité consultatif / comité de gouvernance. `[formel]` | Conflits, waivers, valuations, related-party deals. |
| Key person | Clause liée au départ ou indisponibilité de personnes clé. `[jargon marché]` | Clause homme-clé. `[formel]` | Suspension investments / no-fault divorce `[à vérifier]`. |
| No-fault divorce | Droit des LP de mettre fin à la période d'investissement ou de remplacer le GP sans faute. `[jargon marché]` | Révocation / suspension sans faute. | Jargon courant fonds. |
| For-cause removal | Éviction du GP pour faute. `[jargon marché]` | Révocation pour faute. | Seuil de vote et conséquences économiques sensibles. |
| MFN | Most favoured nation, clause d'alignement des LP sur meilleurs droits. `[jargon marché]` | Clause de traitement le plus favorisé. | Side letters : matrice MFN chronophage. |
| Side letter | Lettre d'accord individuelle avec un LP. `[jargon marché]` | Lettre d'engagement / accord latéral. `[formel]` | Douleur : cohérence règlement, égalité de traitement, disclosure. |
| Excuse right / exclusion | Droit d'un LP de ne pas participer à un investissement interdit pour lui. `[jargon marché]` | Clause d'excuse / exclusion. | ESG, sanctions, fiscal, regulatory. |
| Co-invest | Investissement direct d'un LP aux côtés du fonds. `[jargon marché]` | Coinvestissement. `[formel]` | Allocation, frais, conflits. |
| Parallel fund | Fonds parallèle pour certains investisseurs/juridictions. `[jargon marché]` | Fonds parallèle. | France/Lux fréquent, gate obligatoire. |
| Master-feeder | Structure de collecte via feeders vers master. `[jargon marché]` | Fonds nourricier / maître. | France Invest cite master/feeder comme structuration complexe. |
| Continuation fund | Fonds de continuation pour conserver un actif. `[jargon marché]` | Véhicule de continuation. | GP-led secondary ; valorisation et conflits. |
| LP-led secondary | Cession de parts de fonds initiée par un LP. `[jargon marché]` | Transaction secondaire sur parts. | Solution de liquidité identifiée par France Invest. |
| GP-led secondary | Opération secondaire initiée par le GP. `[jargon marché]` | Restructuration / continuation / tender. | Conflits, fairness opinion, LPAC. |
| Tender offer / stapled tender | Offre de liquidité aux LP, parfois liée à un engagement dans un nouveau fonds. `[jargon marché]` | Offre de rachat de parts / souscription liée. | Jargon marché. |
| NAV facility | Financement adossé à la valeur du portefeuille du fonds. `[jargon marché]` | Financement sur valeur d'actif net. | Dette au niveau fonds ; hors M&A cible sauf effet sur closing. |
| Subscription line / equity bridge | Ligne de crédit adossée aux commitments LP. `[jargon marché]` | Financement relais d'appels de fonds. `[formel]` | France Invest parle d'equity bridge facilities. |
| Preferred equity fonds | Financement hybride prioritaire au niveau fonds/portefeuille. `[jargon marché]` | Financement préférentiel. | À ne pas confondre avec actions de préférence de BidCo. |
| GP stake | Prise de participation dans la société de gestion. `[jargon marché]` | Acquisition/cession de titres de SGP. | France Invest : consolidation SGP, changement d'actionnariat, AMF. |
| BidCo / NewCo | Holding d'acquisition qui achète la cible. `[jargon marché]` | Société holding de reprise. `[formel]` | Peut être FR même si fonds sponsor Lux. |
| HoldCo / MidCo / TopCo | Étages de holding. `[jargon marché]` | Holdings intermédiaires. | Identifier qui signe quoi : SPA, pacte, dette, management. |
| Equity ticket | Montant de fonds propres investi dans le deal. `[jargon marché]` | Apport en fonds propres. | Par sponsor, co-investors, managers. |
| Sources & uses | Tableau des sources de financement et emplois au closing. `[jargon marché]` | Plan de financement / funds flow. | Artefact clé closing. |
| Equity commitment letter / ECL | Engagement du sponsor d'apporter les fonds propres à BidCo. `[jargon marché]` | Lettre d'engagement de fonds propres. | Conditions, cap, bénéficiaire, recours vendeur. |
| Debt commitment letter / DCL | Engagement de dette bancaire. `[jargon marché]` | Lettre de financement dette. | CP financement et certain funds. |
| Certain funds | Financement disponible de façon quasi certaine au closing. `[jargon marché]` | Engagement de financement ferme sous conditions limitées. | Concept marché ; formalisation `[à vérifier]`. |
| Funds flow | Séquence des virements au closing. `[jargon marché]` | Tableau de flux / instructions de virement. | Très forte valeur IA : réconciliation sources & uses / closing bible. |
| Locked box | Prix fixe fondé sur comptes historiques avec protection leakage. `[jargon marché]` | Mécanisme de prix fixe avec date de référence économique. `[formel]` | CMS European M&A Study 2026 suit locked box comme pricing mechanism. |
| Leakage | Sortie de valeur interdite entre locked box date et closing. `[jargon marché]` | Distribution / paiement non autorisé. | Doit être remboursé hors plafond GAP côté acquéreur `[review]`. |
| Permitted leakage | Leakage autorisé listé contractuellement. `[jargon marché]` | Sorties autorisées. | Liste souvent négociée ligne par ligne. |
| Completion accounts | Prix ajusté sur comptes de closing. `[jargon marché]` | Comptes de réalisation / ajustement dette nette-BFR. | Source de litiges post-closing. |
| Net debt / working capital adjustment | Ajustement dette nette et BFR. `[jargon marché]` | Ajustement de prix. | Définitions et sample statement critiques. |
| Earn-out | Complément de prix lié à performance future. `[jargon marché]` | Complément de prix. `[formel]` | CMS note les earn-outs comme pricing-related terms. |
| MAC / MAE | Material adverse change/effect. `[jargon marché]` | Changement défavorable significatif. `[formel]` | Définition et exclusions sensibles. |
| Interim covenants | Engagements de gestion entre signing et closing. `[jargon marché]` | Engagements de période intercalaire. | Équilibre entre contrôle acquéreur et gestion normale. |
| CP / conditions precedent | Conditions à lever avant closing. `[jargon marché]` | Conditions suspensives. `[formel]` | Financement, autorisations, agrément, CSE, antitrust, IEF `[à vérifier]`. |
| W&I / RWI | Warranty & indemnity insurance. `[jargon marché]` | Assurance de garantie de passif / assurance transactionnelle. | Articulation GAP / exclusions / retention. |
| GAP | Garantie d'actif et de passif. `[formel]` | Garantie d'actif et de passif FR. | Socle Hacienda existant ; ne pas calquer R&W US. |
| Disclosure letter | Lettre listant exceptions aux garanties. `[jargon marché]` | Lettre de révélation / exceptions aux déclarations. | En FR, articulation avec devoir d'information `[à vérifier]`. |
| Fundamental warranties | Garanties fondamentales : titre, capacité, pouvoirs. `[jargon marché]` | Déclarations fondamentales. | Souvent hors cap ou cap spécifique. |
| Specific indemnity | Indemnisation dédiée à un risque identifié. `[jargon marché]` | Garantie spécifique / indemnité spécifique. `[formel]` | Issue DD → SPA/GAP. |
| Knowledge qualifier | Garantie limitée à la connaissance du garant. `[jargon marché]` | Limitation par connaissance. | Side-dependent : vendeur aime, acquéreur résiste. |
| De minimis / basket | Seuil unitaire et panier de déclenchement. `[jargon marché]` | Seuils de réclamation / franchise. `[formel]` | CMS suit baskets / de minimis. |
| Cap | Plafond de responsabilité. `[jargon marché]` | Plafond d'indemnisation. | Peut varier : général, fondamental, fiscal/social `[à vérifier]`. |
| Retention | Part de risque conservée hors assurance W&I. `[jargon marché]` | Franchise / retention police. | À articuler avec GAP et escrow. |
| Security for claims | Garantie de paiement des claims. `[jargon marché]` | Séquestre, garantie autonome, caution, holdback. `[formel]` | CMS suit security for claims. |
| Management package / MEP | Incentive equity des managers. `[jargon marché]` | Instruments + pacte + promesses + leaver. | Fiscal/social = danger majeur `[à vérifier]`. |
| Sweet equity | Titres souscrits à economics asymétriques favorables aux managers. `[jargon marché]` | BSA, ADP, AO, actions de préférence, autres instruments. | Requalification rémunération/salaire signalée, non traitée. |
| Envy ratio | Ratio d'investissement sponsor/managers rapporté à leur part de valeur. `[jargon marché]` | Indicateur économique non juridique. | Douleur : perception d'iniquité, fiscal/social `[à vérifier]`. |
| Ratchet | Mécanisme d'ajustement de participation / rendement. `[jargon marché]` | Clause anti-dilution ou relution / ajustement. | Attention startup ratchet ≠ MEP ratchet. |
| Vesting | Acquisition progressive des droits. `[jargon marché]` | Acquisition conditionnelle / promesses échelonnées. `[formel]` | Souvent lié au temps et à la présence. |
| Reverse vesting | Perte progressive si départ avant terme. `[jargon marché]` | Promesse de cession/rachat conditionnelle. | Source de contentieux leaver. |
| Good leaver | Départ favorable ou non fautif. `[jargon marché]` | Cas de départ non sanctionné. | Décès, invalidité, retraite, révocation sans cause : à calibrer. |
| Bad leaver | Départ fautif ou concurrence. `[jargon marché]` | Cas de départ sanctionné. | Prix nominal/décote : risque confiscatoire `[review]`. |
| Early / intermediate leaver | Départ avant jalons ou entre deux périodes. `[jargon marché]` | Catégorie intermédiaire de leaver. | Évite le binaire good/bad trop brutal. |
| Rollover / reinvest | Réinvestissement d'une partie du prix par managers/vendeurs. `[jargon marché]` | Réinvestissement en titres de BidCo/HoldCo. | Séquence cash-out → reinvest → pacte. |
| Liquidity right | Droit de liquidité manager/minoritaire. `[jargon marché]` | Promesse de vente/achat, sortie conjointe, put/call. `[formel]` | Le vrai besoin manager : sortie possible. |
| Drag / tag | Sortie forcée / sortie conjointe. `[jargon marché]` | Clause d'entraînement / sortie conjointe. `[formel]` | Déjà cœur de `pacte-associes-review`. |
| ROFR / préemption | Droit de premier refus / préemption. `[jargon marché]` | Préemption contractuelle/statutaire. `[formel]` | Précédence statuts-pacte critique. |
| Reserved matters / veto | Décisions réservées au sponsor/LP/manager. `[jargon marché]` | Droits de veto / autorisations préalables. | Attention gestion de fait / blocage `[review]`. |
| Information rights | Reporting du sponsor/LP/minoritaire. `[jargon marché]` | Droit d'information contractuel. | À calibrer avec confidentialité et banques. |
| Exit | Sortie sponsor : trade sale, secondary buyout, IPO. `[jargon marché]` | Cession, introduction, restructuration. | Pacte pilote la liquidité et drag. |
| Add-on / build-up | Acquisition complémentaire par plateforme PE. `[jargon marché]` | Croissance externe. | SPA repeats + financement + intégration. |
| Change of control | Clause déclenchée par changement de contrôle. `[jargon marché]` | Consentement / résiliation de contrat clé. `[formel]` | DD cible : red flag récurrent. |
| Vendor DD / VDD | DD préparée côté vendeur. `[jargon marché]` | Audit vendeur. | Sert à accélérer process et disclosure. |
| Q&A | Questions/réponses dataroom. `[jargon marché]` | Liste de questions complémentaires. | Artefact opérationnel fort pour IA. |
| Red flag report | Rapport court sur risques majeurs. `[jargon marché]` | Rapport de DD red flags. | Partner-ready, utile en PE. |
| Closing bible | Dossier final des actes signés et preuves. `[jargon marché]` | Bible de closing. `[formel]` | Post-closing et audit trail. |
| Accession deed | Acte d'adhésion au pacte d'investissement. `[jargon marché]` | Acte d'adhésion / avenant d'adhésion. `[formel]` | Indispensable pour les managers rollovers — voir axe P1. |

---

## Lecture side-aware (synthèse)

| Axe | Sponsor (imposer / structurer) | Management (protéger / négocier) |
|---|---|---|
| P1 précédence | Clause de précédence du pacte d'investissement ; accession deed de tous les managers | Vérifier que l'adhésion ne crée pas d'obligations supplémentaires non négociées ; termination du pacte existant si défavorable |
| P2 gouvernance | Reserved matters larges ; board composition majoritaire ; information rights cascade LP | Limiter les reserved matters aux décisions structurantes ; éviter le risque gestion de fait ; protéger la confidentialité opérationnelle |
| P3 économie | Liquidation preference élevée et participante ; ratchet sponsor protecteur du TRI | Limiter la préférence (non-participating ou cap) ; watch léonine ; s'assurer du sweet equity réel après préférence |
| P4 leaver | Leaver à prix nominal ou décote sur bad leaver ; vesting long ; accélération limitée | Éviter la clause confiscatoire ; obtenir FMV ou 1843-4 pour le prix ; prévoir accélération sur départ involontaire ou CoC |
| P5 liquidité | Drag libre et rapide ; garanties imposées aux managers ; ROFR sponsor en premier | Seuil de prix minimum sur le drag ; égalité des conditions ; limiter les garanties personnelles ; put à FMV post lock-up |

---

## Anti-fabrication PE

- **Requalification fiscale/sociale du management package** : nommée et renvoyée
  vers un fiscaliste/socialiste. **Jamais traitée au fond par cet overlay.**
- **Pas de quantum** : pas de chiffrage de l'exposition fiscale/sociale, pas de taux,
  pas de montant de requalification.
- **Léonine / gestion de fait** : qualification en `[review]` uniquement, jamais
  conclusion. La probabilité de requalification dépend d'une appréciation de fait
  que seul un avocat ou le juge peut faire.
- **Instruments** (BSA/BSPCE/ADP/AGA/OC) : signalés et renvoyés à `financement-startup`.
  L'overlay ne rédige ni ne structure les instruments.
- **Dates** : pas de date calendaire fabriquée pour les jalons de vesting ou de
  sortie ; utiliser des semaines/mois relatifs.
- **Citations** : tout article non vérifié en source primaire Légifrance reste
  `[à vérifier]`. Aucun identifiant LEGIARTI inventé.
- **Documents luxembourgeois** : hors périmètre (gate France/Lux ci-dessus).

---

## Renvois

- Instruments management package (BSA/BSPCE/ADP/AGA/OC) : `/h-da:financement-startup`.
- DD red flags PE (findings convertis en CP / GAP / W&I / specific indemnity / price chips / Q&A) : `/h-da:due-diligence-dataroom --pe`.
- Revue SPA côté sponsor (locked box, certain funds, rollover, MAC, W&I) : `/h-da:spa-review --pe --side=sponsor`.
- Revue GAP sous l'angle W&I / disclosure : `/h-da:gap-review --pe`.
- Garanties personnelles managers / GAP managers cédants : `/h-da:gap-review`.
- Orientation share vs asset si cible en difficulté : `/h-da:asset-vs-share-distress`.
- Volet PI substantiel dans les contrats cible : hors périmètre, orienter vers un spécialiste PI.
