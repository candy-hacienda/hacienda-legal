# Référence — Overlay Private Equity (« --pe ») pour checklist de closing LBO (side sponsor)

Module frère de `pe-overlay-fr.md`, chargé par `closing-checklist-fr` **uniquement** quand le
mode `--pe` est posé (ou accepté après auto-détection). Hors mode `--pe`, ignorer ce module :
la checklist de closing standard est inchangée.

> **Périmètre.** Cible le **closing d'une acquisition Private Equity** : sponsor agissant via
> BidCo/NewCo (LBO / MBO / build-up), jambe française (BidCo FR, cible FR, financement et closing
> régis par droit français). La doctrine est **side-aware** — centrée **sponsor (acquéreur)** ;
> side cédant ouvert mais secondaire.

> **Socle partagé — non redupliqué ici.** Gate France/Lux, glossaire PE FR praticien (~100 termes :
> sources & uses, funds flow, ECL/DCL, certain funds, equity ticket, escrow/holdback, closing bible,
> rollover, accession deed…) et anti-fabrication PE (requalif fiscale/sociale nommée/renvoyée ;
> no quantum ; assistance financière / léonine / gestion de fait en `[review]` ; instruments
> renvoyés ; dates relatives ; articles non vérifiés `[à vérifier]` ; docs Lux hors périmètre) :
> voir `references/pe-overlay-fr.md` — **non redupliqués ici**.

---

## Signaux de détection (pour la proposition auto, hors flag)

Mention de *funds flow* / *sources & uses* / *equity bridge* ; *ECL* / *DCL* / *certain funds* ;
*BidCo* / *NewCo* / *HoldCo* / *TopCo* ; *debt push-down* / *upstream guarantee* / *nantissement
de comptes-titres* ; *rollover* / *reinvest* / *accession deed* ; *escrow* / *holdback* /
*closing bible* ; *security package* / *intercreditor*.

Un seul signal sérieux suffit à **proposer** l'overlay.

---

## Axe L1 — Funds flow / sources & uses

### Ce que la checklist standard couvre déjà

Quittance de prix, instructions de virement, séquençage signing/closing, constitution de
l'escrow (volets documentation et séquençage de la checklist standard).

### Ce que l'overlay PE ajoute

Le closing LBO exige la production et la vérification d'un **tableau sources & uses** complet,
réconcilié ligne à ligne avant que le premier virement day-1 soit émis.

**Structure du tableau sources & uses :**

| Côté Sources | Côté Uses |
|---|---|
| Equity sponsor (apport ECL) | Prix d'acquisition SPA |
| Rollover managers (réinvestissement) | Refinancement dette existante cible |
| Dette senior / DCL (tirages) | Frais de transaction (conseil, audit, W&I prime) |
| Mezzanine / unitranche | Frais de mise en place de la dette |
| Vendor loan (si applicable) | Constitution escrow / holdback |
| Cash on balance sheet (cible) | BFR day-1 |

Montants : `[à compléter]` — le skill produit la **structure** (lignes), jamais les montants.

**Réconciliation parfaite :** Σ sources = Σ uses. Trois cohérences à vérifier :
- Le prix SPA est bien capturé comme ligne « use » (aucun écart avec la définition de prix du SPA).
- Les montants ECL et DCL tirés correspondent aux engagements documentés (term sheet / credit
  agreement `[à compléter]`).
- Le réinvestissement managers (rollover) figure côté sources ET, s'il est en cash-out puis
  reinvest, côté uses (rachat puis réinvestissement). C'est ici qu'aboutit le renvoi de
  `spa-review --pe` (Axe S5).

**Waterfall des virements day-1 :** décrire l'ordre séquentiel des flux, les comptes émetteurs
et récepteurs, et le timing intraday :

1. Tirage DCL sur compte BidCo (ouverture compte escrow si besoin).
2. Appel de l'ECL sponsor (virement sur compte BidCo).
3. Virement du prix d'acquisition aux vendeurs (compte notaire ou séquestre selon structure).
4. Déblocage de l'escrow / holdback selon conditions SPA.
5. Remboursement + mainlevée de la dette existante cible (concomitant au paiement vendeurs ou
   immédiatement après, selon intercreditor).
6. Virement des frais de transaction (conseils, prime W&I).
7. Constitution sûretés security package (voir L4).

> **Ne pas chiffrer** le funds flow : produire la **structure** du tableau (lignes), montants en
> `[à compléter]`. Semaines relatives pour tout délai.

---

## Axe L2 — CP financement & certain funds

### Ce que la checklist standard couvre déjà

Recensement des conditions préalables au closing, séquençage signing/closing, vérification que
les CP levées sont correctement documentées.

### Ce que l'overlay PE ajoute

