# Instruments de financement de la startup — comparatif

Référence des principaux instruments mobilisés pour financer une startup et
intéresser ses équipes : **BSPCE**, **BSA**, **obligations convertibles
(OC / OCA)** et **augmentation de capital simple**. Source de vérité unique du
skill `financement-startup` (modes `--comparer` et `--review`).

> **Source primaire :** Légifrance (Code de commerce, Code général des impôts).
> Toute citation issue de cette référence doit être taguée `[Légifrance]` si
> vérifiée en session, sinon `[à vérifier]`. Les articles **absents de
> `articles-c-civ-c-com-index.md`** sont tagués `[à vérifier]` dans la sortie.

> **Frontière de périmètre — INSTRUMENTS vs CLAUSES DE PACTE.** Cette référence
> et le skill `financement-startup` traitent les **instruments** : leur nature,
> leur mécanique, leur effet dilutif, leurs points d'attention juridiques. Les
> **clauses de pacte d'associés** attachées à une levée — liquidation
> preference, anti-dilution / ratchet, gouvernance et droits de véto, vesting,
> drag / tag-along, good / bad leaver — relèvent du skill `pacte-associes-review`
> et **ne sont pas traitées ici**. Le renvoi entre les deux skills est explicite
> et automatique.

> **Frontière de périmètre — AUCUN CONSEIL FISCAL.** Chaque instrument comporte
> une dimension fiscale (régime du gain BSPCE, traitement des plus-values,
> régime des intérêts d'OC, droits d'enregistrement). Cette référence
> **signale** la dimension fiscale et **renvoie** à un conseil fiscal /
> expert-comptable. Elle ne la traite **jamais** au fond. En particulier, le
> **régime fiscal de faveur du BSPCE (art. 163 bis G CGI [à vérifier])** est
> mentionné comme un point à faire trancher par un fiscaliste, non analysé ici.

---

## Tableau comparatif synthétique

