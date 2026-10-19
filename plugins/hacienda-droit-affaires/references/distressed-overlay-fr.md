# Référence — Overlay difficulté (« distressed ») pour revue SPA / GAP

Module partagé chargé par `spa-review` et `gap-review` **uniquement** quand le mode
`--distressed` est posé (ou accepté après auto-détection). Hors mode distressed, ignorer
ce module : la revue standard est inchangée.

> **Périmètre.** Cible **en difficulté mais pas encore à la barre** : pré-procédure,
> prévention amiable (mandat ad hoc / conciliation), ou montage **pre-pack**, où il
> existe un **SPA / une GAP privés** à relire. La doctrine est **side-aware** (lecture
> inversée acquéreur / cédant-débiteur).

## Gate d'application (vérifier avant d'exécuter l'overlay)

1. **Cible déjà en RJ/LJ avec appel d'offres ouvert** → ce n'est PAS une revue de SPA
   privé : l'acte est **judiciaire** (plan de cession, L.642 C.com.). **STOP overlay** →
   renvoi `/h-da:reprise-a-la-barre` (offre de reprise) ou `/h-da:cession-actifs-isoles`
   (actifs isolés). Ne pas relire un acte de cession judiciaire comme un SPA privé.
2. **Cible pas réellement en difficulté** → pas d'overlay ; revue standard.
3. **Amont** : si l'orientation share vs asset / l'exposition repreneur n'a pas été
   posée, renvoyer `/h-da:asset-vs-share-distress` ; l'overlay **revoit les clauses**, il
   ne refait pas l'orientation.

## Signaux de détection (pour la proposition auto, hors flag)

Mention de procédure collective / mandataire / conciliation / mandat ad hoc ; cessation
des paiements ou capitaux propres négatifs ; prix symbolique (« 1 € ») ou « prix + reprise
de passif » ; earn-out de sauvetage ; déclaration de créance ; cédant en perte continue ;
sûretés récentes consenties pour des dettes antérieures ; condition suspensive « absence
de procédure ». Un seul signal sérieux suffit à **proposer** l'overlay.

## Axe D1 — Période suspecte / nullités (L.632-1, L.632-2 C.com.)

