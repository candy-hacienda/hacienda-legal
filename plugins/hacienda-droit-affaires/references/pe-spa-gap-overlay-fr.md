# Référence — Overlay Private Equity (« --pe ») pour revue SPA / GAP (side sponsor)

Module frère de `pe-overlay-fr.md`, chargé par `spa-review` et `gap-review` **uniquement**
quand le mode `--pe` est posé (ou accepté après auto-détection). Hors mode `--pe`, ignorer
ce module : la revue standard est inchangée.

> **Périmètre.** Cible un **SPA ou une GAP dans un contexte Private Equity** : acquisition
> sponsor/BidCo (LBO / MBO / build-up), jambe française (cible FR, SPA/GAP/pacte/management
> package régis par droit français). La doctrine est **side-aware** — 1ʳᵉ vague centrée
> **sponsor (acquéreur)**. Side cédant ouvert mais secondaire.

> **Socle partagé — non redupliqué ici.** Gate France/Lux, glossaire PE FR praticien
> (~100 termes : locked box, completion accounts, leakage, certain funds, ECL/DCL, W&I,
> disclosure letter, security for claims, funds flow, sources & uses, rollover…) et
> anti-fabrication PE (requalif fiscale/sociale nommée/renvoyée ; no quantum ; léonine /
> gestion de fait en `[review]` ; instruments renvoyés ; dates relatives ; articles non
> vérifiés `[à vérifier]` ; docs Lux hors périmètre) : voir
> `references/pe-overlay-fr.md` — **non redupliqués ici**.

---

## Signaux de détection (pour la proposition auto, hors flag)

Mention de *sponsor* / *BidCo* / *NewCo* / *HoldCo* ; *certain funds* / ECL / DCL ;
*locked box* / *completion accounts* / *leakage* ; *rollover* / *management package* /
*MEP* / *sweet equity* ; *W&I* / *RWI* / assurance transactionnelle ; *disclosure letter* ;
*ratchet* / *liquidation preference* ; *accession deed* ; *sources & uses* / *funds flow*.

Un seul signal sérieux suffit à **proposer** l'overlay.

---

## Axe S1 — Mécanisme de prix PE

### Ce que la revue standard couvre déjà

Vérification du prix nominal, de la clause d'ajustement de prix basique, des déclarations
du vendeur sur les comptes de référence.

### Ce que l'overlay PE ajoute

**Locked box vs completion accounts** : deux mécanismes distincts, avec des profils de
risque opposés pour le sponsor.

- **Locked box** : le prix est fixé à une *date de référence économique* antérieure au
  signing ; la valeur est « verrouillée ». Le sponsor doit vérifier :
  - La **détermination de la date locked box** et la mise à disposition des **comptes
    locked box arrêtés à cette date** : sans une date de référence clairement fixée *et*
    les comptes correspondants, la base économique du prix fixe ne peut pas être validée
    → `[review]` (réclamer les comptes `[à compléter]`) ;
  - Le *no-leakage covenant* et la **définition du leakage** : entre la date de référence
    et le closing, aucune valeur ne peut sortir de la cible sans autorisation. Exiger une
    définition **élargie et précise** du leakage, couvrant non seulement les dividendes,
    rémunérations hors cours normal et paiements intragroupe, mais aussi les **paiements
    aux vendeurs ou parties liées, renonciations de créances, avantages indirects, frais
    et impôts** ; une définition trop étroite laisse passer des fuites de valeur `[review]` ;
  - La liste de *permitted leakage* négociée ligne à ligne : l'absence d'un poste
    habituel dans la liste autorisée est un signal `[review]` ;
  - Le mécanisme de remboursement du leakage non autorisé : côté acquéreur, ce
    remboursement intervient **hors plafond GAP** `[review]` — vérifier que la GAP et
    le SPA n'interfèrent pas sur ce point ;
  - La durée de la période intercalaire (locked box date → closing) : plus elle est
    longue, plus l'exposition leakage est élevée.