| Axe | BSPCE | BSA | Obligations convertibles (OC / OCA) | Augmentation de capital simple |
|---|---|---|---|---|
| Nature | Bon donnant droit de souscrire des titres à un prix fixé d'avance ; réservé par la loi à certains bénéficiaires | Valeur mobilière donnant droit de souscrire des titres à un prix fixé d'avance ; librement cessible/souscriptible | Titre de créance (obligation) assorti d'un droit de conversion en titres de capital | Émission de titres de capital nouveaux souscrits immédiatement |
| Bénéficiaires / souscripteurs typiques | Salariés et dirigeants assimilés salariés de sociétés éligibles | Investisseurs, advisors, partenaires, tiers — y compris non-salariés | Investisseurs (souvent business angels, fonds) en amorçage ou en relais de tour | Investisseurs entrants et associés existants |
| Moment de la dilution | Différée — à l'exercice du bon | Différée — à l'exercice du bon | Différée — à la conversion (ou jamais, si remboursement) | Immédiate — à la souscription |
| Apport de trésorerie immédiat | Non (prix d'exercice payé plus tard) | Faible (prix du bon, souvent symbolique) puis prix d'exercice différé | Oui — la société reçoit les fonds dès l'émission | Oui — fonds reçus à la libération |
| Finalité dominante | Intéressement et rétention des équipes | Intéressement de tiers / rémunération d'un apport non capitalistique | Financement-relais, report de la valorisation | Financement d'un tour structurant (seed, série A…) |
| Dimension fiscale | Régime de faveur art. 163 bis G CGI [à vérifier] — **renvoi fiscaliste** | Régime du gain selon la qualité du souscripteur — **renvoi fiscaliste** | Régime des intérêts et de la conversion — **renvoi fiscaliste** | Plus-values, droits d'enregistrement — **renvoi fiscaliste** |
| Skill compétent pour les clauses de pacte associées | `pacte-associes-review` | `pacte-associes-review` | `pacte-associes-review` | `pacte-associes-review` |

Les tags de provenance figurent **sans backticks** dans les cellules. Tout
article cité doit être confronté à `articles-c-civ-c-com-index.md` : un article
absent ou en `[a compléter]` est tagué `[à vérifier]` dans la sortie.

---

## 1. BSPCE — bons de souscription de parts de créateur d'entreprise

### Nature de l'instrument

Le BSPCE est un **bon** qui confère à son titulaire le droit de **souscrire des
titres de la société** (actions) à un **prix d'exercice fixé lors de
l'attribution**. Le gain de l'attributaire tient à l'écart entre la valeur du
titre au jour de l'exercice (ou de la revente) et ce prix d'exercice figé. Le
BSPCE est un dispositif **propre au droit français**, défini par le Code général
des impôts (art. 163 bis G CGI [à vérifier]).

### Bénéficiaires

Le BSPCE est, par la loi, **réservé** : il ne peut être attribué qu'aux
**salariés** et aux **dirigeants soumis au régime fiscal des salariés**
(dirigeants assimilés salariés — typiquement le président de SAS, le gérant
minoritaire de SARL) de **sociétés éligibles**. Les conditions d'éligibilité de
la société (ancienneté, régime d'imposition, détention du capital, caractère non
coté ou capitalisation plafonnée) sont posées par l'art. 163 bis G CGI
[à vérifier] et **évoluent** — elles doivent être vérifiées sur le texte en
vigueur. Un **tiers non salarié et non dirigeant** (investisseur, advisor
externe) **ne peut pas** recevoir de BSPCE : pour intéresser un tiers, l'outil
est le **BSA** (voir §2).

### Conditions d'attribution et d'exercice

- L'émission de BSPCE est une **émission de valeurs mobilières donnant accès au
  capital** : elle relève de la compétence de la **collectivité des associés**
  (décision collective ; en SAS, modalités fixées par les statuts, art. L.227-9
  C.com. [Légifrance]) qui en arrête le nombre, fixe le **prix d'exercice** et
  délègue le cas échéant l'attribution au dirigeant.
- Le **prix d'exercice** doit refléter la valeur des titres à l'attribution ;
  une sous-évaluation manifeste fragilise l'instrument et son régime — point à
  faire valider (valorisation = `[review]`).
- Le plan de BSPCE est habituellement assorti d'un **calendrier d'acquisition
  des droits (vesting)** et de conditions de présence. **Attention :** le
  vesting est une **clause** ; son régime, sa proportionnalité et son
  articulation avec un éventuel pacte relèvent de `pacte-associes-review`, pas
  de cette référence.

### Effet dilutif

La dilution est **différée et conditionnelle** : tant que les bons ne sont pas
exercés, le capital n'est pas modifié. À l'exercice, la société émet des titres
nouveaux au profit de l'attributaire → dilution des associés existants à due
proportion. Le coût de la dilution pour les associés est connu d'avance (prix
d'exercice figé) mais sa **réalisation** dépend de l'exercice effectif. Le
nombre de titres potentiellement créés s'apprécie en **capital pleinement dilué
(fully diluted)** — donnée structurante pour toute levée ultérieure.

### Points d'attention juridiques

- **Éligibilité de la société et du bénéficiaire** : conditions légales strictes
  (art. 163 bis G CGI [à vérifier]) ; une attribution à un bénéficiaire non
  éligible est inopérante. Vérifier l'éligibilité **avant** d'émettre.
- **Compétence et formalisme** : décision collective d'émission, rapport(s) le
  cas échéant, fixation du prix d'exercice, délégation éventuelle.
- **Cas particulier des titres incessibles** : le bon lui-même est en principe
  **incessible** ; seul le titre issu de l'exercice est cessible.
- **Valorisation du prix d'exercice** : appréciation de fait → `[review]`.

### Dimension fiscale — SIGNALEMENT, NON TRAITÉE

> Le BSPCE bénéficie, sous conditions, d'un **régime fiscal de faveur** prévu à
> l'**art. 163 bis G CGI [à vérifier]** pour le gain réalisé par l'attributaire.
> Ce régime, ses conditions et ses évolutions **relèvent d'un conseil fiscal /
> expert-comptable** et **ne sont pas traités** par cette référence ni par le
> skill `financement-startup`. Toute question sur la fiscalité du BSPCE (taux,
> seuils, articulation avec l'ancienneté dans la société, cotisations sociales
> éventuelles) est **signalée et renvoyée** à un fiscaliste.

---

## 2. BSA — bons de souscription d'actions

### Nature de l'instrument

Le BSA est une **valeur mobilière** donnant à son titulaire le droit de
**souscrire une ou plusieurs actions** à un **prix fixé d'avance**, pendant une
période déterminée. C'est une **valeur mobilière donnant accès au capital** au
sens des art. L.228-91 et s. C.com. [à vérifier]. À la différence du BSPCE, le
BSA n'est **pas réservé** à une catégorie de bénéficiaires.

### Souscripteurs typiques

Le BSA peut être souscrit par des **tiers** : investisseurs, business angels,
advisors, partenaires industriels. Il sert fréquemment à **rémunérer un apport
non capitalistique** (accompagnement d'un advisor, « BSA Air » de relais de
tour) ou à offrir un droit d'entrée futur à un investisseur. Lorsqu'un advisor
externe — non salarié, non dirigeant — doit être intéressé, le BSA est l'outil
adéquat **là où le BSPCE est juridiquement fermé**.

### Conditions d'attribution et d'exercice

- Émission décidée par la **collectivité des associés** (en SAS, selon les
  statuts, art. L.227-9 C.com. [Légifrance]) ; fixation du **prix de
  souscription du bon**, du **prix d'exercice**, de la **parité** et de la
  **période d'exercice**.
- Le BSA peut être **cessible** (sauf stipulation contraire), ce qui le
  distingue du BSPCE.
- Le **prix du bon** doit être fixé à sa juste valeur lorsque le souscripteur
  est un dirigeant ou un salarié, pour éviter une requalification — appréciation
  de fait → `[review]`.

### Effet dilutif

Dilution **différée et conditionnelle**, comme le BSPCE : le capital n'est
affecté qu'à l'exercice des bons, par émission de titres nouveaux. Les BSA en
circulation s'intègrent au calcul du **capital pleinement dilué**. Un bloc de
BSA significatif doit être pris en compte dans l'analyse de toute levée
ultérieure.

### Points d'attention juridiques

- **Compétence et formalisme** : décision collective d'émission de valeurs
  mobilières donnant accès au capital ; rapport(s) le cas échéant.
- **Fixation du prix du bon** : un BSA attribué à un dirigeant/salarié à un prix
  décorrélé de sa valeur expose à un risque de requalification du gain →
  `[review]`, renvoi fiscaliste pour le volet fiscal.
- **Articulation avec un pacte** : les conditions d'exercice liées à la présence
  ou à la performance, et le sort des bons en cas de départ, sont des
  **clauses** → `pacte-associes-review`.

### Dimension fiscale — SIGNALEMENT, NON TRAITÉE

> Le régime fiscal du gain de BSA dépend notamment de la **qualité du
> souscripteur** (tiers investisseur / dirigeant / salarié) et des conditions de
> souscription. Ce régime **relève d'un conseil fiscal** et n'est **pas traité**
> ici. Toute question fiscale sur les BSA est **signalée et renvoyée** à un
> fiscaliste.

---

## 3. Obligations convertibles (OC / OCA)

### Nature de l'instrument

L'obligation convertible est un **titre de créance** : la société emprunte, et
le souscripteur devient **créancier obligataire**, en principe rémunéré par un
**intérêt**. L'obligation est assortie d'un **droit de conversion** en titres de
capital (actions) selon une **parité** et dans des conditions définies à
l'émission. Les **OCA** (obligations convertibles en actions) sont la variété la
plus courante. Régime des valeurs mobilières donnant accès au capital, art.
L.228-91 et s. C.com. [à vérifier].

### Souscripteurs typiques

Les OC sont souscrites par des **investisseurs** — business angels, fonds —
le plus souvent en **amorçage** ou en **relais** entre deux tours. Elles
permettent de **différer la fixation de la valorisation** : la conversion
intervient au tour suivant, souvent avec une **décote** et/ou un **plafond de
valorisation** au profit de l'investisseur OC.

### Conditions d'émission et de conversion

- Émission d'obligations décidée selon les règles applicables aux **emprunts
  obligataires** et aux **valeurs mobilières donnant accès au capital** ;
  décision de la collectivité des associés ou de l'organe délégataire.
- Définition à l'émission de l'**échéance**, du **taux d'intérêt**, de la
  **parité de conversion**, des **événements déclencheurs** (tour qualifiant,
  échéance, cession) et des modalités de **remboursement** à défaut de
  conversion.
- La **décote**, le **cap de valorisation** et les **conditions de conversion**
  sont des paramètres économiques structurants : leur appréciation au fond, et
  surtout leur articulation avec les clauses du pacte du tour suivant (liquidation
  preference, anti-dilution), relèvent de `pacte-associes-review`.

### Effet dilutif

Dilution **différée et conditionnelle** : tant qu'il n'y a pas conversion, il
n'y a **pas de dilution** — l'instrument reste une dette. La dilution survient
**à la conversion**, et son ampleur dépend de la parité retenue, donc de la
**décote** et du **cap**. Si l'obligation est **remboursée** sans conversion, il
n'y a **aucune dilution** mais une **sortie de trésorerie**. À la différence du
BSPCE et du BSA, l'OC pèse, jusqu'à conversion, au **passif** de la société.

### Points d'attention juridiques

- **Nature de dette** : tant qu'elles ne sont pas converties, les OC sont un
  **passif** ; en cas de difficultés, le porteur est **créancier** — point
  sensible en présence d'un risque de procédure collective.
- **Conditions de conversion** : un déclencheur mal défini ou une parité
  ambiguë est un défaut rédactionnel majeur → `[review]`.
- **Masse des obligataires** et représentation : à vérifier selon le régime
  applicable.
- **Articulation tour suivant** : les conditions économiques de conversion
  doivent être cohérentes avec le pacte du tour qualifiant → renvoi
  `pacte-associes-review`.

### Dimension fiscale — SIGNALEMENT, NON TRAITÉE

> Le traitement fiscal des **intérêts** servis, de la **conversion** et d'une
> éventuelle **prime de remboursement** **relève d'un conseil fiscal** et n'est
> **pas traité** ici. Toute question fiscale sur les OC est **signalée et
> renvoyée** à un fiscaliste / expert-comptable.

---

## 4. Augmentation de capital simple

### Nature de l'instrument

L'augmentation de capital simple est l'émission de **titres de capital
nouveaux** (actions) souscrits **immédiatement** par les investisseurs, en
contrepartie d'un **apport** (le plus souvent en numéraire). C'est l'instrument
**de droit commun** d'un tour de financement structurant : la société reçoit les
fonds, l'investisseur entre directement au capital.

### Souscripteurs typiques

Investisseurs entrants (fonds, business angels) et, le cas échéant, associés
existants. Un tour de **seed** ou de **série A** se traduit typiquement par une
augmentation de capital, généralement assortie d'un **pacte d'associés**.

### Conditions de réalisation

- Décision de la **collectivité des associés** statuant aux conditions de
  modification des statuts (capital = mention statutaire, art. L.210-2 C.com.
  [Légifrance]) ; en SAS, modalités fixées par les statuts (art. L.227-9 C.com.
  [Légifrance]).
- Fixation du **prix d'émission** (valeur nominale + **prime d'émission**), donc
  de la **valorisation** retenue (pré-money / post-money).