L'axe L2 est le **pendant closing** de ce que `spa-review --pe` (Axe S2) lit dans le SPA :
là où S2 audite les clauses de financement et de certain funds dans l'acte, L2 séquence leur
exécution le jour J.

**Conditions de mise à disposition de la DCL (dette senior) :**
- Conditions précédents (CPs) documentaires de tirage : statuts BidCo à jour, mainlevées
  préalables, term sheet et credit agreement exécutés, sûretés préalables constituées.
- CP d'absence d'événement matériel adverse (MAC bancaire) : vérifier l'alignement avec la
  clause MAC du SPA — tout désalignement entre la définition de MAC bancaire et la définition
  de MAC SPA crée un **risque d'exécution** non couvert `[review]`.
- Tirage DCL ne peut pas précéder la levée des CP documentaires → ordonnancer précisément.

**Apport ECL (equity commitment letter) :**
- L'ECL est exécutable et l'engagement sponsor est ferme (`certain funds`) : vérifier que la
  letter est signée, que le délai d'appel n'est pas expiré, que les CP propres à l'ECL sont
  levées.
- Absence de condition suspensive résiduelle non levée côté sponsor qui bloquerait le closing.

**Certain funds :**
- La mécanique certain funds garantit que les prêteurs ne peuvent pas refuser de tirer sauf
  événements strictement listés : vérifier la liste limitative `[review]`.
- Si certain funds non respecté côté prêteur → risque de non-closing → escalader immédiatement
  (voir `[review]`).

**Alignement parfait CP SPA ↔ conditions de financement :** tout désalignement (CP levée côté
SPA mais pas côté banque, ou inversement) crée un gap d'exécution susceptible de bloquer le
closing. Renvoyer à `spa-review --pe` (Axe S2) sans rejouer son analyse ; l'objectif ici est
la vérification d'exécution le jour J.

---

## Axe L3 — Mécanique de closing LBO (day-1)

### Ce que la checklist standard couvre déjà

Distinction signing / closing, liste des actes à signer le jour du closing, gestion de la
période intercalaire (covenants, reps bring-down).

### Ce que l'overlay PE ajoute

Le closing LBO est une **chorégraphie multi-étages** : chaque étape conditionne la suivante.
Un désordre dans la séquence (sûretés constituées avant tirage, paiement vendeurs avant
capitalisation BidCo) peut invalider des actes ou déclencher un événement de défaut.

**Séquence canonique :**

1. **Capitalisation BidCo** : souscription des actions BidCo par le sponsor (equity ticket) et
   libération de l'apport en numéraire (ECL virée). Vérifier que BidCo est immatriculée,
   que ses statuts sont à jour, que les formalités de souscription sont réalisées.

2. **Tirage de la dette dans BidCo** : tirage DCL (et mezzanine / unitranche le cas échéant)
   sur le compte BidCo. Les CP de tirage (L2) doivent être levées avant ce tirage.

3. **Paiement du prix aux vendeurs** (funds flow L1) : virement du prix d'acquisition sur le
   compte désigné par les vendeurs (ou compte notaire / séquestre).

4. **Rollover managers / fondateurs** : deux modalités, vérifier laquelle est documentée :
   - *Share-for-share (apport en nature)* : les managers apportent leurs titres cible à BidCo
     en échange d'actions BidCo ; intervention d'un commissaire aux apports `[à vérifier]` ;
     valorisation à arrêter ; formalités d'apport en nature selon forme sociale BidCo.
   - *Cash-out puis reinvest* : les managers reçoivent le prix de leurs titres (paiement
     vendeurs), puis réinvestissent en souscrivant des actions BidCo dans la même séquence
     (ou immédiatement après) ; cohérence avec le régime fiscal d'apport `[à vérifier]`.
   - Cohérence avec `spa-review --pe` (Axe S4) et `pacte-associes-review --pe` (P1).

5. **Refinancement + mainlevées concomitantes dette existante cible** : remboursement de la
   dette bancaire existante de la cible (et de toute dette interco ou obligation convertible
   à rembourser au closing), concomitant au paiement vendeurs ou immédiatement après selon
   l'intercreditor agreement ; obtention des mainlevées de sûretés grevant les titres cédés
   et les actifs cible.

6. **Mise en place du security package** (voir L4) : constitution des sûretés en faveur des
   prêteurs LBO (nantissements de comptes-titres, créances intragroupe), concomitante au
   tirage ou immédiatement après selon l'intercreditor.

**Single-step vs split signing / closing :**
- En LBO certain funds, signing et closing sont le plus souvent **simultanés** (single-step) :
  pas de période intercalaire, les actes sont signés et les flux exécutés le même jour.
- Si split signing / closing : la période intercalaire court entre les deux dates ; les
  covenants SPA et les conditions de bring-down doivent être surveillés.

