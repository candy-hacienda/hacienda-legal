---
name: gouvernance-ag
description: >
  Gouvernance d'assemblée : mode --convocation (génère une convocation d'AGO
  ou d'AGE conforme aux délais et mentions obligatoires) et mode --pv (génère
  ou révise un procès-verbal d'assemblée). Adapte quorum, majorité et
  formalisme à la forme sociale. Brouillon soumis à validation humaine (avocat).
version: "2.0.0"
argument-hint: "[--convocation ou --pv, forme sociale, décisions]"
authors: ["Hacienda"]
tags: [gouvernance, assemblee, ago, age, convocation, proces-verbal, societes]
---

# Skill — Gouvernance d'assemblée

> **BROUILLON SOUMIS À validation humaine (avocat).**
>
> Ce skill assiste la gouvernance des assemblées d'associés ou d'actionnaires :
> il génère des **convocations** (mode `--convocation`) et des **procès-verbaux**
> (mode `--pv`). Aucune sortie n'est un acte définitif : convocation et PV sont
> des **brouillons** à valider par un avocat avant envoi, tenue de l'assemblée
> ou dépôt.
>
> **Les délais de convocation sont d'ordre public.** Une convocation irrégulière
> — délai non respecté, ordre du jour absent ou incomplet, mention obligatoire
> manquante — entraîne la **nullité des délibérations** prises par l'assemblée.
> Le calcul du délai et le contrôle des mentions ne sont donc pas du confort de
> rédaction : ils conditionnent la validité de la décision sociale.
>
> Ce disclaimer est un **plancher de responsabilité, pas un contrôle qualité** :
> il ne dispense ni de la relecture humaine, ni de la vérification des sources,
> ni du contrôle des seuils réglementaires.

---

## Examples

<example>
<user>/h-da:gouvernance-ag --convocation --forme=SARL — AGO annuelle d'approbation des comptes</user>
<response>
1. Lecture profil cabinet (sous-bloc « vie sociale » : cadence assemblées suivies, formes pratiquées).
2. Intake : SARL, AGO annuelle, ordre du jour = approbation des comptes + affectation du résultat + quitus, date d'assemblée visée.
3. Étape 1 (--convocation) — calcul du délai : délai SARL 15 jours (art. L.223-27 C.com.) ; date limite d'envoi = date d'assemblée − 15 jours. Si la date visée laisse moins de 15 jours → 🔴 délai intenable.
4. Étape 2 (--convocation) — rédaction : convocation avec ordre du jour complet, date/heure/lieu, modalités de participation `[review]` (présence / représentation / vote à distance selon statuts), documents à joindre (rapport de gestion, comptes annuels, projets de résolutions).
5. Étape 3 — post-flight `verifier-citations`.
6. Sortie : note du relecteur + convocation projet + question hors checklist + arbre de décision 5 options.
</response>
</example>