- Traitement du **droit préférentiel de souscription** des associés existants —
  maintien ou suppression au profit de personnes dénommées — point juridique
  sensible → `[review]`.
- Si l'apport est **en nature**, intervention possible d'un **commissaire aux
  apports** (cf. `references/comparatif-formes-sociales-fr.md`).

### Effet dilutif

Dilution **immédiate et certaine** : dès la souscription, les associés existants
qui ne souscrivent pas voient leur participation **mécaniquement réduite**.
C'est la différence majeure avec le BSPCE, le BSA et l'OC, dont la dilution est
**différée et conditionnelle**. L'ampleur de la dilution dépend directement de
la **valorisation** retenue : plus la pré-money est basse, plus la dilution des
fondateurs est forte.

### Points d'attention juridiques

- **Valorisation et prime d'émission** : appréciation économique structurante →
  `[review]`.
- **Droit préférentiel de souscription** : son maintien protège les associés
  existants ; sa suppression doit être régulièrement décidée et motivée →
  `[review]`.
- **Articulation avec le pacte d'associés** : l'entrée d'un investisseur
  s'accompagne quasi systématiquement de clauses de pacte (liquidation
  preference, anti-dilution, gouvernance, vesting des fondateurs) → ces clauses
  **ne sont pas traitées ici** : renvoi `pacte-associes-review`.
