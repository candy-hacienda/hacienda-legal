# Référence — Overlay Private Equity (« --pe ») pour due diligence red flags (side sponsor)

Module frère de `pe-overlay-fr.md`, chargé par `due-diligence-dataroom` **uniquement**
quand le mode `--pe` est posé (alias accepté : `--mode=pe-red-flags`) ou accepté après
auto-détection. Hors mode `--pe`, ignorer ce module : la DD standard sur 7 thèmes est
inchangée.

> **Périmètre.** Cible une **DD d'acquisition dans un contexte Private Equity** :
> acquisition sponsor/BidCo (LBO / MBO / build-up), jambe française (cible FR, documents
> régis par droit français). La doctrine est **side-aware** — 1ʳᵉ vague centrée
> **sponsor (buyside DD)**. Côté cédant (*vendor DD* PE) ouvert mais secondaire : la
> même conversion se lit comme les protections que l'acquéreur exigera et la
> *disclosure* à préparer.

> **Socle partagé — non redupliqué ici.** Gate France/Lux, glossaire PE FR praticien
> (~100 termes : locked box, leakage, certain funds, ECL/DCL, W&I, disclosure letter,
> specific indemnity, reliance letter, funds flow, rollover…) et anti-fabrication PE
> (requalif fiscale/sociale nommée/renvoyée ; no quantum ; dates relatives ; articles
> non vérifiés `[à vérifier]` ; docs Lux hors périmètre) : voir
> `references/pe-overlay-fr.md` — **non redupliqués ici**.

---

## Signaux de détection (pour la proposition auto, hors flag)

Mention de *sponsor* / *BidCo* / *NewCo* / *HoldCo* dans le contexte du deal ; DD
commandée pour un fonds / investisseur financier ; *red flag report* demandé ; *VDD* /
*vendor due diligence* ; *W&I* / assurance transactionnelle envisagée ; *reliance
letter* ; dette LBO / *certain funds* / ECL / DCL ; *management package* / *rollover*
chez la cible ; process compétitif avec Q&A dataroom cadencée.

Un seul signal sérieux suffit à **proposer** l'overlay.

---

## Doctrine centrale — du finding au traitement deal

### Ce que la DD standard couvre déjà

La DD standard produit des findings qualifiés 🟢/🟡/🟠/🔴 (grille de matérialité), une
Q&A list et des **recommandations GAP** (étape 6) : déclarations, garanties,
indemnisations spécifiques, conditions suspensives, ajustement de prix.

### Ce que l'overlay PE ajoute

Dans un process PE, un finding non converti en protection ne sert à rien : le comité
d'investissement et l'équipe deal attendent des **red flags actionnables**, chacun
routé vers un **traitement deal** précis. L'overlay élargit la conversion GAP-only de
l'étape 6 vers la **palette complète** :