---

## Axe L4 — Security package & assistance financière

### Ce que la checklist standard couvre déjà

Mainlevées des sûretés grevant les titres cédés ; formalités d'opposabilité du transfert de
propriété des titres (L.228-1 C.com. `[Légifrance]` — déjà à l'index).

### Ce que l'overlay PE ajoute

**Security package des prêteurs LBO :** les prêteurs (senior / mezzanine / unitranche)
exigent un paquet de sûretés constitué au closing ou dans un délai convenu. Vérifier que
chaque sûreté est constituée, que les formalités d'opposabilité sont réalisées et que les
inscriptions sont effectuées dans les délais :

- **Nantissement de comptes-titres** : sur les actions de BidCo (en faveur des prêteurs LBO),
  et sur les actions de la cible détenues par BidCo — deux niveaux à ne pas confondre.
- **Nantissement de créances intragroupe** : créances de BidCo sur la cible (dividendes,
  interco) nantis en faveur des prêteurs.
- **Sûretés sur actifs de la cible** (le cas échéant) : nantissement fonds de commerce,
  hypothèques, cessions de créances professionnelles — voir impératif assistance financière
  ci-dessous avant de confirmer.

**🔴 Assistance financière — L.225-216 C.com. `[à vérifier]`.** Une société ne peut avancer des
fonds, consentir des prêts ni donner des sûretés en vue de la souscription ou de l'achat de ses
propres titres par un tiers. Conséquence directe en LBO : la **cible ne peut pas garantir ni
financer la dette d'acquisition** contractée par BidCo pour la racheter — ni sûretés sur ses
actifs (upstream guarantee), ni mise de sa trésorerie au service de la dette d'acquisition. Le
**debt push-down** et les **upstream guarantees** se heurtent à cette interdiction. Vérifier
qu'aucune sûreté/garantie remontante de la cible ne sécurise la dette d'acquisition. Le risque
est qualifié `[review]` ; **ne jamais valider un montage** ; renvoyer au montage fiscal/financier
spécialisé.

**Intérêt social / abus de biens sociaux.** Toute sûreté ou garantie remontante de la cible doit
répondre à un intérêt social propre `[review]`.

**Formalités d'opposabilité et délais :**
- Nantissement de comptes-titres : inscription auprès de l'établissement teneur de compte ;
  délais d'opposabilité aux tiers à surveiller.
- Cessions de créances Dailly : notification ou acceptation par le débiteur cédé selon usage.
- Inscription au registre des nantissements (greffe) pour les fonds de commerce.
- Délais à exprimer en **semaines relatives** à la date de closing (`[à compléter]`).

---

## Axe L5 — Adhésion rollover & post-closing PE

### Ce que la checklist standard couvre déjà

Registre de mouvements de titres de la cible, comptes d'associés, enregistrement de la
cession, information des tiers (salariés, partenaires contractuels si clause de changement de
contrôle).

### Ce que l'overlay PE ajoute

**Accession deed managers / fondateurs rollover :** les managers et fondateurs qui réinvestissent
doivent signer l'accession deed (adhésion au pacte d'associés BidCo / HoldCo) au closing ou
immédiatement après. Vérifier :
- Cohérence avec `spa-review --pe` (Axe S4 — conditions rollover dans le SPA) et
  `pacte-associes-review --pe` (P1 — structure du pacte d'investissement).
- Que toutes les parties rollover ont signé avant que les actions BidCo leur soient attribuées.
- Que les clauses leaver, non-compete et good/bad leaver du pacte sont applicables dès le closing.

**Registre de mouvements de titres à deux niveaux :** c'est le point le plus souvent oublié en
closing LBO. Il faut tenir le registre à **deux niveaux** :

- **Niveau BidCo (holding)** : souscriptions des actions BidCo par le sponsor (equity ticket),
  les co-investisseurs éventuels, et les managers rollover (apport en nature ou souscription
  cash après reinvest). Chaque mouvement doit figurer dans le registre de mouvements de titres
  de BidCo — **ne pas oublier ce niveau**.
- **Niveau cible** : transfert des titres de la cible aux vendeurs vers BidCo (virement de
  compte à compte, L.228-1 C.com. `[Légifrance]` — déjà à l'index).

**Inscription des nantissements de comptes-titres :** formalité d'opposabilité — vérifier que
l'inscription est réalisée et que le délai courant depuis la date de closing est respecté
(`[à compléter]` en semaines relatives).

**Closing bible PE :** constituer la closing bible avec l'ensemble des actes signés, les
justificatifs d'exécution des flux (ECL tirée, DCL tirée, price payment reçu par les vendeurs,
mainlevées obtenues, sûretés constituées et inscrites, accession deeds signées, funds flow
exécuté). La closing bible est la preuve d'exécution de l'opération.

**Enregistrement de la cession + régime fiscal d'apport du rollover :**
- Enregistrement du transfert de titres auprès des services fiscaux (droits d'enregistrement
  sur cession de titres) → délai et taux `[à vérifier]`, renvoi expert-comptable.
- Régime fiscal de l'apport en nature (share-for-share) ou du reinvest (cash-out puis
  souscription) → `[à vérifier]`, renvoi expert-comptable / spécialiste fiscal (hors périmètre de ce plugin). Ne jamais
  conclure sur le régime fiscal applicable sans vérification spécialisée.