- **Completion accounts** : le prix définitif est ajusté sur les comptes arrêtés au
  closing (dette nette / BFR). Le sponsor doit vérifier :
  - Les définitions contractuelles de la dette nette et du BFR : toute ambiguïté est
    une source de litige post-closing `[review]` ;
  - Le *sample statement* (exemple de calcul) : exiger qu'il soit annexé, à défaut
    `[review]` ;
  - Le mécanisme de dispute (expert tiers, délai, coûts) ;
  - La cohérence du mécanisme de prix avec le *funds flow* au closing (→ Axe S5).

**Lecture sponsor** : le locked box protège mieux l'acquéreur contre les dégradations
entre signing et closing ; les completion accounts exposent au litige sur les définitions
mais permettent un ajustement réel. Documenter le choix retenu et ses conséquences sur
le financement (ECL/DCL calibrés sur le prix définitif ou le prix estimé ?).

> **Ne pas chiffrer** le leakage ni l'ajustement de prix dans ce module (`[à compléter]`,
> réclamer les comptes et la liste de permitted leakage). Semaines relatives pour la durée
> de la période intercalaire.

---

## Axe S2 — Certain funds & financement

### Ce que la revue standard couvre déjà

Présence et levée des conditions suspensives (financement, autorisations). Vérification
de la capacité du vendeur.

### Ce que l'overlay PE ajoute

**Structure de financement BidCo.** Dans un deal PE, le sponsor agit via une entité
holding (BidCo / NewCo) ad hoc, souvent insolvency-remote. Les engagements de financement
sont portés par des documents distincts du SPA :

- **Equity commitment letter (ECL)** : engagement du sponsor d'apporter les fonds propres
  dans BidCo au closing. Vérifier : bénéficiaire (le vendeur peut-il l'invoquer ?),
  conditions, montant capé, durée de validité ;
- **Debt commitment letter (DCL)** : engagement de la banque senior de mettre en place la
  dette LBO. Vérifier : conditions de mise à disposition, certain funds (voir ci-dessous),
  MAC bancaire, durée de validité ;
- **Certain funds** : le financement est disponible de façon quasi certaine au closing,
  sous un nombre très limité de conditions. Vérifier si le SPA garantit la mise à
  disposition sans condition résiduelle substantielle — une condition de financement
  résiduelle dans le SPA est un **risque d'exécution** `[review]` ;
- **BidCo insolvency-remote** : la BidCo n'ayant pas d'actifs propres avant le closing,
  le recours vendeur en cas de non-closing est limité au montant capé de l'ECL (et aux
  éventuelles reverse break fees). Vérifier la clause de recours limité et son plafond.

**Lecture sponsor** : s'assurer que les conditions de l'ECL et de la DCL sont strictement
alignées avec les CP du SPA ; tout désalignement crée un risque de non-exécution non
couvert. Vérifier que le vendeur n'a pas obtenu un recours direct sur le sponsor
au-delà du plafond ECL.

---

## Axe S3 — MAC & période intercalaire

### Ce que la revue standard couvre déjà

Présence d'une clause MAC, vérification des engagements de gestion basiques entre
signing et closing.

### Ce que l'overlay PE ajoute

**MAC PE.** La clause MAC dans un deal PE doit être calibrée pour protéger l'acquéreur
tout en restant praticable. Vérifier :
- La définition du changement défavorable significatif : est-elle spécifique à la cible
  ou générique ? Une définition générique (secteur entier, conditions de marché) expose
  l'acquéreur à une MAC invoquée par le vendeur, à l'inverse ;
- Les exclusions *market-wide* : récession générale, guerre, pandémie, évolution du
  marché du crédit LBO → normalement exclues de la MAC côté vendeur ; leur périmètre
  doit être précis `[review]` ;
- L'articulation avec le certain funds (§ Axe S2) : si la banque invoque son propre
  MAC pour refuser le financement, l'acquéreur peut être pris en ciseau.

**Interim covenants (période intercalaire signing → closing).** Vérifier l'équilibre
entre le contrôle de l'acquéreur et la gestion normale de la cible :
- Liste des décisions requérant le consentement de l'acquéreur : trop large → risque de
  gestion de fait `[review]` ; trop restreinte → exposition à une dégradation sans
  recours ;
