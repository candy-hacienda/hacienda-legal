# Référence — Management package Private Equity (« management-package-pe »), side-aware sponsor | manager

Module frère de `pe-overlay-fr.md`, chargé par `management-package-pe` **uniquement** quand le
contexte management package est détecté (flag posé ou accepté après auto-détection). Hors ce
contexte, ignorer ce module : les autres skills PE restent inchangés.

> **Périmètre.** Management package d'une opération PE/LBO, **jambe française** (instruments
> émis par société FR, managers FR). Doctrine **side-aware sponsor | manager** : les deux
> perspectives sont développées dans chaque axe. Le manager avec rollover n'est pas un fondateur ;
> le sponsor n'est pas un investisseur lambda.

> **Socle partagé — non redupliqué ici.** Gate France/Lux, glossaire PE FR praticien
> (~100 termes : sweet equity, envy ratio, ratchet, hurdle, vesting, leaver, rollover,
> accession deed…), anti-fabrication PE (requalification fiscale/sociale nommée/renvoyée ;
> no quantum ; léonine / gestion de fait en `[review]` ; instruments renvoyés ;
> dates relatives ; articles non vérifiés `[à vérifier]` ; docs Lux hors périmètre) :
> voir `references/pe-overlay-fr.md` — **non redupliqués ici**.

---

## Signaux de détection (pour la proposition auto, hors flag)

Mention de *management package* / *MEP* / *sweet equity* / *envy ratio* / *ratchet* /
*hurdle* ; *good/bad/early/intermediate leaver* / *leaver price* / *vesting* /
*reverse vesting* ; *subscription agreement* / *promesse put/call* / *rollover managers* /
*BSPCE* / *AGA* / *BSA* / *ADP* / *OC* / *OCA*.

Un seul signal sérieux suffit à **proposer** le module.

---

## Axe M1 — Cartographie du package & « qui signe quoi » ⭐

### Enjeu

Dans un deal PE/LBO, un manager participant au management package signe en moyenne quatre à cinq
documents distincts. La cartographie complète de ces documents — et de leur articulation — est le
préalable à toute analyse sérieuse du package. Rater un document ou une signature manquante, c'est
exposer le manager (ou le sponsor) à un droit ou à une obligation non opposable.

### Documents constitutifs du management package

**Subscription agreement (accord de souscription).** Acte par lequel le manager souscrit les
instruments du sweet equity (BSA, ADP, actions ordinaires de classe B/C, OC/OCA selon structure).
Fixe le prix de souscription, les conditions de libération, et les déclarations du manager sur sa
qualité. C'est l'acte fondateur de l'entrée du manager dans le capital de BidCo/HoldCo.

**Pacte d'investissement / pacte management.** Accord entre le sponsor, les co-investisseurs et
les managers. Régit la gouvernance (reserved matters, board), les restrictions de transfert
(lock-up, inaliénabilité), les mécanismes de liquidité (drag/tag, put/call), les clauses leaver
et good/bad leaver, et le ratchet MEP. C'est le document-pivot : il lie et hiérarchise les autres.
La précédence entre le pacte d'investissement et le pacte existant entre associés est un point
critique `[review]` — voir renvoi à `pacte-associes-review --pe`.

**Promesses croisées put/call (ou BSP/BCE).** Promesses de vente (put manager → sponsor) et
d'achat (call sponsor → manager) portant sur les instruments du sweet equity, activées dans les
scénarios de leaver, de liquidité ou de sortie sponsor. La validité et la force obligatoire des
promesses (art. 1124 C.civ `[à vérifier]`) et leur cohérence avec les clauses d'inaliénabilité
statutaires (L.227-13 C.com. `[à vérifier]`) doivent être vérifiées.