| Traitement | Quand le recommander | Où il atterrit |
|---|---|---|
| **CP** (condition suspensive) | Le risque est régularisable avant closing (consentement change of control, purge d'agrément, waiver bancaire, autorisation réglementaire). | SPA → `/h-da:spa-review --pe` (Axe S3) |
| **Déclaration / garantie GAP** | Le risque est générique et indemnisable si le fait se révèle faux. | GAP → `/h-da:gap-review --pe` |
| **Specific indemnity** | Le risque est **identifié et connu** (donc exclu de la police W&I comme *known issue*) : indemnisation spécifique hors panier/franchise. | GAP / SPA → `/h-da:gap-review --pe` (Axe W1) |
| **Couverture W&I** | Le risque est générique **et non identifié** : vérifier qu'il entre dans la police et n'est pas dans les exclusions standards. | Police → `/h-da:gap-review --pe` (Axe W1) |
| **Price chip** (levier prix) | Le risque est quantifiable et non régularisable : réduction de prix, ajustement, séquestre ou earn-out inversé. **Nommer le levier, ne jamais le chiffrer** (`[à compléter]`). | Négociation → `/h-da:spa-review --pe` (Axe S1) |
| **Q&A / complément** | Le risque est suspecté faute de pièce : question priorisée avant de figer le traitement. | Q&A list (étape 5) |

Règles de conversion :

- **Un finding matériel 🔴/🟠 sans traitement deal désigné est une DD inachevée** en
  mode PE : chaque ligne de la grille de matérialité reçoit un traitement (ou plusieurs
  en cascade : CP à titre principal, specific indemnity en repli) `[review]` sur le
  choix quand il relève d'un arbitrage de négociation.
- **Known vs unknown** : un risque identifié en DD devient un *known issue* — la police
  W&I l'exclura. Recommander « couverture W&I » sur un finding identifié est une
  erreur de conversion ; c'est specific indemnity, CP ou price chip `[review]`.
- **Price chips jamais chiffrés** : nommer le levier et la logique (coût de mise en
  conformité, passif estimé, marge exposée), laisser le montant `[à compléter]` pour
  l'équipe financière.
- Côté cédant (*vendor DD*) : la même table se lit en miroir — anticiper le traitement
  que l'acquéreur demandera et préparer la *disclosure* ou la régularisation préalable.

---

## Axe D1 — Red flag report orienté deal

### Ce que la DD standard couvre déjà

Rapport par thème, grille de matérialité, résumé exécutif trois phrases.

### Ce que l'overlay PE ajoute

**Format red flag report.** Le process PE est rythmé (exclusivité courte, binding offer
datée) : le livrable attendu est un **rapport court, partner-ready**, limité aux
findings 🔴/🟠 matériels, chacun avec son traitement deal. Les 🟡/🟢 restent dans la
grille complète en annexe — ils ne polluent pas le corps du red flag report.

**Table de conversion** (cœur du livrable overlay) :

| # | Finding (🔴/🟠 matériel) | Thème | Traitement deal recommandé | Repli | Renvoi |
|---|---|---|---|---|---|
| 1 | Clause de changement de contrôle sur contrat client clé | Contrats | CP : consentement du cocontractant avant closing | Specific indemnity + price chip `[à compléter]` | `/h-da:spa-review --pe` |
| 2 | Redressement URSSAF en cours | Social | Specific indemnity (known issue, exclu W&I) | Séquestre dédié | fiscaliste/socialiste + `/h-da:gap-review --pe` |
| ... | ... | ... | ... | ... | ... |

**Lecture matérialité PE.** Le seuil de matérialité se calibre sur l'**équity ticket**
et la thèse d'investissement du sponsor, pas seulement sur le chiffre d'affaires de la
cible : un finding modeste en valeur absolue peut invalider la thèse (ex : churn d'un
client structurant dans un build-up de plateforme) `[review]`. Ne pas recalculer le
seuil — le signaler quand la thèse est connue.

---

## Axe D2 — Change of control, contrats clés & concentration client

### Ce que la DD standard couvre déjà

Extraction des clauses de changement de contrôle, exclusivité, résiliation via
`revue-tabulaire` ; finding par contrat.

### Ce que l'overlay PE ajoute

**Le change of control est le red flag récurrent du LBO** — l'acquisition via BidCo
déclenche mécaniquement les clauses de la cible. Vérifier systématiquement :

- **Contrats clients / fournisseurs clés** : clause de changement de contrôle →
  consentement à obtenir (CP) ou risque de résiliation post-closing (specific
  indemnity / price chip). Un change of control oublié avant closing est la douleur
  n° 1 de la pratique `[review]` ;
- **Concentration client** : la dépendance à un ou quelques clients (*customer
  concentration*) croise le change of control — si le client structurant peut résilier,
  la thèse d'investissement est exposée. Signaler le cumul concentration × clause ;
- ***Termination for convenience*** : une faculté de résiliation sans motif à bref
  préavis sur un contrat structurant équivaut économiquement à un change of control
  non protégé ;
- ***Most favoured customer* / exclusivités** : contraintes sur la stratégie
  post-closing (build-up, synergies tarifaires) à remonter au sponsor ;
- **Baux et licences** : changement de contrôle indirect (cession de titres) parfois
  capté par les clauses — lecture attentive de la définition du contrôle
  (L.233-3 C.com. `[à vérifier]` vs définition contractuelle).

---

## Axe D3 — Dette existante, sûretés & cash pooling

### Ce que la DD standard couvre déjà

Recensement des contrats de financement dans le thème contrats ; litiges et passifs au
thème contentieux.

### Ce que l'overlay PE ajoute

La structuration LBO (dette d'acquisition BidCo + refinancement éventuel de la dette
existante) fait de la dette de la cible un thème DD à part entière :

- **Change of control defaults** : les contrats de financement existants de la cible
  contiennent presque toujours une clause d'exigibilité anticipée en cas de changement
  de contrôle → CP de waiver bancaire ou de refinancement au closing ;
- ***Security releases* / pay-off letters** : recenser les sûretés existantes
  (nantissements, hypothèques, cessions Dailly) et le chemin de mainlevée — alimente
  directement `/h-da:closing-checklist-fr --pe` (funds flow, pay-off letters) ;
- **Cash pooling intragroupe** : conventions de trésorerie avec le groupe cédant à
  dénouer au closing. Le débranchement est un deliverable de closing souvent oublié,
  et « dénouer » recouvre **trois actions distinctes** à exiger nommément, pas la seule
  sortie de la convention :
  - **Arrêt des sweeps et règlement / traitement documenté du solde intragroupe**
    (créance ou dette de la cible sur la centralisatrice), intégré au funds flow ;
  - **Révocation des mandats de nivellement** donnés aux banques : sans révocation
    explicite, les prélèvements automatiques peuvent se poursuivre après closing malgré
    la sortie du groupe — action de closing à part entière, distincte du règlement du
    solde `[review]` ;
  - **Vérification des conditions juridiques des opérations de trésorerie intragroupe**
    (régime des conventions de trésorerie intragroupe, liens de contrôle) : la poursuite
    post-closing doit être **écartée** — une fois la cible sortie du périmètre du groupe
    cédant, le fondement légal du pooling disparaît `[à vérifier]` ;
- **Engagements hors bilan** : cautions, garanties maison-mère, lettres de confort
  données par le groupe cédant au profit de la cible → à substituer au closing (CP ou
  covenant) ;
- **Assistance financière** : si la structuration envisage des sûretés de la cible au
  service de la dette d'acquisition, **nommer** la prohibition L.225-216 C.com.
  `[à vérifier]` et renvoyer `/h-da:closing-checklist-fr --pe` (Axe L4) — jamais
  valider le montage ici.

---

## Axe D4 — Management, incentives & social/fiscal

### Ce que la DD standard couvre déjà

Thème social (contrats de travail, non-concurrence, CSE) et thème fiscal en premier
niveau, avec renvois.

### Ce que l'overlay PE ajoute

- **Management package existant** : instruments détenus par les managers de la cible
  (BSPCE, AGA, BSA, ADP), clauses de leaver et d'accélération déclenchées par le deal —
  cartographie et sort dans l'opération (cash-out, rollover, caducité) →
  `/h-da:management-package-pe` pour la cartographie complète, ici recensement et
  red flags seulement ;
- **Statut des dirigeants clés** : cumul mandat/contrat de travail, golden parachutes,
  clauses de non-concurrence (contrepartie obligatoire en droit FR) — un dirigeant clé
  libre de partir sans non-compete opposable est un red flag de thèse `[review]` ;
- **Écart homme-clé vs business plan** : quand un dirigeant clé annonce (ou laisse
  prévoir) son départ alors que le business plan du sponsor suppose sa présence,
  l'écart ne se solde pas par la seule mention du risque. Le finding appelle **trois
  suites** : (1) demande de clarification de l'intention réelle et du calendrier de
  départ (Q&A) ; (2) exigence d'un **plan de transition / rétention** (management
  continuity : rétention, période d'accompagnement, plan de succession) ; (3) **décision
  sponsor structurée** sur la protection ou condition adaptée (condition suspensive de
  signature d'un accord de rétention, ajustement de la thèse, price chip `[à compléter]`)
  — à remonter à l'équipe deal, pas à trancher ici `[review]` ;
- **Incentives déclenchés par le changement de contrôle** : primes de deal, retention
  bonus, plans d'intéressement — coût à intégrer (price chip `[à compléter]`) et
  frottement social `[à vérifier]` ;
- **Audits et redressements** : URSSAF, fiscal, prix de transfert — un contrôle en
  cours ou récent est un *known issue* type → specific indemnity, jamais couverture
  W&I. Le chiffrage du risque et le fond fiscal/social sont **nommés et renvoyés**
  (fiscaliste / expert-comptable / socialiste), jamais traités ici ;
- **Consultation CSE** : si le deal déclenche l'information-consultation
  (L.2312-8 s. C.trav. `[à vérifier]`), c'est un jalon de calendrier signing/closing à
  remonter (semaines relatives, jamais de date calendaire).

---

## Axe D5 — Articulation W&I, disclosure & VDD

### Ce que la DD standard couvre déjà

Recommandations GAP par finding matériel (étape 6) ; lien `gap-review`.

### Ce que l'overlay PE ajoute

- **DD = source des known issues.** Le rapport de DD nourrit directement la
  souscription W&I : tout finding identifié sera exclu de la police comme *known
  issue*. La table de conversion (Axe D1) doit donc router les findings identifiés
  vers specific indemnity / CP / price chip, et réserver la couverture W&I aux risques
  génériques non identifiés — la matrice fine police ↔ GAP relève de
  `/h-da:gap-review --pe` (Axe W1) ;
- **Discipline disclosure** : côté cédant (vendor DD), les findings assumés doivent
  être disclosés proprement (*fair disclosure*, inventaire dataroom annexé) ; côté
  acquéreur, vérifier que la disclosure n'absorbe pas des risques substantiels sans
  contrepartie → `/h-da:gap-review --pe` (Axe W3) ;
- ***Reliance letter*** : si la DD s'appuie sur une VDD tierce, vérifier l'existence,
  le bénéficiaire (BidCo ? banques ? assureur W&I ?) et le plafond de responsabilité
  de la reliance letter `[review]` — une VDD sans reliance n'est pas opposable ;
- **Q&A process PE** : dans un process compétitif, la Q&A list (étape 5) est cadencée
  par le calendrier du process — prioriser les questions qui conditionnent le
  traitement deal des findings 🔴 (celles sans réponse avant binding offer basculent
  le finding en CP ou price chip par prudence) `[review]`.

---

## Lecture side-aware (sponsor)

| Axe | Sponsor / acquéreur (buyside DD) | Cédant (vendor DD) |
|---|---|---|
| D1 conversion | Chaque 🔴/🟠 matériel routé CP / GAP / W&I / specific indemnity / price chip / Q&A | Anticiper le traitement que l'acquéreur exigera ; régulariser ou disclosér en amont |
| D2 change of control | Consentements en CP ; concentration × clause = risque de thèse | Obtenir les consentements avant process ; documenter la solidité des contrats clés |
| D3 dette | Waivers bancaires en CP ; chemin de mainlevée documenté ; cash pooling dénoué (arrêt des sweeps + révocation des mandats + solde réglé) | Pay-off letters et mainlevées préparées ; cash pooling cartographié pour le funds flow |
| D4 management | Packages et incentives recensés ; écart homme-clé → plan de transition + décision sponsor ; known issues social/fiscal → specific indemnity | Régulariser les non-competes ; provisionner/disclosér les contrôles en cours |
| D5 W&I | Known issues hors police → specific indemnity ; reliance letter vérifiée | VDD avec reliance calibrée ; fair disclosure pour maximiser la couverture police |

---

## Frontières propres

- **Cible cotée / AMF** → hors scope, anticipation v2.
- **Cible en difficulté** → les overlays `--pe` et distressed **s'empilent** : la
  doctrine distressed (période suspecte, nullités L.632-1/L.632-2, passif non purgé)
  reste dans `references/distressed-overlay-fr.md` et n'est pas redupliquée ici ; en
  amont, l'orientation share vs asset relève de `/h-da:asset-vs-share-distress`.
- **Docs fonds-only** (règlement / LPA / side letters FCPR/FPCI/SLP) → hors périmètre
  → `fonds-pe-fr-triage` (à venir — candidat #7).
- **Revue du SPA, de la GAP, du pacte, du closing** → skills dédiés (renvois
  ci-dessous) ; cet overlay produit des findings routés, pas la revue d'acte.
- **Chiffrage des price chips, du passif, des redressements** → jamais ici
  (`[à compléter]`, équipe financière / fiscaliste).
- **Fond fiscal / social** (requalification, chiffrage URSSAF, prix de transfert) →
  nommé et renvoyé, jamais traité.
- **Souscription / placement de la police W&I** → signalée et articulée seulement.

---

## Renvois

- Conversion des CP et leviers de prix dans l'acte : `/h-da:spa-review --pe --side=sponsor`.
- Matrice GAP / W&I / disclosure, specific indemnities : `/h-da:gap-review --pe`.
- Cartographie du management package de la cible : `/h-da:management-package-pe`.
- Pacte d'investissement post-acquisition : `/h-da:pacte-associes-review --pe`.
- Waivers, mainlevées, funds flow, assistance financière : `/h-da:closing-checklist-fr --pe`.
- Cible en difficulté (overlay complémentaire) : `references/distressed-overlay-fr.md` ;
  orientation share vs asset : `/h-da:asset-vs-share-distress`.
- Volet PI substantiel (titres, chaîne de droits, open source) : hors périmètre, orienter vers un spécialiste PI.