- Mécanisme de demande de consentement (délai, silence valant acceptation ou refus) ;
- Engagement de confidentialité réciproque sur les informations partagées pendant cette
  période.

**Conditions suspensives spécifiques au deal PE.** `[à vérifier]` pour chaque opération :
- Autorisation antitrust (DGGN / Commission européenne selon les seuils) — délais souvent
  longs dans un LBO build-up ;
- IEF (contrôle des investissements étrangers, si sponsor non-UE ou cible dans un secteur
  sensible) `[à vérifier]` ;
- Consultation CSE obligatoire avant closing, si la cible a un CSE et que le deal
  déclenche une obligation d'information/consultation (L.2312-8 s. C.trav.) `[à vérifier]`.

> Ne pas conclure sur le délai de levée des CP (semaines relatives) ; ne pas qualifier
> la probabilité d'obtention des autorisations sans avoir consulté les dossiers de DD.

---

## Axe S4 — Rollover & management package

### Ce que la revue standard couvre déjà

Non-compete du vendeur, déclarations du cédant, absence de conflit d'intérêts basique.

### Ce que l'overlay PE ajoute

**Séquence rollover.** Dans un LBO avec managers cédants, la séquence est :
1. Cash-out : les managers cèdent leurs titres au prix du deal (comme les autres vendeurs) ;
2. Reinvest : une partie du produit de cession est réinvestie en titres de BidCo/HoldCo,
   souvent via un *equity ticket* distinct (sweet equity) ;
3. Adhésion au pacte d'investissement (*accession deed*) : les managers rollovers adhèrent
   au pacte sponsor/managers.

Vérifier la cohérence SPA ↔ pacte :
- Les représentations du manager dans le SPA (en tant que cédant) sont-elles compatibles
  avec ses engagements dans le pacte (en tant que manager-investisseur) ?
- Le non-compete du SPA est-il articulé avec le non-compete du pacte (durée, périmètre,
  contrepartie en droit FR) ? Tout désalignement = `[review]` ;
- L'*accession deed* est-il conditionnel au closing ou signé avant ? Vérifier la date.
- **Fondateurs/cédants en rollover** (pas seulement les managers) : un fondateur qui
  réinvestit cumule **trois qualités** — *vendeur* (titres cédés), *garant* (au titre de
  la GAP) et *investisseur rollover* (titres BidCo/HoldCo) — source de conflits d'intérêts
  `[review]`. Exiger qu'il **signe lui aussi l'*accession deed*** au pacte ; à défaut, ses
  droits et obligations d'investisseur ne lui sont pas opposables (analyse du pacte via
  `/h-da:pacte-associes-review --pe`).

**Renvoi pacte.** L'analyse détaillée du pacte (gouvernance, leaver, drag/tag, liquidation
preference, ratchet, sweet equity, leaver indexé) relève de `/h-da:pacte-associes-review --pe`.
Ce module SPA ne refait pas l'analyse du pacte — il signale les points d'articulation.

**Instruments management package.** Les instruments sous-jacents (BSA, BSPCE, ADP, AGA,
OC/OCA) sont structurés et analysés via `/h-da:financement-startup`. Ce module ne les
traite pas au fond — il signale leur présence et la nécessité du renvoi.

**Requalification fiscale/sociale.** La requalification des gains du management package en
salaires ou revenus professionnels est un risque majeur, propre à chaque situation. Elle
est **nommée et renvoyée vers un fiscaliste/socialiste spécialisé** — jamais traitée au
fond dans ce module. `[à vérifier]` systématique sur tout management package.

---

## Axe S5 — Garanties, W&I & funds flow

### Ce que la revue standard couvre déjà

Structure de la GAP (durée, plafond, franchise, panier, déclarations). Vérification
des garanties fondamentales.

### Ce que l'overlay PE ajoute