- **Formalisme post-opération** : modification statutaire du capital, dépôt et
  publicité — hors périmètre du skill.

### Dimension fiscale — SIGNALEMENT, NON TRAITÉE

> Le régime des **plus-values** des associés cédants, les **droits
> d'enregistrement** et les dispositifs d'incitation à l'investissement
> **relèvent d'un conseil fiscal** et ne sont **pas traités** ici. Toute
> question fiscale est **signalée et renvoyée** à un fiscaliste.

---

## Grille de choix `--comparer` — repères

Repères de cadrage. Aucun de ces repères ne se substitue à la validation avocat,
ni au conseil fiscal sur la dimension fiscale de chaque instrument.

| Besoin exprimé | Instrument(s) à considérer | Pourquoi |
|---|---|---|
| Intéresser et retenir un **salarié ou dirigeant assimilé salarié** | BSPCE (si société et bénéficiaire éligibles) | Outil dédié à l'intéressement des équipes éligibles ; dilution différée |
| Intéresser un **advisor / tiers non salarié** | BSA | Le BSPCE est juridiquement fermé aux non-salariés / non-dirigeants |
| Lever des fonds en **différant la valorisation** | OC / OCA | Report de la fixation du prix au tour qualifiant, via décote / cap |
| Lever un **tour structurant** (seed / série A) avec entrée immédiate au capital | Augmentation de capital simple | Apport de trésorerie immédiat, entrée directe de l'investisseur |
| **Limiter la dilution immédiate** des fondateurs | BSPCE / BSA / OC (dilution différée) plutôt qu'augmentation de capital | La dilution n'est réalisée qu'à l'exercice / la conversion |
| Financement-**relais** court entre deux tours | OC / OCA | Souplesse, conversion au tour suivant ou remboursement |