**Terms des instruments (term sheet / conditions d'émission).** Document décrivant les droits
économiques et politiques attachés à chaque instrument émis (ADP, BSA, OC/OCA) : droits
préférentiels, droits de vote, rang de liquidation, conditions de conversion ou d'exercice.
La mécanique d'émission est renvoyée à `financement-startup`.

**Contrat de travail et/ou mandat social.** Le manager cumule souvent salarié (contrat de travail
cible) et mandataire social (président ou DG de BidCo ou de la cible). Le management package est
distinct du contrat de travail, mais des liens entre les deux — rémunération, non-concurrence,
conditions de départ — créent des zones de friction. La non-concurrence salariée requiert une
contrepartie financière obligatoire en droit FR `[à vérifier]` ; la non-concurrence d'associé est
libre. La non-concurrence du mandataire social a un régime intermédiaire `[à vérifier]`.

**Side letters / lettres d'engagement personnelles.** Engagements particuliers du sponsor envers
un manager (garanties de liquidité, protection asymétrique, droits d'information renforcés) ou
du manager envers le sponsor (investissement personnel garanti, non-concurrence renforcée).
Souvent non divulguées aux co-managers — vérifier la clause MFN du pacte.

**Rollover SPA / accession deed.** Si le manager cède des titres de la cible au closing et
réinvestit dans BidCo/HoldCo, il est partie au SPA (en qualité de vendeur, même partiel) et
signe une accession deed (adhésion au pacte d'investissement). L'articulation entre le SPA
(`spa-review --pe` Axe S4) et le pacte (`pacte-associes-review --pe` Axe P1) est ici centrale.

### Matrice signataires type

| Document | Sponsor | Manager(s) | Co-investisseurs | BidCo/HoldCo |
|---|---|---|---|---|
| Subscription agreement | — (souvent via BidCo) | ✓ souscripteur | ✓ si co-invest | ✓ émettrice |
| Pacte d'investissement | ✓ | ✓ | ✓ si prévu | ✓ party |
| Promesses put/call | ✓ promettant call | ✓ promettant put | — | — |
| Terms instruments (ADP/BSA) | — | ✓ souscripteur | — | ✓ émettrice |
| Contrat de travail / mandat | — | ✓ | — | ✓ ou cible |
| Side letter | ✓ | ✓ (certains) | — | — |
| Accession deed | — | ✓ rollovers | ✓ | ✓ |
| SPA (rollover) | ✓ acquéreur | ✓ si vendeur | — | — |

> **Précédence inter-documents.** En cas de conflit entre le pacte d'investissement et le
> subscription agreement, ou entre le pacte et les statuts, la clause de précédence du pacte
> d'investissement doit primer expressément ; en son absence, l'ambiguïté est un risque `[review]`.
> La **matrice fine de précédence** — rang statuts/pacte/SPA/instruments — est renvoyée à
> `pacte-associes-review --pe` (Axe P1). Ce module cartographie ; il ne tranche pas.

---

## Axe M2 — Instruments & economics : nommer + expliquer, jamais valoriser

### Instruments du management package

**Sweet equity (sens générique).** Désigne l'ensemble des titres émis aux managers dans un
contexte PE/LBO, conçus pour leur offrir un upside économique asymétrique (disproportionné
par rapport à leur investissement initial) si la performance de l'entreprise atteint les
objectifs cibles. Le sweet equity peut être structuré via plusieurs véhicules :

**Ordinary shares (actions ordinaires de classe B/C).** Actions avec droits économiques
différenciés (pas de droit de vote renforcé ou droit de vote aménagé selon statuts). Structure
simple, souvent la plus exposée fiscalement faute de risque réel d'investissement `[à vérifier]`.

**ADP (actions de préférence, L.228-11 C.com. `[à vérifier]`).** Actions dotées de droits
particuliers (économiques, politiques, ou les deux). En contexte MEP, les ADP peuvent prévoir
une liquidation preference, un droit à dividende prioritaire, ou un mécanisme de conversion
conditionnel. L'émission d'ADP nécessite une AGE et, si les droits accordés sont substantiels,
un rapport de commissaire aux avantages particuliers `[à vérifier]`. Mécanique d'émission
renvoyée à `financement-startup`.

**BSA (bons de souscription d'actions).** Droits d'accès au capital à un prix d'exercice fixé
à l'émission, valables sur une durée déterminée. Le BSA est un instrument autonome (valeur
temps + valeur intrinsèque) qui peut être cédé séparément des actions sous-jacentes, sauf
clause d'inaliénabilité. Régime civil/fiscal à vérifier selon les conditions de souscription
et d'exercice `[à vérifier]`. Mécanique renvoyée à `financement-startup`.

**BSPCE (bons de souscription de parts de créateur d'entreprise, CGI `[à vérifier]`).** Régime
fiscal dérogatoire réservé aux sociétés de moins de quinze ans `[à vérifier]`, non cotées,
soumises à l'IS, dont le capital est détenu à au moins 25% par des personnes physiques `[à
vérifier]`. L'entrée d'un fonds PE au capital peut faire perdre l'éligibilité aux BSPCE si la
détention de personnes morales dépasse le seuil légal `[à vérifier]`. Régime fiscal des gains
sur BSPCE : renvoi systématique au fiscaliste.

**AGA (actions gratuites, L.225-197-1 C.com. `[à vérifier]`).** Attribution gratuite d'actions
existantes ou à émettre, soumise à un plan approuvé par l'AGE et à des conditions d'acquisition
et de conservation `[à vérifier]`. Régime social et fiscal spécifique : renvoi fiscaliste/
socialiste. Compatibilité avec une structure PE/LBO (société holding) à vérifier `[à vérifier]`.

**OC / OCA (obligations convertibles / obligations convertibles en actions).** Instrument de
dette/capitaux propres hybride émis au profit du manager (ou du fonds), donnant un droit de
conversion en actions à un prix fixé. L'OCA peut inclure un mécanisme d'accélération ou de
remboursement anticipé. Mécanique d'émission et fiscalité renvoyées à `financement-startup`.

**Options (stock options, L.225-177 C.com. `[à vérifier]`).** Options d'achat sur actions
existantes ou à émettre. Plan d'options subordonné à une AGE `[à vérifier]`. Régime social/fiscal
des gains d'options : renvoi fiscaliste/socialiste.

### Economics à connaître et expliquer

**Envy ratio.** L'envy ratio rapporte le multiple d'investissement du sponsor à celui des
managers, en tenant compte de la part du capital acquise pour un investissement donné. Exemple schématique (chiffres fictifs) : si le sponsor investit 10 pour obtenir 40% du capital
et que le manager investit 1 pour obtenir 5% du capital, l'envy ratio mesure l'asymétrie de ces
economics. Un envy ratio
élevé favorise le manager (qui obtient une part de valeur supérieure à sa mise proportionnelle) ;
un envy ratio faible signale un upside très limité pour le manager après récupération de la
liquidation preference. **Mal compris ou mal expliqué, l'envy ratio est une source récurrente
de contentieux** post-closing entre sponsor et managers : le manager découvre à la sortie que
son upside est quasi-nul après la cascade de distribution. Ce module l'explique ; il ne le
chiffre pas `[à compléter — calcul sur scénario fictif sponsor-side]`. Pour être interprétable,
la question-list fait **définir explicitement** le numérateur (multiple d'investissement du
sponsor), le dénominateur (multiple du manager) et la **base retenue** (capital émis ou fully
diluted) ; sans ces trois éléments, un envy ratio annoncé n'est pas exploitable `[à compléter]`.

**Ratchet.** Mécanisme d'ajustement de la participation du manager (ou du sponsor) selon la
performance atteinte à la sortie. Deux sens à ne pas confondre :

- *Ratchet MEP (management ratchet)* : la quote-part du manager dans le capital effectif ou
  dans les produits de sortie augmente (relution) si le TRI ou le multiple du sponsor dépasse
  des seuils (hurdles). Exemple de logique : en dessous du hurdle 1, le manager reçoit sa
  quote-part de base ; au-delà du hurdle 2, il reçoit une quote-part majorée. La formule est
  contractuellement déterminée dans le pacte ou dans les terms des instruments.
- *Ratchet sponsor / anti-dilutif* : protection du sponsor contre la dilution (ajustement du
  prix de conversion ou du nombre d'actions en cas d'émission ultérieure à prix inférieur).

La formule du ratchet doit être lue sur au moins un scénario de sortie fictif pour vérifier
l'arithmétique — une formule mal rédigée produit une économie non conforme à l'intention des
parties. Ce module nomme la mécanique ; le calcul concret est renvoyé au conseil financier. La
question-list fait préciser les paramètres structurants du ratchet : caractère **marginal ou
rétroactif** (le franchissement d'un seuil ne majore-t-il que la tranche au-delà, ou recalcule-t-il
toute la quote-part ?), **ordre et nombre des seuils** (hurdles), existence d'un **plafond** (cap),
**effet dilutif** sur les autres porteurs, et **traitement des départs** (un leaver conserve-t-il le
bénéfice du ratchet déjà acquis ?) `[à compléter]`.

**Hurdle.** Seuil de performance (TRI ou multiple d'investissement) que le sponsor doit
atteindre avant que le ratchet management soit déclenché, ou avant que l'équipe de gestion
perçoive le carried interest (dans la logique fonds). En contexte MEP, le hurdle est le seuil
à partir duquel l'upside du manager devient significatif.

**Vesting / reverse vesting.** Le *vesting* est l'acquisition progressive des droits sur les
instruments du sweet equity selon un calendrier (temps, jalons de performance, événement). Le
*reverse vesting* est l'image miroir : en cas de départ avant terme, les instruments non vestés
font l'objet d'un rachat forcé (par le sponsor ou BidCo) à un prix convenu (nominal, prix
d'entrée, ou FMV selon les cas). La durée du vesting et les jalons sont contractuels et doivent
être exprimés en semaines/mois relatifs à la date d'entrée `[à compléter]`.

**Fully diluted / dilution.** La base de calcul du pourcentage du manager doit être précisée :
sur capital émis, ou sur base fully diluted (incluant BSA, BSPCE, AGA, OC non encore exercés/
convertis). En cas de base fully diluted, la part effective du manager à la sortie peut être
inférieure à sa part nominale à l'entrée. Ce point est structurant pour l'envy ratio réel.

**Exit proceeds / waterfall de distribution.** L'ordre de distribution des produits de sortie
(trade sale, secondary, IPO) détermine ce que le manager perçoit in fine. La liquidation
preference du sponsor est servie en premier ; l'upside résiduel est ensuite distribué selon la
clause de participating/non-participating et le ratchet. La structure du waterfall est dans le
pacte d'investissement — renvoi à `pacte-associes-review --pe` (Axe P3/P5).

> **Interdit.** Ce module n'est pas autorisé à chiffrer un envy ratio, valoriser un instrument,
> calculer un TRI, ni à conclure sur la valeur d'un package. La mécanique d'émission des
> instruments est renvoyée à `financement-startup`.

---

## Axe M3 — Leaver / vesting / liquidité : nommer + signaler le confiscatoire

### Cartographie des catégories leaver

**Good leaver.** Catégorie favorable : départ non fautif, non choisi, ou reconnu comme légitime.
Inclut classiquement : décès, invalidité permanente `[à vérifier selon contrat]`, départ à la
retraite, révocation sans cause réelle et sérieuse (si salarié), révocation sans juste motif
(si mandataire). Le manager good leaver reçoit généralement le *leaver price* le plus favorable
(FMV, prix d'entrée, ou 1843-4 C.civ `[à vérifier]`). La liste est contractuelle et doit être
exhaustive : une catégorie absente de la définition tombe par défaut dans bad leaver `[review]`.

**Bad leaver.** Catégorie défavorable : départ fautif, concurrent, ou violation d'obligations
essentielles (non-concurrence, exclusivité, confidentialité). Inclut classiquement : démission
(sauf si prévue comme neutral), révocation pour faute grave/lourde, exercice d'une activité
concurrente, violation du pacte. Le manager bad leaver est soumis au leaver price le plus bas,
souvent la valeur nominale ou le prix d'entrée avec décote. C'est ici que se concentre le
**risque de clause confiscatoire** (voir ci-dessous).

**Early leaver.** Catégorie intermédiaire : départ avant un premier jalon de vesting ou avant
une période minimale de présence. Évite le binaire trop brutal good/bad pour les départs précoces
qui ne sont pas fautifs mais qui ne répondent pas non plus à la définition de good leaver.
Le leaver price intermédiaire (entre nominal et FMV) est fréquent.

**Intermediate leaver.** Catégorie intermédiaire entre early et good/bad, correspondant aux
départs survenus entre deux jalons de vesting. Certains pactes prévoient des prix progressifs
selon l'ancienneté ou la proportion de vesting accompli.

> **Quand une catégorie manque.** Si le pacte se limite à une définition binaire (ou ne définit
> qu'un bad leaver extensif), le skill **signale l'absence** de graduation et **propose, comme
> point à négocier** `[review]`, une structuration en catégories objectives good / bad / early /
> intermediate, chacune avec sa **règle de prix** (FMV / décote / nominal) et son **traitement du
> vesting** (acquis conservé ou non). Le skill propose la structure à négocier ; il ne tranche pas
> la licéité d'une clause (renvoi `pacte-associes-review --pe`).

### Leaver price (prix de rachat)

Le leaver price est la valeur à laquelle les instruments du manager sont rachetés lors d'un
départ leaver. Sa détermination est un point majeur de négociation :

- **FMV (fair market value) / valeur de marché.** Valeur d'expert ou valeur déterminée selon
  une formule convenue (multiple d'EBITDA, actualisation des flux). En l'absence d'accord sur
  la valeur, l'expert indépendant de l'art. 1843-4 C.civ `[à vérifier]` peut être désigné.
- **Prix nominal.** Prix facial des actions — peut être très inférieur à la valeur économique
  réelle, en particulier si la société a créé de la valeur depuis l'entrée du manager.
- **Prix d'entrée / prix de souscription.** Prix payé à l'entrée, sans indexation sur la
  performance. Avantage pour le sponsor dans les premières années.
- **Prix avec décote.** Décote sur FMV `[à compléter selon pacte]`, appliquée sur le bad
  leaver pour refléter la sanction contractuelle.

### 🔴 Risque de clause confiscatoire : bad leaver à prix nominal trop large

**Pattern dangereux :** un pacte qui définit le bad leaver de façon trop extensive (incluant
la démission, sans distinguer les circonstances) et impose un rachat à valeur nominale confisque
économiquement le manager qui a contribué à la création de valeur. Ce pattern peut être
constitutif d'une **clause confiscatoire** au sens de la jurisprudence française `[review]`.

La jurisprudence (Cour de cassation ch. com., affaires leaver `[à vérifier]`) admet que la
clause de rachat à valeur nominale est licite si le prix est proportionné au risque que le manager
fait courir à la société et si la définition de bad leaver est précise et limitée. En revanche,
une définition extensive et un prix nominal systématique — sans graduation ni proportionnalité —
exposent le sponsor à une action en nullité ou en révision judiciaire `[review]`.

**Ce module signale le pattern, ne le qualifie pas.** La **revue clause-par-clause** (triage
🟢/🟡/🟠/🔴) est renvoyée à `pacte-associes-review --pe` (Axe P4).

### Autres mécanismes de liquidité

**Drag (clause d'entraînement).** Le sponsor peut forcer les managers à céder leurs titres en
même temps que lui, aux mêmes conditions (en principe). Vérifier : seuil de prix minimum, égalité
des conditions, garanties imposées aux managers entraînés. Renvoi à `pacte-associes-review --pe`
(Axe P5) pour la revue complète du drag.

**Tag (clause de sortie conjointe).** Le manager peut exiger de sortir aux mêmes conditions
que le sponsor lors d'une cession de contrôle. Droit protecteur pour le manager — vérifier qu'il
est bien stipulé et qu'il n'est pas assorti de conditions trop restrictives `[review]`.

**Put/call.** Promesses de vente (put manager) et d'achat (call sponsor) permettant une
liquidité organisée hors cession globale. Le prix du put manager et le prix du call sponsor
peuvent diverger : asymétrie à surveiller. La validité des promesses croisées (cohérence avec
inaliénabilité statutaire) est un point `[review]`.

**Lock-up.** Période d'inaliénabilité des instruments du manager. Durée typique : plusieurs
années relatives à la date d'entrée `[à compléter]`. Vérifier les conditions de sortie anticipée
(CoC, IPO, départ involontaire).

### Points d'attention side-aware

**Côté sponsor :**
- *Rétention.* Le package doit être suffisamment incitatif pour retenir les managers clés sur
  toute la durée de détention. Un leaver price trop défavorable trop tôt peut décourager sans
  retenir (`[review]` économique, pas juridique).
- *Alignement.* L'envy ratio et le ratchet doivent aligner les intérêts des managers sur le TRI
  du sponsor — pas sur l'activité courante, mais sur la valeur à la sortie.
- *Anti-confiscatoire maîtrisé.* Une clause confiscatoire non calibrée expose le sponsor à un
  risque contentieux sérieux ; mieux vaut une clause bad leaver précise et proportionnée.
- *Leakage.* Vérifier que le rachat leaver ne constitue pas un leakage interdit (distributions
  non autorisées avant closing dans une structure locked box, ou violations de covenant bancaire
  dans la phase de détention LBO).

**Côté manager :**
- *Bad leaver à prix nominal trop large.* C'est la menace principale. Une démission forcée par
  un désaccord de gouvernance peut déclencher un bad leaver à nominal — perte totale de l'upside.
- *Dilution.* Vérifier la base de calcul (fully diluted) et l'impact des émissions futures sur
  le pourcentage effectif.
- *Accès à la liquidité.* Le manager doit avoir un chemin de liquidité réaliste : put à FMV post
  lock-up, ou participation garantie au drag. Un manager sans liquidité pendant tout le cycle
  LBO supporte un risque d'investissement illiquide sans garantie de retour.
- *Exposition personnelle.* Le manager peut être contraint de donner des garanties personnelles
  dans le cadre du drag ou du SPA (côté vendeur) — vérifier le périmètre et le plafond.

---

## Axe M4 — STOP fiscal/social 🔴 (ligne rouge)

### Doctrine du STOP

L'axe M4 est la **ligne rouge** du management package. Les gains réalisés par les managers sur
le sweet equity peuvent, selon les circonstances, être requalifiés par l'administration fiscale
ou les organismes sociaux en **salaires, avantages en nature, ou revenus professionnels**
(soumis à cotisations sociales et imposés à l'IR selon le barème progressif, et non en
plus-values mobilières). Cette requalification est une menace majeure pour le manager (qui
perd l'avantage fiscal du régime plus-values) et pour la société (qui encourt un rappel de
cotisations sociales patronales).

**Ce module nomme le risque. Il ne le qualifie pas. Il ne calcule rien. Il ne conclut pas.**

### Facteurs de question (pourquoi le risque existe)

Le risque de requalification est alimenté par plusieurs facteurs, chacun devant être posé
comme une question ouverte au spécialiste fiscal/social :

**1. Prix d'entrée déconnecté de la valeur économique réelle.** Si les managers souscrivent
les instruments à un prix très inférieur à leur valeur économique — sans que la différence soit
justifiée par un risque réel d'investissement ou une prime de risque documentée — l'avantage
peut être requalifié en avantage salarié `[à vérifier]`. La question : le prix de souscription
est-il cohérent avec une valorisation indépendante, ou est-il symbiotique du montant du salaire ?

**2. Gain peu ou pas aléatoire.** Le régime des plus-values suppose un risque en capital réel.
Si la structure garantit au manager un rendement minimum quel que soit la performance (floor,
garantie de rachat à prix plancher supérieur au prix d'entrée), l'aléa est absent — condition
nécessaire à la qualification en plus-value `[à vérifier]`. La question : le manager supporte-t-il
un risque réel de perte en capital ?

**3. Lien étroit avec le contrat de travail ou le mandat social.** Si le management package
est conditionné à la présence du manager dans l'entreprise (vesting lié à la présence), si le
leaver annule ou réduit drastiquement le package, si les critères de performance retenus pour
le ratchet sont des indicateurs opérationnels liés à l'activité du manager en tant que salarié/
mandataire, le lien rémunératoire peut être requalifié `[à vérifier]`. La question : le package
est-il structuré comme un investissement indépendant, ou comme un complément de rémunération
conditionnel à la présence ?

**4. Abus de droit.** Si le montage est exclusivement motivé par l'optimisation fiscale — sans
substance économique propre, sans risque réel de perte, sans prix de marché à l'entrée — le
risque de remise en cause pour abus de droit au sens de l'art. L.64 LPF `[à vérifier]` est
présent. La question : le montage a-t-il une substance économique justifiable indépendamment
de l'économie fiscale générée ?

### Interdits explicites (hard guardrail M4)

- **Qualifier le régime fiscal applicable** (plus-value, salaire, BNC, avantage en nature) : interdit.
- **Calculer des cotisations sociales** (patronales, salariales) : interdit.
- **Conclure à la (non-)requalification** : interdit.
- **Chiffrer un gain net fiscal** ou une économie d'impôt : interdit.
- **Conseiller un montage** pour éviter la requalification : interdit.

**Le danger est posé comme question, jamais résolu.**

### Renvoi systématique

Toute question fiscale ou sociale soulevée dans l'analyse du management package doit être
renvoyée à un **fiscaliste spécialisé en management package PE** et/ou à un **avocat en
droit social**. Ce renvoi est obligatoire, non optionnel. Il est mentionné explicitement dans
la note du relecteur produite par le skill.

---

## Axe M5 — Question-list fiscal/social + matrice de renvois ⭐ (livrable cœur)

### Gabarit de question-list structurée

La question-list est l'artefact central du skill `management-package-pe`. Elle est structurée
en **matrice instrument × event × manager**, chaque cellule produisant une question à poser
au spécialiste fiscal/social. Ce module fournit le gabarit ; les réponses sont hors périmètre.

> **Lecture de la matrice.** Cette matrice est **instanciée par manager** : chaque manager
> participant au package fait l'objet d'une passe distincte. La lecture est **side-aware
> (sponsor | manager)** — le côté détermine le cadrage de chaque question (rapprocher des
> points d'attention sponsor/manager de l'Axe M3).

#### Matrice instrument × event : questions à poser

| Instrument | Entrée (souscription) | Vesting (acquisition des droits) | Leaver (départ) | Exit (cession/sortie) |
|---|---|---|---|---|
| **Ordinary shares** | Le prix de souscription est-il documenté à valeur de marché ? Rapport d'expert à l'appui ? Risque de requalification en avantage en nature `[à vérifier]` ? | Absence de vesting typique — la question ne se pose pas, mais vérifier si des conditions de maintien existent. | Rachat à nominal : qualification du gain/perte ? Traitement fiscal du différentiel entrée/rachat `[à vérifier]` ? | Les plus-values relèvent-elles du régime PFU, du barème progressif, ou d'un autre régime `[à vérifier]` ? Y a-t-il un risque de requalification si l'aléa est absent ? |
| **ADP** | Les droits attachés à l'ADP créent-ils un avantage à l'émission (dividende prioritaire garanti) susceptible d'être requalifié `[à vérifier]` ? Les formalités AGE sont-elles accomplies ? | — | Prix de rachat des ADP en cas de leaver : indexé sur quoi ? Traitement fiscal de la décote ou de la plus-value `[à vérifier]` ? | Conversion en actions ordinaires avant exit : incidence fiscale `[à vérifier]` ? Régime des plus-values sur ADP après conversion ? |
| **BSA** | La valeur des BSA à l'émission est-elle justifiée (rapport de valorisation) ? L'avantage lié au prix d'exercice inférieur à la valeur de marché est-il qualifié `[à vérifier]` ? | L'exercice du BSA déclenche-t-il un fait générateur fiscal `[à vérifier]` ? Traitement de la levée et de la souscription des actions sous-jacentes ? | BSA non exercés : perte en capital déductible `[à vérifier]` ? BSA cédés : régime de la plus-value sur valeurs mobilières `[à vérifier]` ? | Cession des actions issues de l'exercice des BSA : régime fiscal (PFU / barème / abus de droit) `[à vérifier]` ? Conditions du risque de requalification en salaire ? |
| **BSPCE** | **Éligibilité émettrice :** la société est-elle éligible aux BSPCE après entrée du fonds PE `[à vérifier]` ? Si elle est détenue par un FCPR/FPCI, le **mécanisme légal de neutralisation** (transparence sur les porteurs de parts au regard du seuil de détention par des personnes physiques) est-il applicable `[à vérifier]` — question au fiscaliste, pas une conclusion ? **Éligibilité bénéficiaire :** à la date d'attribution, le bénéficiaire est-il salarié ou dirigeant éligible de la société **émettrice**, ou d'une société dont l'émettrice détient ≥ 75 % `[à vérifier]` ? La cible est-elle **déjà filiale détenue ≥ 75 % par l'émettrice à cette date**, ou seulement après le closing `[à vérifier]` ? **Formalités :** plan approuvé en AGE `[à vérifier]` ? Attribution nominative `[à vérifier]` ? | — | BSPCE non exercés à la date de leaver : caducité ou transmission `[à vérifier]` ? | Gains sur BSPCE : taux forfaitaire CGI `[à vérifier]` ? Activité exercée depuis plus ou moins de trois ans à la date de cession `[à vérifier]` ? Conditions du taux réduit `[à vérifier]` ? |
| **AGA** | Plan d'attribution approuvé en AGE `[à vérifier]` ? Conditions d'acquisition (présence, performance) `[à vérifier]` ? | Acquisition des actions au terme de la période d'acquisition : fait générateur fiscal — contribution patronale et salariale `[à vérifier]` ? | Perte des actions en cours d'acquisition : incidence fiscale sur le manager `[à vérifier]` ? Contribution patronale sur la valeur acquise `[à vérifier]` ? | Cession des actions après période de conservation : régime fiscal des plus-values d'AGA `[à vérifier]` ? Prélèvements sociaux sur la plus-value d'acquisition `[à vérifier]` ? |
| **OC / OCA** | L'émission de l'OCA est-elle à valeur de marché (prime de risque obligataire + prime de conversion) ? Traitement fiscal des intérêts pour le manager `[à vérifier]` ? | — | Remboursement anticipé de l'OCA en cas de leaver : traitement fiscal du différentiel principal/prix de remboursement `[à vérifier]` ? | Conversion avant exit : incidence fiscale de la conversion `[à vérifier]` ? Régime des plus-values sur les actions issues de la conversion `[à vérifier]` ? |
| **Options (SO)** | Plan d'options approuvé en AGE `[à vérifier]` ? Prix d'exercice supérieur ou égal à la valeur de marché à la date d'attribution `[à vérifier]` ? | — | Options non exercées à la date de leaver : caducité, délai de grâce `[à vérifier]` ? | Levée des options et cession des actions : régime fiscal des gains d'options — contribution salariale, IR, PS `[à vérifier]` ? Traitement de la fraction rabais excédentaire `[à vérifier]` ? |

> **Rappel hard guardrail.** Chaque cellule produit une **question**, jamais une réponse.
> Toute réponse sur le régime applicable est hors périmètre — renvoi au fiscaliste/socialiste.

#### Questions transversales à poser (toutes situations)

1. **Aléa réel en capital.** Le manager peut-il perdre tout ou partie de son investissement
   dans un scénario de sortie bas ? Si non, l'aléa est absent et le risque de requalification
   est élevé `[à vérifier]` — question à poser au fiscaliste.

2. **Cohérence prix d'entrée / valeur économique.** Le prix de souscription des instruments a-t-il
   fait l'objet d'une évaluation indépendante ? Existe-t-il un rapport de commissaire aux apports
   ou une valorisation expert `[à vérifier]` ?

3. **Lien présence / gains.** Quelle est l'intensité du lien entre le maintien du manager dans la
   société et l'accès à l'upside ? Un vesting 100% time-based est-il documenté comme un
   investissement indépendant ou comme un complément de rémunération conditionnel `[à vérifier]` ?

4. **Substance économique.** Le montage a-t-il une logique économique documentée (retention,
   alignement d'intérêts, partage du risque), indépendante de l'économie fiscale `[à vérifier]` ?

5. **Régime social des cotisations.** En cas de requalification, quelles charges sociales
   patronales et salariales sont potentiellement dues, et sur quelle assiette ? Question au
   socialiste — ce module ne calcule pas.

6. **Prescription fiscale.** En cas de contrôle fiscal, quel est le délai de reprise applicable
   selon le type d'instrument et de gain `[à vérifier]` ?

7. **Carried interest à composante luxembourgeoise (hors périmètre jambe FR — nommage seulement).**
   Si les managers participent au carried de l'équipe de gestion via une structure de droit
   luxembourgeois : qui est le **débiteur** du carried ? Quelles sont les **conditions d'acquisition**
   (vesting, hurdle, clawback) ? Quel est le **régime du LP agreement / des side letters** `[à vérifier]` ?
   Quelle est la **résidence fiscale** de chaque manager bénéficiaire ? Quelle est la **source du gain**
   (FR / Lux) ? Quelles **obligations sociales** `[à vérifier]` ? Quels **conflits d'intérêts** (manager à
   la fois cédant, garant de GAP et porteur de carry) ? Le **document satellite** est à demander ; le
   régime FR/Lux est **renvoyé à un conseil luxembourgeois + fiscaliste FR — jamais attribué ici**.

### Carte des handoffs (renvois obligatoires)

| Domaine | Renvoi | Objet du renvoi |
|---|---|---|
| Clauses pacte / précédence / leaver clause-par-clause | `pacte-associes-review --pe` (Axes P1, P4) | Revue clause-par-clause, triage 🟢/🟡/🟠/🔴, précédence documentaire |
| Rollover SPA / conditions dans l'acte | `spa-review --pe` (Axe S4) | Conditions rollover dans le SPA, séquence réinvestissement |
| Mécanique d'émission des instruments (ADP/BSA/BSPCE/AGA/OC) | `financement-startup` | Structuration, AGE, commissaire aux avantages, termes |
| Closing day-1 / funds flow rollover | `closing-checklist-fr --pe` (Axe L3/L5) | Séquence rollover au closing, accession deed, registres BidCo |
| Fiscalité du management package / requalification | Fiscaliste spécialisé ME PE | Qualification du régime, calcul éventuel d'exposition |
| Cotisations sociales / droit social | Avocat droit social / socialiste | Requalification charges sociales, non-concurrence salariée |
| PI substantiel dans les contrats du manager | Spécialiste PI (hors périmètre) | Clause de cession de droits PI dans le contrat de travail, brevets |

> **Format de la question-list produite par le skill.** Lors d'une exécution live, le skill
> produit cette matrice pré-remplie avec les instruments identifiés dans le dossier et les
> cellules actives selon les faits, puis l'avocat (ou le fiscaliste destinataire) complète les
> réponses. L'artefact produit des **questions**, jamais un **avis**.

---

## Frontières propres

- **Revue clause-par-clause du pacte d'investissement** (triage 🟢/🟡/🟠/🔴, précédence,
  gouvernance, leaver détaillé, drag/tag, liquidation preference) → `pacte-associes-review --pe`.

- **Revue SPA / rollover dans l'acte, garanties managers** → `spa-review --pe` / `gap-review --pe`.

- **Structuration et rédaction des instruments** (AGE, commissaire aux apports, termes, BSPCE,
  ADP, AGA, BSA, OC) → `financement-startup`. Ce module ne rédige aucun instrument.

- **Avis fiscal / social au fond** (qualification régime, calcul charges, conseil montage) →
  renvoi systématique fiscaliste/socialiste. Interdit dans ce module.

- **Fonds luxembourgeois, LPA, side letters fonds** → hors périmètre Hacienda DA (gate
  France/Lux héritée de `pe-overlay-fr.md`).

- **Cible cotée / AMF** → hors périmètre, anticipation v2.

- **Management package startup hors PE** → ce module cible le contexte PE/LBO. Pour un
  management package d'une startup en amorçage sans sponsor PE → `financement-startup`.

---

## Renvois

- Précédence documentaire / architecture pacte PE : `/h-da:pacte-associes-review --pe`.
- Revue SPA côté sponsor et rollover dans l'acte : `/h-da:spa-review --pe`.
- Revue GAP / garanties managers cédants : `/h-da:gap-review --pe`.
- Instruments management package (émission, AGE, termes) : `/h-da:financement-startup`.
- Closing day-1 — funds flow rollover, accession deed, registres : `/h-da:closing-checklist-fr --pe`.
- Cible en difficulté (overlay complémentaire) : `/h-da:asset-vs-share-distress`.
- PI substantiel dans les contrats du manager (cession de droits, brevets) : hors périmètre, orienter vers un spécialiste PI.