**Articulation GAP / W&I.** Dans un deal PE, la GAP est souvent adossée à une assurance
W&I (warranty & indemnity insurance). L'analyse de cette articulation relève de
`/h-da:gap-review --pe` (→ Axes W1–W3 du présent module). Ce module SPA signale :
- La présence ou l'absence d'une W&I dans le deal ;
- Les clauses du SPA qui conditionnent ou modifient la structure GAP en fonction de la
  W&I (plafond GAP réduit à nil/1€ si W&I, conditions de recours sur le cédant) ;
- Le point d'articulation entre les déclarations SPA et la disclosure letter (→ Axe W3).

**Security for claims côté sponsor.** Face à un acheteur BidCo SPV sans actif propre
et à un cédant sponsor souhaitant une sortie propre, la question du *security for claims*
(garantie du paiement des indemnités GAP) est centrale. Vérifier :
- Séquestre (escrow) du prix ou d'une fraction : montant, durée, conditions de libération ;
- Garantie autonome à première demande (GAPD) ou caution bancaire en lieu et place ;
- Rétention du prix (*holdback*) : durée et montant alignés sur la durée de la GAP ;
- Absence de security for claims avec BidCo SPV insolvency-remote = 🔴 si la GAP n'est
  pas adossée à une W&I.

**Funds flow / sources & uses.** Le tableau de flux (sources et emplois au closing) est
un artefact clé du deal PE. La réconciliation entre le prix SPA, les montants ECL/DCL,
le réinvestissement managers et les frais de transaction doit être parfaite. L'analyse
détaillée du funds flow relève de `/h-da:closing-checklist-fr --pe`.
Ce module signale les incohérences entre le prix du SPA et la structure ECL/DCL.

---

## Axe W1 — Matrice GAP / W&I / disclosure

### Ce que la revue standard couvre déjà

Analyse de la GAP (déclarations, durée, plafond, franchise, panier). Vérification des
exclusions explicites.

### Ce que l'overlay PE ajoute

**Police W&I vs GAP.** Dans un deal PE, la W&I (assurance transactionnelle, RWI) modifie
en profondeur la structure de la GAP. Vérifier :
- Ce que la police couvre : les *business warranties* (déclarations sur la cible), mais
  pas les *fundamental warranties* (titre, capacité) qui restent en GAP directe ;
- Les exclusions standards de la police : *known issues* (risques identifiés en DD),
  risques *forward-looking*, environnement/ICPE, *transfer pricing*, régimes fiscaux
  particuliers `[à vérifier]` → ces exclusions doivent être couvertes par une garantie
  spécifique (*specific indemnity*) dans la GAP ou restent à risque de l'acquéreur ;
- L'alignement des paramètres police ↔ GAP :
  - *Retention* (franchise police) ↔ panier GAP : le cédant reste-il exposé sur la
    tranche rétention ? `[review]` ;
  - *De minimis* et *basket* police ↔ GAP : doivent être alignés pour éviter les zones
    grises ;
  - *Cap* police ↔ plafond GAP : cohérence essentielle.

**Disclosure letter comme outil.** La *disclosure letter* permet au cédant d'opposer des
exceptions aux déclarations de la GAP sur des points connus. Elle sert également d'outil
contre les exclusions « known » de la police W&I : un risque correctement disclosé dans
la disclosure letter pourra être exclu de la police — ce qui peut être un avantage pour
le cédant et un désavantage pour l'acquéreur si le disclosure est accepté sans négociation.
Côté acquéreur : vérifier que la disclosure letter n'absorbe pas des risques substantiels
sans contrepartie (specific indemnity, réduction de prix, séquestre).

---

## Axe W2 — Recours limité côté cédant sponsor

### Ce que la revue standard couvre déjà

Identification du garant (personne physique, holding, cédant). Solvabilité apparente
du garant.

### Ce que l'overlay PE ajoute

**GAP nil/1 € recourse adossée W&I.** Dans un deal PE, le sponsor cédant vise une
**sortie propre** : il souhaite que le recours de l'acquéreur s'exerce sur la police W&I
et non sur lui directement. La structure courante est :
- GAP à recours *nil* ou *1 € symbolique* côté cédant sponsor pour les *business warranties*,
  intégralement transférées à la police W&I ;