<example>
<user>/h-da:gouvernance-ag --convocation --forme=SA — AGE de modification de l'objet social</user>
<response>
1. Lecture profil cabinet.
2. Intake : SA, AGE, ordre du jour = modification de l'objet social (modification statutaire), date d'assemblée visée.
3. Étape 1 (--convocation) — calcul du délai : SA, 15 jours sur première convocation ; les délais précis sont réglementaires (art. R.225-67 / R.225-69 C.com. `[à vérifier]`). Date limite d'envoi calculée, alerte 🔴 si intenable.
4. Étape 2 (--convocation) — rédaction : convocation AGE avec ordre du jour, texte des projets de résolutions emportant modification des statuts, rapport du conseil exposant les motifs. Rappel en note : quorum AGE renforcé (1/4 des actions sur 1re convocation, 1/5 sur 2e) et majorité 2/3 des voix exprimées — art. L.225-96 C.com. `[à vérifier]` (article en `[a compléter]` dans l'index).
5. Étape 3 — post-flight `verifier-citations`.
6. Sortie : note du relecteur + convocation projet + arbre 5 options.
</response>
</example>

<example>
<user>/h-da:gouvernance-ag --pv --forme=SARL — rédige le PV de l'AGO qui s'est tenue hier</user>
<response>
1. Lecture profil cabinet.
2. Intake : SARL, AGO, résolutions soumises au vote et résultats fournis par l'utilisateur.
3. Étape 1 (--pv) — vérification quorum/majorité : AGO de SARL — pas de quorum légal ; 1re consultation = majorité absolue des parts, 2e consultation = majorité des votes émis (art. L.223-29 C.com.). Contrôle de cohérence des résultats saisis ; tag `[review]` si une résolution est annoncée adoptée sans atteindre la majorité requise.
4. Étape 2 (--pv) — rédaction : PV avec participants et qualité, quorum constaté, texte de chaque résolution + résultat du vote (pour / contre / abstentions, adoptée ou rejetée), signatures.
5. Étape 3 — post-flight `verifier-citations`.
6. Sortie : note du relecteur + PV projet + question hors checklist + arbre 5 options.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`,
> sous-bloc « vie sociale » du §1 :
> - **Cadence assemblées suivies** — portefeuille de sociétés / ponctuel
>   (calibre le ton et l'opportunité d'un suivi au tracker)
> - **Formes sociales pratiquées** — SAS / SARL / SA / SNC / SCI / autres
>   (oriente le périmètre et la validité de la forme demandée)
> - **Rôle de l'utilisateur courant** — conditionne l'en-tête de confidentialité
>   (avocat / notaire / juriste in-house / non-juriste)
> - **Politique PII** — `passive` / `active` (défaut) / `strict` + seuil B

Si le sous-bloc « vie sociale » est encore en `[A CONFIGURER]` : stopper et
demander `/h-da:entretien-demarrage`. Sans les formes
pratiquées renseignées, le calibrage des règles de quorum et de majorité ne peut
pas être confirmé.

---

## Intake

1. **Mode** — `--convocation` (génère une convocation) | `--pv` (génère ou
   révise un procès-verbal). **Obligatoire** : si absent, demander.
2. **Forme sociale** — `--forme=SARL` | `--forme=SA` | `--forme=SAS`.
   **Obligatoire** : la forme commande le délai de convocation et les règles de
   quorum/majorité. Pas de valeur par défaut.
3. **Type d'assemblée** — AGO (assemblée générale ordinaire) | AGE (assemblée
   générale extraordinaire — modification des statuts) | mixte (résolutions
   ordinaires et extraordinaires à un même ordre du jour).
4. **Ordre du jour / résolutions** — liste des questions soumises au vote (mode
   `--convocation`) ou texte des résolutions et résultats des votes (mode `--pv`).
5. **Date prévue de l'assemblée** — en mode `--convocation`, sert au **calcul du
   délai** (date limite d'envoi de la convocation). Si absente en `--convocation`,
   demander : le délai ne peut pas être contrôlé sans elle.

Données complémentaires à recueillir selon le cas :
- Pour une **AGE de SARL** : la **date de constitution** de la société — elle
  commande la majorité applicable (avant / après le 4 août 2005).
- Pour une **SAS** : les **statuts** — délai de convocation, quorum et majorité
  y sont fixés ; sans eux la vérification n'est pas possible.

Si le mode ou la forme sont absents : stopper et demander explicitement.

---

## Gate non-juriste

- [ ] Mode (`--convocation` | `--pv`) et `--forme` fournis (refus du défaut)
- [ ] Profil cabinet sous-bloc « vie sociale » lu (cadence assemblées, formes pratiquées, rôle utilisateur)
- [ ] Type d'assemblée identifié (AGO / AGE / mixte)
- [ ] `--convocation` : délai applicable identifié selon la forme ; date limite d'envoi calculée ; 🔴 signalé si le délai légal est intenable
- [ ] `--convocation` : convocation comprend ordre du jour, date/heure/lieu, modalités de participation `[review]`, documents à joindre selon le type d'assemblée
- [ ] `--pv` : règles de quorum et de majorité rappelées selon forme et type ; quorum (capital) et majorité (voix) non confondus
- [ ] `--pv` : pour une AGE de SARL, date de constitution recueillie (commande 2/3 ou 3/4 des parts) ; pour une SAS, renvoi aux statuts et non à une règle légale
- [ ] `--pv` : cohérence des chiffres saisis contrôlée ; résolution `[review]`-taguée si incohérence
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]` ; articles hors index / en `[a compléter]` (L.225-96) / `R.xxx` en `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur (5 champs) + {calcul délai + convocation, ou quorum/majorité + PV} + question hors checklist + arbre de décision 5 options + footer A si applicable

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/gouvernance-<convocation|pv>-<forme>-<denomination-slug>-YYYY-MM-DD.md
```

Format date : `YYYY-MM-DD` (date de l'assemblée visée).

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — voir les 4 variantes dans CLAUDE.md du plugin §2]

> **⚠️ Note du relecteur**
> - **Sources :** Légifrance ✓ / Judilibre ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** intake fourni par l'utilisateur — {forme, type d'assemblée, ordre du jour ou résolutions}
> - **Signalé pour ton jugement :** {N} éléments marqués [review] (modalités statutaires, délai SAS, cohérence quorum/majorité) | aucun
> - **Fraîcheur :** délais de convocation de la SA NON figés (réglementaires) — {N} renvois [à vérifier] à confirmer sur décret en vigueur ; jurisprudence nullité des délibérations à vérifier
> - **Avant de t'appuyer dessus :** {action concrète — ex. confirmer le délai statutaire si SAS ; vérifier la date de constitution pour la majorité d'AGE de SARL} | « prêt pour relecture avocat »