---

## Lecture side-aware (sponsor / cédant)

| Axe | Sponsor / acquéreur (imposer / structurer) | Cédant sponsor (protéger / limiter) |
|---|---|---|
| L1 funds flow | Exiger la réconciliation Σsources = Σuses avant tout virement ; contrôler que le prix SPA est ligne use exacte ; piloter le waterfall day-1 | Vérifier que le virement prix est émis à la bonne séquence et au bon compte ; contrôler le déblocage escrow selon conditions SPA |
| L2 CP financement | Aligner CP SPA et conditions DCL/ECL ; vérifier certain funds ; lever toute CP résiduelle avant tirage | Obtenir confirmation écrite que les CP financement sont levées ; négocier reverse break fee si certain funds non respecté |
| L3 mécanique LBO | Piloter la séquence capitalisation → tirage → paiement → rollover → mainlevées → security package ; anticiper single-step | Contrôler que le prix est reçu avant toute mainlevée ou sûreté nouvelle ; obtenir confirmation des mainlevées |
| L4 security package | Constituer le security package complet dès closing ; vérifier formalités opposabilité ; ne jamais faire garantir la dette d'acquisition par la cible | S'assurer qu'aucune sûreté sur ses actifs ne sécurise la dette d'acquisition (assistance financière — risque `[review]`) |
| L5 post-closing | Obtenir accession deeds signées avant attributions ; tenir registres BidCo + cible ; constituer closing bible PE complète | Vérifier enregistrement cession et obligations fiscales rollover ; contrôler le régime fiscal de l'apport `[à vérifier]` |

---

## Frontières propres

- **Cible cotée / AMF** → hors scope, anticipation v2. Le volet offre publique et réglementation
  AMF n'est pas couvert par cet overlay.

- **Empilement `--distressed`** : si la cible est en difficulté, les overlays `--pe` et
  `--distressed` s'empilent sans se dupliquer. La doctrine distressed (période suspecte, nullités
  L.632-1/L.632-2) reste dans `references/distressed-overlay-fr.md`.

- **Docs fonds-only** (règlement / LPA / side letters d'un FCPR/FPCI/SLP) → hors périmètre de
  cet overlay → `fonds-pe-fr-triage` (à venir — candidat #7).

- **Analyse pacte d'investissement** (gouvernance, leaver, drag, liquidation preference, ratchet)
  → `/h-da:pacte-associes-review --pe`.

- **Revue SPA / GAP** (mécanisme de prix, MAC, W&I, rollover dans l'acte) →
  `/h-da:spa-review --pe` / `/h-da:gap-review --pe`.

- **Structuration et rédaction des instruments management package** (BSA, BSPCE, ADP, AGA, OC)
  → `/h-da:financement-startup`.

- **Assistance financière / debt push-down / upstream guarantees** : nommés et renvoyés dans
  cet overlay (L4), **jamais validés**. Renvoyer systématiquement au montage fiscal/financier
  spécialisé.

- **Régime fiscal** (apport rollover, intégration fiscale LBO, droits d'enregistrement) : nommé
  et renvoyé — `[à vérifier]`, renvoi expert-comptable / spécialiste fiscal (hors périmètre de ce plugin).

- **Gate France/Lux** (hérité du socle `pe-overlay-fr.md`) : si l'opération vise une entité ou
  des docs fonds luxembourgeois → STOP overlay, renvoi conseil luxembourgeois. L'overlay couvre
  la jambe FR (BidCo FR, cible FR, closing FR).

---

## Renvois

- Amont du deal — revue SPA / GAP PE : `/h-da:spa-review --pe` / `/h-da:gap-review --pe`.
- Pacte d'investissement (gouvernance, leaver, drag, accession) : `/h-da:pacte-associes-review --pe`.
- Instruments management package (BSA/BSPCE/ADP/AGA/OC) : `/h-da:financement-startup`.
- Cible en difficulté (overlay complémentaire) : `/h-da:asset-vs-share-distress` ;
  `references/distressed-overlay-fr.md` (overlays s'empilent sans se dupliquer).
- PI substantiel dans les contrats cible : hors périmètre, orienter vers un spécialiste PI.