- Maintien de la responsabilité directe du cédant pour les *fundamental warranties* (titre,
  capacité) et les *specific indemnities* (risques identifiés) ;
- Security for claims (escrow ou GAPD) calibrée sur les *fundamental warranties* et les
  *specific indemnities* seulement.
- **Recours directs à préserver hors W&I**, quelle que soit la police : la **fraude** du
  cédant (jamais assurable ni excluable), le **leakage** (cf. Axe S1), les **garanties
  fondamentales** et les **covenants spécifiques** restent exerçables **directement contre
  les vendeurs** — vérifier qu'une clause de recours nil/réduit ne les emporte pas par
  inadvertance `[review]`.

Côté acquéreur : vérifier que la police W&I est effectivement souscrite, valide et
suffisante avant d'accepter un recours cédant nil ou réduit. Sans police W&I en place
ou sans *security for claims* sur les *fundamentals*, le recours réduit expose l'acquéreur
sans filet.

**Sandbagging / anti-sandbagging.** `[review]` : la clause de *sandbagging* (pro-sandbagging)
permet à l'acquéreur de réclamer en GAP même sur des risques qu'il connaissait avant le
closing ; la clause *anti-sandbagging* l'en prive. Dans un deal PE avec W&I, la
position de la police sur ce point doit être alignée avec la clause SPA/GAP — un désalignement
sandbagging crée une zone morte de protection `[review]`.

---

## Axe W3 — Discipline disclosure FR

### Ce que la revue standard couvre déjà

Vérification de la disclosure letter (présence, forme, contenu). Identification des
exceptions aux déclarations.

### Ce que l'overlay PE ajoute

**Articulation disclosure letter ↔ devoir d'information 1112-1 C.civ** `[à vérifier]`.
Le devoir précontractuel d'information (1112-1 C.civ `[à vérifier]`) impose à chaque
partie de communiquer à l'autre les informations dont elle sait que l'autre partie
attend de les recevoir pour former son consentement. Dans un deal PE :
- La disclosure letter remplit-elle ce devoir ou s'y substitue-t-elle ? `[review]` ;
- Des informations connues du cédant et non disclosées peuvent-elles fonder une action
  en nullité ou en responsabilité au titre du 1112-1 C.civ, indépendamment de la GAP ?
  `[review]`.

**Fair disclosure standard.** La notion de *fair disclosure* (disclosure loyale et
complète sur chaque point disclosé) est issue de la pratique anglaise mais s'importe
en pratique française. Vérifier :
- La disclosure letter identifie-t-elle précisément les exceptions par référence à
  des documents ou des faits spécifiques, ou est-elle générale et vague ?
- Un renvoi général à la data room sans identification des documents pertinents est
  insuffisant comme *fair disclosure* `[review]`.

**Data room comme disclosure.** Dans la pratique PE, la data room est souvent citée
comme outil de disclosure (« disclosed in the data room »). Vérifier :
- L'inventaire de la data room est-il annexé à la disclosure letter (avec hachage
  ou référence) ? Un renvoi à une data room non documentée est fragile `[review]` ;
- Les documents déposés en data room sont-ils ceux qui ont été effectivement consultés
  par l'acquéreur (Q&A / index) ?

**Réticence dolosive 1137 C.civ** `[à vérifier]`. La réticence dolosive (1137 al. 2
C.civ `[à vérifier]`) sanctionne le fait pour une partie de dissimuler intentionnellement
une information déterminante du consentement. Dans un deal PE :
- Une information connue du cédant et non disclosée, ayant déterminé le consentement
  de l'acquéreur, peut fonder une action en nullité pour dol — indépendamment de la GAP
  et de la disclosure letter `[review]` ;
- La disclosure letter et la data room ne bloquent pas nécessairement une action en dol
  si la dissimulation est caractérisée `[review]`.

> Articles 1112-1 et 1137 C.civ déjà présents dans l'index `articles-c-civ-c-com-index.md`.