Si une procédure collective est ouverte après le deal, le tribunal fixe une **date de
cessation des paiements** rétroactive (jusqu'à **18 mois** avant le jugement) : la
**période suspecte** s'étend de cette date au jugement. Les actes passés pendant cette
période sont attaquables.

- **L.632-1 — nullités de DROIT** `[Légifrance]` (le juge constate, pas d'appréciation) :
  actes à titre gratuit translatifs ; contrats déséquilibrés (obligations du débiteur
  excédant notablement celles de l'autre partie) ; paiements de dettes **non échues** ;
  paiements par modes anormaux ; sûretés consenties pour des **dettes antérieurement
  contractées** ; etc.
- **L.632-2 — nullités FACULTATIVES** `[Légifrance]` : paiements de dettes échues et actes
  à titre onéreux, **annulables si** le cocontractant **connaissait** la cessation des
  paiements. La connaissance se prouve.

**Conséquence revue** : flaguer le **timing** (le deal tombe-t-il dans une période suspecte
possible ?) et les clauses exposées (prix anormalement bas, paiement préférentiel d'un
créancier, sûreté pour dette antérieure). Côté **acquéreur** : risque que la cession soit
**annulée** → exiger des protections (déclaration du cédant sur l'absence de cessation des
paiements, indemnisation spécifique, séquestre). Côté **cédant/débiteur** : le deal **sera
attaqué** si une procédure s'ouvre → documenter l'équilibre du prix.

> **Ne pas dater** la cessation des paiements ni la période suspecte (semaines relatives ;
> la date est **fixée par le tribunal**, rétroactive). **Ne pas conclure** à la nullité :
> qualifier le **risque** `[review]` (conditions L.632-1/2 + connaissance pour L.632-2).

## Axe D2 — Passif non purgé (share deal) → GAP centrale

Un **share deal** (cession de titres) d'une société en difficulté **n'apure aucun passif** :
l'acquéreur hérite de **toutes** les dettes et de tous les litiges (commerciaux, fiscaux,
sociaux, environnementaux), des procédures en cours et des passifs latents. La **GAP** n'est
donc pas accessoire : elle est la **protection centrale** du repreneur. Vérifier que la GAP
couvre explicitement les passifs **antérieurs non révélés** et les conséquences d'une
procédure future. (Un **asset deal** purge davantage mais transfère d'autres charges — voir
D4 ; l'arbitrage share vs asset relève de `asset-vs-share-distress`, en amont.)

## Axe D3 — Garantie de la garantie (cédant insolvable)

Une GAP **ne vaut que ce que vaut le garant**. Face à un cédant en difficulté, une GAP
nue est **illusoire** : à l'appel en garantie, le cédant sera insolvable. Exiger une
**garantie de la garantie** :
- **séquestre** d'une fraction du prix (escrow) sur compte bloqué ;
- **garantie autonome à première demande (GAPD)** ou **caution bancaire** ;
- durée et montant calibrés sur les passifs latents (fiscal/social/environnemental :
  exposition longue).

Côté **acquéreur** : sans garantie de la garantie, traiter la GAP comme **🔴** (protection
théorique). Côté **cédant/débiteur** : anticiper que l'acquéreur l'exigera ; elle immobilise
de la trésorerie.

## Axe D4 — Transferts & solidarités (cross-link — ne pas re-traiter au fond)

L'overlay **signale** et **renvoie** ; il ne refait pas l'analyse de fond des axes déjà
couverts par les revues standard :
- **L.1224-1 C. trav.** — transfert **automatique** des contrats de travail en cas de
  transfert d'entité économique autonome (asset deal / fonds) : le passif social suit. (Axe
  social de `gap-review` / renvoi conseil social.)
- **Solidarité fiscale** — **L.1684 CGI** (cession de fonds de commerce : solidarité de
  l'acquéreur pour certains impôts du cédant) ; **L.267 LPF** (solidarité du dirigeant).
  Nommer, **aucun conseil fiscal au fond** → renvoi.
- **Passif environnemental ICPE** — installations classées : obligations de remise en état,
  exécution d'office (art. L.171-8 C. env.). Renvoi à l'axe environnement de `gap-review`.

## Axe D5 — MAC & conditions suspensives spécifiques

Entre signing et closing, une cible fragile peut **basculer en cessation des paiements**.
Rendre critiques :
- une clause **MAC** visant explicitement l'aggravation financière / l'ouverture d'une
  procédure ;
- une **condition suspensive « absence d'état de cessation des paiements / d'ouverture
  d'une procédure »** au closing ;
- un **mécanisme de prix** protégé contre la dégradation (ajustement, earn-out, prix sous
  condition).

## Lecture side-aware (synthèse)

| Axe | Acquéreur (se protéger) | Cédant / débiteur (anticiper) |
|---|---|---|
| D1 nullités | déclaration CdP + indemnisation + séquestre | le deal sera attaqué ; équilibrer le prix |
| D2 passif | GAP centrale, couvre l'antérieur | divulguer ; le prix reflète le passif |
| D3 garantie | exiger séquestre/GAPD, sinon 🔴 | trésorerie immobilisée |
| D4 transferts | auditer social/fiscal/ICPE | solidarités résiduelles |
| D5 MAC/CS | MAC + CS absence de procédure | risque de caducité |

## Anti-fabrication (rappel)

Dates en **semaines relatives** (jamais la date de cessation des paiements) ; **pas de
quantum** de passif ni d'exposition nullité (`[à compléter]`, réclamer l'état du passif) ;
nullité = **risque qualifié `[review]`**, jamais conclusion ; responsabilité du dirigeant
**nommée et renvoyée** (`/h-da:responsabilite-dirigeant`), jamais évaluée ici.

## Renvois

- Amont orientation : `/h-da:asset-vs-share-distress`.
- Barre (cible déjà en procédure) : `/h-da:reprise-a-la-barre`, `/h-da:cession-actifs-isoles`.
- Montage confidentiel amont : `/h-da:pre-pack-cession`.
- Exposition dirigeant cédant : `/h-da:responsabilite-dirigeant`.