# {Pour --convocation} Calcul du délai
[délai applicable selon la forme + date limite d'envoi calculée + statut 🟢/🟠/🔴 ; signaler 🔴 si le délai légal est intenable]

# {Pour --convocation} Convocation — projet
[convocation structurée : ordre du jour, date/heure/lieu, modalités de participation [review], documents à joindre selon le type d'assemblée — NE PAS présenter comme prête à expédier]

# {Pour --pv} Quorum et majorité applicables
[rappel des règles de quorum et de majorité selon forme et type d'assemblée ; résultat du contrôle de cohérence des chiffres saisis]

# {Pour --pv} Procès-verbal — projet
[PV structuré : participants et qualité, quorum constaté, texte de chaque résolution + résultat du vote, signatures — résolution [review]-taguée si incohérence détectée]

# Une question hors de ma checklist habituelle
{Observation transversale qu'un relecteur attentif ferait — ex. une résolution d'AGE glissée à l'ordre du jour d'une AGO, une décision relevant en réalité de la collectivité des associés en SAS, une convocation par voie inadaptée aux statuts. Omettre la ligne si rien d'honnête.}

# Que veux-tu faire ? Choisis une option et je la déroule :

1. **Rédiger** — je produis le brouillon complet ({convocation prête pour relecture / procès-verbal prêt pour relecture}) avec ordre du jour ou résolutions et mentions obligatoires.
2. **Escalader** — note d'escalade vers l'approbateur configuré avec faits-clés, statut du délai et décision attendue (notamment si le délai légal est intenable).
3. **Compléter les faits** — questions ouvertes à poser avant d'avancer (date de constitution pour une AGE de SARL, statuts pour une SAS, résultats de vote détaillés pour un PV).
4. **Surveiller et attendre** — j'ajoute l'assemblée au tracker vie sociale avec date d'envoi de la convocation, date d'assemblée et échéances de dépôt / publicité éventuelles.
5. **Autre** — précise ce que tu veux en faire.
```

### Mode silencieux (livrable externe)

Convocation et procès-verbal sont des **documents sociaux** susceptibles d'être
diffusés hors du périmètre cabinet (associés non-juristes, greffe) :

- **En-tête de confidentialité** : la convocation et le PV étant des documents
  sociaux destinés aux associés, **retirer l'en-tête « secret professionnel »**
  de la version diffusée — le conserver uniquement sur la note interne au cabinet.
- **Note du relecteur** : CONSERVER dans le message d'accompagnement, **pas dans
  la convocation ni dans le PV** transmis.
- **Narration de skill** et renvois inter-commandes : COUPER (placer dans un
  message d'accompagnement séparé).
- **Statut brouillon** : la convocation et le PV restent des **projets** tant
  qu'ils n'ont pas été validés ; l'envoi ne les rend pas définitifs.

---

## Étape 1 (--convocation) — Calcul du délai

**Étape juridique active.** Le délai de convocation est d'ordre public : son
non-respect expose les délibérations à la nullité. Logique tirée de
`${CLAUDE_SKILL_DIR}/../../references/calendrier-vie-sociale-fr.md` (Partie 1).

1. Identifier le **délai applicable** selon la forme :
   - **SARL** — 15 jours avant l'assemblée (art. L.223-27 C.com.).
   - **SA** — 15 jours sur première convocation ; les délais précis sont
     **réglementaires** (art. R.225-67 / R.225-69 C.com. `[à vérifier]`, hors
     index). Le délai de seconde convocation est réduit `[à vérifier]`.
   - **SAS** — **liberté statutaire** : pas de délai légal. Lire le délai dans
     les **statuts** ; si les statuts ne sont pas fournis, le signaler comme une
     lacune et taguer `[review]` — ne pas appliquer par défaut le délai SARL/SA.

2. Calculer la **date limite d'envoi** de la convocation :
   ```
   date_limite_envoi = date_assemblee_visee − delai_applicable
   ```
   Présenter le calcul explicitement (date d'assemblée, délai, date limite).

3. **Signaler l'alerte** selon la marge restante par rapport à la date du jour :

| Marge avant la date limite d'envoi | Statut | Lecture |
|---|---|---|
| Date limite d'envoi déjà dépassée — délai impossible à tenir | 🔴 | Délai intenable : convoquer à cette date emporterait nullité. Reporter l'assemblée ou, pour la SA, anticiper une seconde convocation. |
| Envoi possible mais marge très courte | 🟠 | Convocation à expédier sans délai. |
| Marge confortable | 🟢 | Calendrier tenable. |

Les libellés de marge sont une convention de calibrage, pas une norme codifiée.
Le caractère 🔴 d'un **délai légal non tenable** n'est, lui, pas une convention :
il traduit un risque de nullité — ne jamais le minimiser.

---

## Étape 2 (--convocation) — Rédaction

Produire la convocation avec **toutes les mentions obligatoires** (référence
`calendrier-vie-sociale-fr.md`, Partie 2). Le livrable est un **brouillon**, pas
une convocation prête à expédier sans relecture.

Mentions à faire figurer :

- **Ordre du jour** — liste complète et précise des questions soumises au vote.
  Rappeler que l'assemblée ne peut, en principe, statuer sur une question non
  inscrite à l'ordre du jour.
- **Date, heure et lieu** de l'assemblée ; type d'assemblée (AGO / AGE / mixte)
  et numéro de convocation (première / seconde).
- **Modalités de participation** — présence physique, représentation (pouvoir),
  vote à distance ou par correspondance, visioconférence. Ces modalités
  dépendent des **statuts** (et de la loi) → tag `[review]` : ne pas affirmer
  qu'un mode de participation est ouvert sans vérification statutaire.
- **Documents à joindre** selon le type d'assemblée :
  - **AGO annuelle** — rapport de gestion, comptes annuels, projets de
    résolutions, le cas échéant rapport du commissaire aux comptes ;
  - **AGE de modification statutaire** — texte des projets de résolutions
    modifiant les statuts, projet de statuts modifiés, rapport de l'organe de
    direction exposant les motifs ;
  - **assemblée mixte** — cumul des documents propres à chaque type de résolution.

**Tags `[review]` — points dépendant des statuts.** Marquer `[review]` tout
point qui se lit dans les statuts plutôt que dans la loi :
- pour une **SAS**, le **délai** de convocation et les **modalités** (forme de la
  convocation, participation à distance) sont **statutaires** — `[review]`
  systématique, renvoi aux statuts ;
- pour la SARL et la SA, les modalités de participation à distance et la forme
  de la convocation peuvent également être précisées par les statuts → `[review]`.

---

## Étape 1 (--pv) — Vérification quorum/majorité

**Étape juridique active.** Avant de rédiger le PV, rappeler et contrôler les
règles de **quorum** et de **majorité** applicables. Logique tirée de
`${CLAUDE_SKILL_DIR}/../../references/calendrier-vie-sociale-fr.md` (Partie 3).

> **Ne jamais confondre quorum et majorité.** Le **quorum** est la proportion du
> **capital** (parts ou actions à droit de vote) présente ou représentée,
> condition pour délibérer. La **majorité** est la proportion des **voix**
> requise pour adopter une résolution.

Selon la forme et le type d'assemblée :

- **SARL — AGO** : aucun quorum légal. **1re consultation** : majorité des
  **parts sociales** (majorité absolue). **2e consultation** : majorité des
  **votes émis**, quel que soit le nombre de votants — art. L.223-29 C.com.
- **SARL — AGE** (modification des statuts) : la majorité dépend de la **date de
  constitution**. SARL **constituée après le 4 août 2005** : **2/3 des parts**
  des associés présents ou représentés, sous quorum de **1/4 des parts** sur 1re
  convocation et **1/5 des parts** sur 2e convocation — art. L.223-30 C.com.
  SARL **constituée avant le 4 août 2005** (régime ancien
  conservé) : **3/4 des parts sociales**, sans quorum — art. L.223-30 C.com.
- **SA — AGO** : quorum **1/5 des actions** à droit de vote sur **1re
  convocation**, **aucun quorum** sur **2e convocation** ; majorité des **voix
  exprimées** — art. L.225-98 C.com.
- **SA — AGE** : quorum **1/4 des actions** à droit de vote sur **1re
  convocation**, **1/5** sur **2e convocation** ; majorité des **2/3 des voix
  exprimées** — art. L.225-96 C.com. `[à vérifier]` (article en `[a compléter]`
  dans l'index `articles-c-civ-c-com-index.md`).
- **SAS** : **liberté statutaire** — quorum et majorité se lisent dans les
  **statuts** (art. L.227-9 C.com.). Ne pas appliquer une règle
  légale de SARL ou de SA. Si les statuts ne sont pas fournis, le signaler
  comme une lacune bloquante pour la vérification → `[review]`.

**Contrôle de cohérence.** Confronter le quorum et la majorité **saisis** par
l'utilisateur aux règles applicables à la forme. Tag `[review]` si une
incohérence apparaît — par exemple : une résolution d'AGE de SA annoncée adoptée
alors que la majorité atteinte est inférieure aux 2/3 des voix exprimées ; un
quorum saisi exprimé en voix là où la règle l'exprime en capital ; une majorité
de SARL appliquée à une SA. Ne pas « corriger » silencieusement les chiffres :
signaler l'incohérence et la soumettre au jugement de l'avocat.

---

## Étape 2 (--pv) — Rédaction du PV

Produire le procès-verbal avec les **mentions obligatoires** (référence
`calendrier-vie-sociale-fr.md`, Partie 4). Le livrable est un **brouillon**.

Mentions à faire figurer :

- **Identité et qualité des participants** — associés présents, représentés
  (avec le nom du mandataire), votant à distance ; président de séance et, le
  cas échéant, scrutateurs et secrétaire ; renvoi à la feuille de présence.
- **Quorum constaté** — nombre de parts ou d'actions présentes ou représentées,
  rapporté au capital ; mention expresse que le quorum requis est atteint (ou
  non, justifiant une seconde convocation).
- **Texte de chaque résolution et résultat du vote** — pour chaque résolution :
  son texte intégral, le résultat (voix pour / voix contre / abstentions) et la
  mention « adoptée » ou « rejetée ».
- **Date, heure et lieu** ; type d'assemblée et numéro de convocation.
- **Signatures** — président de séance et, selon la forme et les statuts,
  scrutateurs et/ou secrétaire.

**Tag `[review]` — incohérence quorum/majorité.** Si le quorum ou la majorité
saisis paraissent incohérents avec la forme sociale (résultat du contrôle de
l'Étape 1 --pv), marquer la résolution concernée `[review]` dans le PV et
expliciter l'incohérence en note du relecteur. Ne jamais présenter comme
« adoptée » une résolution dont la majorité n'est pas atteinte sans la flaguer.

---

## Étape 3 — Post-flight

Appel automatique de `verifier-citations` sur la sortie complète (mode défaut
`articles`). Le skill :

- extrait toutes les citations (art. L.NNN-N C.com.) ;
- vérifie l'existence et la version en vigueur via Légifrance ;
- annote : `[Légifrance ✓]`, `[abrogé]`, ou `[à vérifier]` en mode dégradé.

Articles attendus présents dans `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md` avec
identifiant Légifrance réel (→ à lire via `legifrance_get_article` ; `[Légifrance ✓]` seulement après lecture dans la session, sinon `[à vérifier]`) : L.223-27, L.223-29, L.223-30,
L.225-98, L.227-9. En `[a compléter]` ou absents (→ `[à vérifier]` obligatoire) : L.225-96
(en `[a compléter]` dans l'index), et **tout article réglementaire `R.xxx`**
(R.225-67, R.225-69 et suivants — délais de convocation de la SA).

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur
(« `verifier-citations` non exécuté — N citations à valider manuellement contre
Légifrance »).

---

## Ce skill ne fait pas

- L'**envoi physique** de la convocation (acte de la gérance / du conseil) ni la
  **tenue** de l'assemblée.
- Le **dépôt au greffe** et les **formalités de publicité** consécutives à une
  AGE de modification statutaire (RCS, journal d'annonces légales) — acte du
  cabinet ou du dirigeant.
- La rédaction des **statuts** d'une société (constitution ou refonte) →
  renvoyer vers `constitution-societe`.
- La **modification statutaire** elle-même (rédaction des clauses modifiées) —
  le skill produit la convocation et le PV de l'AGE, non le texte des statuts
  refondus.
- Le calcul **automatique** d'un quorum ou d'une majorité de **SAS** — ces règles
  sont statutaires : le skill renvoie aux statuts et n'invente pas de seuil légal.
- Les assemblées de **formes hors SARL / SA / SAS** (SNC, SCI, sociétés civiles,
  associations) — hors périmètre v1.1.
- L'appréciation de la **recevabilité d'une action en nullité** d'une
  délibération déjà prise — signalement du risque uniquement, renvoi avocat.

---

## Ton

Technique, structuré, prudent. La convocation et le procès-verbal sont les actes
qui portent la régularité de la décision sociale. Calibrer l'urgence sur le
**calcul du délai** : 🔴 explicite et sans détour dès que le délai légal de
convocation est intenable — c'est un risque de **nullité des délibérations**,
pas un défaut de style. En mode `--pv`, ne jamais **confondre quorum** (capital
présent ou représenté) **et majorité** (voix : parts en SARL, voix exprimées en
SA), ne jamais **croiser les régimes** SARL et SA, et toujours **renvoyer aux
statuts** pour une SAS plutôt que d'imposer une règle légale. Distinguer
systématiquement **première et seconde convocation** : les seuils de quorum en
dépendent. Si une question juridique se pose réellement hors du cadre du skill —
date de constitution inconnue pour une AGE de SARL, statuts de SAS non fournis —
le signaler et demander, ne pas combler par une valeur par défaut. Toute sortie
est un brouillon soumis à validation humaine (avocat) avant envoi ou tenue de l'assemblée.