---

## Lecture side-aware (sponsor)

| Axe | Sponsor / acquéreur (imposer / structurer) | Cédant sponsor (protéger / limiter) |
|---|---|---|
| S1 prix | Préférer locked box avec no-leakage strict ; exiger sample statement en completion accounts | Restreindre la liste de leakage interdit ; élargir le permitted leakage ; limiter le remboursement hors GAP |
| S2 financement | Aligner CP du SPA sur conditions ECL/DCL ; limiter le recours vendeur au cap ECL | Obtenir reverse break fee si certain funds non respecté ; bloquer les conditions résiduelles |
| S3 MAC/intercalaire | MAC ciblée sur la cible ; interim covenants permettant surveillance | Exclusions market-wide larges ; consentement sur périmètre limité ; délais d'antitrust/CSE/IEF balisés |
| S4 rollover | Accession deed signée avant ou au closing ; non-compete SPA aligné pacte | Limiter la durée du non-compete ; contrepartie sur non-compete salarié ; cohérence leaver SPA-pacte |
| S5 GAP/W&I | Exiger security for claims sur fundamentals + specifics si recours cédant nil | GAP nil recourse sur business warranties si W&I en place ; escrow minimal calibré sur fundamentals |
| W1 matrice | Vérifier couverture police sur chaque déclaration business ; négocier specific indemnity sur known issues exclus | Disclosure letter pour couvrir les known issues → exclusion police = pas de recours cédant |
| W2 recours limité | Refuser nil recourse sans W&I valide + security for claims fundamentals | Sortie propre : nil recourse business warranties + W&I ; GAPD sur fundamentals uniquement |
| W3 disclosure | Exiger fair disclosure précise + inventaire data room annexé | Disclosure letter large + data room bien indexée = protection réticence dolosive |

---

## Frontières propres

- **Cible cotée / AMF** → hors scope, anticipation v2. Le volet offre publique et
  règlementation AMF n'est pas couvert par cet overlay.

- **Cible en difficulté** → articulation avec `--distressed` : les deux overlays peuvent
  **s'empiler** sur un même SPA/GAP (deal PE portant sur une cible en difficulté). En
  cas de cumul, signaler l'articulation et appliquer les deux overlays ; la doctrine
  distressed (période suspecte, nullités L.632-1/L.632-2, garantie de la garantie d'un
  cédant insolvable) reste dans `references/distressed-overlay-fr.md` et n'est pas
  redupliquée ici.

- **Docs fonds-only** (règlement / LPA / side letters d'un FCPR/FPCI/SLP) → hors
  périmètre de cet overlay → `fonds-pe-fr-triage` (à venir — candidat #7).

- **Analyse pacte d'investissement** (gouvernance, leaver, drag, liquidation preference,
  ratchet) → `/h-da:pacte-associes-review --pe`.

- **Structuration et rédaction des instruments management package** (BSA, BSPCE, ADP,
  AGA, OC/OCA) → `/h-da:financement-startup`.

- **Requalification fiscale/sociale** du management package → nommée et renvoyée,
  jamais traitée au fond.

- **Funds flow détaillé au closing** → `/h-da:closing-checklist-fr --pe`

---

## Renvois

- Pacte d'investissement (gouvernance, leaver, drag, liquidation preference, ratchet) :
  `/h-da:pacte-associes-review --pe`.
- Instruments management package (BSA/BSPCE/ADP/AGA/OC) : `/h-da:financement-startup`.
- Revue GAP sous angle W&I / disclosure : `/h-da:gap-review --pe` ↔ `/h-da:spa-review --pe`.
- Funds flow / sources & uses au closing : `/h-da:closing-checklist-fr --pe`.
- PI substantiel dans les contrats cible : hors périmètre, orienter vers un spécialiste PI.
- Cible en difficulté (overlay complémentaire) : voir `references/distressed-overlay-fr.md`
  (overlays s'empilent sans se dupliquer).
- Orientation share vs asset si cible en difficulté : `/h-da:asset-vs-share-distress`.