Plusieurs instruments peuvent être **combinés** (ex. augmentation de capital
d'un investisseur principal + plan de BSPCE pour l'équipe). La recommandation du
mode `--comparer` est **motivée** et n'occulte jamais le renvoi fiscal ni le
renvoi `pacte-associes-review` pour les clauses du pacte associé à l'opération.

---

## Articles cités — état de l'index

| Article | Statut dans `articles-c-civ-c-com-index.md` | Tag à appliquer dans la sortie |
|---|---|---|
| L.210-2 C.com. (mentions statutaires, dont capital) | présent, LEGIARTI réel | [Légifrance] si vérifié, sinon [à vérifier] |
| L.227-9 C.com. (décisions collectives SAS) | présent, LEGIARTI réel | [Légifrance] si vérifié, sinon [à vérifier] |
| L.228-91 et s. C.com. (valeurs mobilières donnant accès au capital) | absent de l'index | [à vérifier] |
| Art. 163 bis G CGI (régime fiscal BSPCE) | hors index (Code général des impôts) | [à vérifier] — et **dimension fiscale renvoyée** |

Tout article hors index est tagué `[à vérifier]` **sans backticks** en cellule
de tableau. Aucune information fiscale n'est délivrée au fond, quel que soit le
statut de l'article à l'index.
