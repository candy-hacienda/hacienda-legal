---
name: financement-startup
description: >
  Conseil sur les instruments de financement de la startup : BSPCE, BSA,
  obligations convertibles, augmentation de capital. Mode --comparer (choix
  d'instrument) et --review (revue d'une term sheet de levée). Renvoie vers
  pacte-associes-review pour les clauses de pacte. Ne donne aucun conseil
  fiscal. Brouillon soumis à validation humaine (avocat).
version: "2.0.0"
argument-hint: "[--comparer ou --review, instrument, term sheet]"
authors: ["Hacienda"]
tags: [financement, startup, bspce, bsa, obligations-convertibles, levee]
---

# Skill — Financement de la startup

> **BROUILLON DE TRAVAIL — validation humaine (avocat) IMPÉRATIVE — AUCUN CONSEIL FISCAL.**
>
> Ce skill assiste le choix et la revue des **instruments de financement** d'une
> startup : BSPCE, BSA, obligations convertibles (OC / OCA), augmentation de
> capital. Le mode `--comparer` aide à choisir un ou plusieurs instruments ; le
> mode `--review` analyse une term sheet de levée. Toute sortie est un
> **brouillon** soumis à **validation humaine (avocat)** avant transmission, signature ou
> ouverture de négociation.
>
> **Ce skill ne donne AUCUN conseil fiscal.** La dimension fiscale de chaque
> instrument — et notamment le **régime fiscal de faveur du BSPCE (art. 163 bis G
> CGI [à vérifier])** — est **signalée** et **renvoyée à un conseil fiscal /
> expert-comptable**. Elle n'est **jamais traitée au fond** : ni taux, ni
> seuils, ni montage d'optimisation.
>
> **Frontière nette — INSTRUMENTS vs CLAUSES DE PACTE.** Ce skill traite les
> **instruments** (BSPCE / BSA / OC / augmentation de capital — leur nature,
> leur mécanique, leur effet dilutif). Les **clauses de pacte d'associés**
> attachées à une levée — **liquidation preference, anti-dilution / ratchet,
> gouvernance et droits de véto, vesting, drag / tag-along, leaver** — relèvent
> du skill `pacte-associes-review`. Dès qu'une clause de pacte apparaît, ce
> skill **renvoie** vers `pacte-associes-review` : il ne traite jamais une
> clause de pacte au fond.
>
> Ce disclaimer est un **plancher de responsabilité, pas un contrôle qualité** :
> il ne dispense ni de la relecture humaine, ni de la vérification des sources.

---

## Examples

<example>
<user>/h-da:financement-startup --comparer — intéresser un premier salarié-clé : BSPCE ou BSA ?</user>
<response>
1. Lecture profil cabinet (bloc M&A / Corporate : side financement ; bloc « vie sociale » : posture pacte d'associés).
2. Étape 1 — cadrage : startup en amorçage, SAS éligible, objectif = intéresser et retenir un **premier salarié-clé** (donc un salarié), contrainte de dilution modérée.
3. Étape 2 — recommandation depuis `${CLAUDE_SKILL_DIR}/../../references/instruments-financement-fr.md` : **BSPCE** — instrument dédié à l'intéressement des **salariés et dirigeants assimilés salariés** de sociétés éligibles, dilution différée à l'exercice. Le **BSA** est écarté ici : il vise les tiers non salariés (advisors, investisseurs) ; pour un salarié, le BSPCE est l'outil adéquat sous réserve de l'éligibilité de la société et du bénéficiaire (art. 163 bis G CGI [à vérifier]).
4. Signalement fiscal : le régime fiscal de faveur du BSPCE (art. 163 bis G CGI [à vérifier]) **relève d'un fiscaliste** — signalé, non traité. Tags [review] sur la valorisation du prix d'exercice et l'éligibilité.
5. Sortie : note du relecteur (5 champs) + table comparative + recommandation motivée + question hors checklist + arbre de décision 5 options.
</response>
</example>

<example>
<user>/h-da:financement-startup --comparer — tour de seed : obligations convertibles ou augmentation de capital ?</user>
<response>
1. Lecture profil cabinet (side financement, posture pacte).
2. Étape 1 — cadrage : stade **seed**, objectif = **levée externe** auprès de business angels, hésitation sur la valorisation, souhait de limiter la dilution immédiate des fondateurs.
3. Étape 2 — recommandation depuis `${CLAUDE_SKILL_DIR}/../../references/instruments-financement-fr.md` :
   - **OC / OCA** — titre de créance convertible : permet de **différer la fixation de la valorisation** au tour qualifiant (décote / cap), dilution différée et conditionnelle ; jusqu'à conversion, c'est une dette au passif.
   - **Augmentation de capital simple** — entrée immédiate au capital, apport de trésorerie immédiat, mais **dilution immédiate et certaine** dépendant de la pré-money retenue.
   Recommandation motivée selon le besoin : si la valorisation est difficile à fixer maintenant, l'OC est l'instrument de report ; si l'investisseur veut entrer au capital sans délai et la valorisation est consensuelle, l'augmentation de capital convient.
4. Signalement fiscal : régime des intérêts d'OC / des plus-values → **renvoi fiscaliste**, non traité.
5. Renvoi `pacte-associes-review` signalé : un tour de seed s'accompagne d'un pacte (liquidation preference, anti-dilution, gouvernance) — ces clauses relèvent de `pacte-associes-review`, pas de ce skill.
6. Sortie : note du relecteur + table comparative + recommandation + arbre de décision 5 options.
</response>
</example>

<example>
<user>/h-da:financement-startup ./term-sheet-seed.pdf --review</user>
<response>
1. Lecture profil cabinet (side financement, posture pacte).
2. Étape 1 — identification : term sheet de tour de seed, augmentation de capital + plan de BSPCE pour l'équipe, droit français.
3. Étape 2 — analyse des **instruments** : valorisation pré/post-money, dilution induite par l'augmentation de capital, mécanique du plan de BSPCE (dilution différée, capital pleinement dilué).
4. **Renvoi explicite `pacte-associes-review`** : la term sheet comporte une clause de **liquidation preference** et une clause d'**anti-dilution** — ce sont des **clauses de pacte**, hors périmètre de ce skill. Renvoi : « Les clauses de liquidation preference et d'anti-dilution de cette term sheet relèvent du skill `pacte-associes-review` (revue de pacte). Souhaites-tu (a) enchaîner `pacte-associes-review` sur ces clauses, (b) limiter `financement-startup` à l'analyse des instruments, ou (c) les deux en séquence ? »
5. Étape 3 — post-flight `verifier-citations`.
6. Sortie : note du relecteur + analyse des instruments + renvoi `pacte-associes-review` + question hors checklist + arbre de décision 5 options.
</response>
</example>

<example>
<user>/h-da:financement-startup — quel est le taux d'imposition du gain sur les BSPCE de mon équipe ?</user>
<response>
Question de **fiscalité du BSPCE** → hors périmètre de ce skill.
Réponse : « Ce skill ne donne aucun conseil fiscal. Le **régime fiscal de faveur du BSPCE** est prévu à l'**art. 163 bis G CGI [à vérifier]** : son taux, ses seuils, ses conditions (notamment l'ancienneté du bénéficiaire dans la société) et leurs évolutions **relèvent d'un conseil fiscal / expert-comptable** et doivent être vérifiés sur le texte en vigueur. Je ne peux ni indiquer un taux, ni confirmer un régime. »
Le skill **signale** la dimension fiscale, **renvoie** au fiscaliste, et propose, s'il est utile, de cadrer en `--comparer` le **volet juridique** du choix d'instrument (nature, mécanique, dilution) — sans jamais traiter le volet fiscal.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md` :
> - **Bloc M&A / Corporate** — side habituel (cédant / acquéreur / conseil des
>   deux), taille de deals typique, posture DD/GAP : oriente la lecture d'une
>   term sheet de levée
> - **Bloc « vie sociale »** — **posture pacte d'associés** (protecteur
>   fondateurs / équilibré / protecteur investisseurs) : conditionne le ton du
>   renvoi vers `pacte-associes-review` ; formes sociales pratiquées
> - **Matrice d'approbateurs** — type d'acte → approbateur (escalade)
> - **Rôle de l'utilisateur courant** — conditionne l'en-tête de confidentialité
>   (avocat / notaire / juriste in-house / non-juriste)

Si le bloc M&A / Corporate ou le bloc « vie sociale » est encore en
`[A CONFIGURER]` : stopper et demander `/h-da:entretien-demarrage`.
Voir aussi `~/.claude/plugins/config/hacienda-juridique/company-profile.md` pour les éléments cabinet
partagés cross-plugins.

---

## Intake

1. **Mode** — `--comparer` (aide au choix d'instrument) | `--review` (revue
   d'une term sheet de levée). **Obligatoire** : si absent, demander.
2. **Stade** — amorçage / seed / série A… : situe le contexte de financement.
3. **Objectif** — intéressement des salariés / levée externe / financement de
   croissance : oriente la sélection d'instruments.
4. **Fichier term sheet** (si `--review`) — chemin du PDF / DOCX / Markdown.
5. **Profil des souscripteurs** — salariés et dirigeants assimilés salariés /
   advisors et tiers non salariés / investisseurs (business angels, fonds) /
   associés existants. **Déterminant** : le BSPCE est réservé aux salariés et
   dirigeants assimilés salariés ; un tiers non salarié relève du BSA.

Si le mode est absent, ou si `--review` est demandé sans fichier de term sheet :
stopper et demander explicitement. Pas de valeur par défaut sur le mode.

---

## Gate non-juriste

- [ ] Mode (`--comparer` | `--review`) fourni ; en `--review`, fichier de term sheet fourni (refus du défaut)
- [ ] Profil cabinet lu (bloc M&A / Corporate + bloc « vie sociale », posture pacte)
- [ ] Profil des souscripteurs identifié — le BSPCE n'est recommandé que pour des salariés / dirigeants assimilés salariés ; un tiers non salarié renvoyé au BSA
- [ ] `--comparer` : table comparative depuis `instruments-financement-fr.md` + recommandation motivée + instruments écartés et pourquoi
- [ ] `--review` : analyse des seuls **instruments** (valorisation, dilution, mécanique) ; aucune clause de pacte traitée au fond
- [ ] **Renvoi explicite vers `pacte-associes-review`** pour toute clause de pacte (liquidation preference, anti-dilution, gouvernance, vesting, drag/tag, leaver)
- [ ] **Dimension fiscale signalée et renvoyée** à un conseil fiscal — JAMAIS traitée au fond ; régime BSPCE art. 163 bis G CGI [à vérifier] signalé sans être analysé
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]` ; articles hors index (L.228-91 et s. C.com., art. 163 bis G CGI) en `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur (5 champs) + {table comparative ou analyse des instruments} + renvoi pacte-associes-review + dimension fiscale signalée + question hors checklist + arbre de décision 5 options

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Points sociaux de due diligence : `boss_recherche`, `boss_get_document`. Points fiscaux : `bofip_rechercher` / `bofip_consulter` ne donnent que des circulaires ministérielles (fonds CIRC), **pas la base BOFiP-Impôts** — toute doctrine fiscale reste `[à vérifier]` sur bofip.impots.gouv.fr, sans tag `[BOFiP]`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/financement-<stade>-<objet-slug>-YYYY-MM-DD.md
```

Format date : `YYYY-MM-DD`. Pour le mode `--comparer`, suffixer `-comparatif`.

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — voir les 4 variantes dans CLAUDE.md du plugin §2]

> **⚠️ Note du relecteur**
> - **Sources :** Légifrance ✓ / Judilibre ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** {pour --comparer : intake fourni par l'utilisateur — stade, objectif, profil des souscripteurs} | {pour --review : intégrale (N pages) | partielle (pages X à Y)}
> - **Signalé pour ton jugement :** {N} éléments marqués [review] (valorisation, éligibilité BSPCE, ampleur de dilution acceptable) | aucun
> - **Fraîcheur :** régime fiscal BSPCE (art. 163 bis G CGI) NON traité — renvoyé au fiscaliste ; conditions d'éligibilité susceptibles d'évoluer
> - **Avant de t'appuyer dessus :** {action concrète — ex. faire valider l'éligibilité BSPCE et le volet fiscal par un fiscaliste ; enchaîner pacte-associes-review sur les clauses de pacte} | « prêt pour relecture avocat »

# {Pour --comparer} Table comparative et recommandation
[table comparative des instruments pertinents depuis ${CLAUDE_SKILL_DIR}/../../references/instruments-financement-fr.md + recommandation motivée + instruments écartés et pourquoi]

# {Pour --review} Analyse des instruments
[revue des instruments mentionnés dans la term sheet : valorisation, dilution, mécanique propre — UNIQUEMENT les instruments]

# {Pour --review} Clauses de pacte — triage term sheet + renvoi
[chaque clause de pacte présente dans la term sheet — liquidation preference, anti-dilution, gouvernance/véto, vesting, drag/tag, leaver — FLAGUÉE avec sévérité 🟢/🟡/🟠/🔴, enjeu pour le client et bornage de négociation au stade term sheet ; PUIS renvoi de la rédaction détaillée vers /h-da:pacte-associes-review avec les options (a)/(b)/(c). Le playbook détaillé n'est pas déroulé ici, mais aucune clause n'est renvoyée sans avoir été flaguée et bornée.]

# Dimension fiscale — signalée, non traitée
[rappel que le volet fiscal de chaque instrument — notamment le régime BSPCE art. 163 bis G CGI [à vérifier] — relève d'un conseil fiscal / expert-comptable et n'est pas traité par ce skill]

# Une question hors de ma checklist habituelle
{Observation transversale qu'un relecteur attentif ferait — ex. cohérence du capital pleinement dilué avec un tour ultérieur, articulation des BSPCE avec le pacte, éligibilité de la société au régime BSPCE à confirmer. Omettre la ligne si rien d'honnête.}

# Que veux-tu faire ? Choisis une option et je la déroule :

1. **Rédiger** — je produis un premier brouillon (note de choix d'instrument motivée, ou note de revue des instruments de la term sheet) pour ta relecture avocat.
2. **Escalader** — note d'escalade vers l'approbateur configuré avec faits-clés, instrument(s) retenu(s) et décision attendue.
3. **Compléter les faits** — questions ouvertes à poser aux fondateurs / à l'investisseur / au fiscaliste avant d'avancer (éligibilité BSPCE, valorisation, profil exact des souscripteurs).
4. **Surveiller et attendre** — j'ajoute le dossier de financement au tracker avec note motivée et date de revisite (ex. en attente de l'avis du fiscaliste sur le régime BSPCE).
5. **Autre** — précise ce que tu veux en faire.
```

### Mode silencieux (livrable externe)

Si la sortie est destinée à être transmise hors du périmètre cabinet
(co-fondateurs non-juristes, investisseur) :
- En-tête de confidentialité : CONSERVER s'il protège le document ; l'adapter au
  destinataire (cf. CLAUDE.md §2).
- Note du relecteur : CONSERVER (point de contrôle unique).
- Narration de skill et renvois inter-commandes : COUPER (placer dans un message
  d'accompagnement séparé).
- Le statut **brouillon de travail** reste affiché : une note transmise ne
  devient jamais un document définitif du seul fait de l'envoi.

---

## Étape 1 (--comparer) — Cadrage

Lire le profil cabinet (CLAUDE.md droit-affaires, blocs M&A / Corporate et « vie
sociale ») et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`.

**Cadrage.** Avant toute recommandation, cerner le besoin réel. Questions de
cadrage :

- **Stade de la société** — amorçage, seed, série A : conditionne les
  instruments réalistes et l'ampleur de la levée.
- **Objectif** — intéresser et retenir des **équipes**, lever des **fonds
  externes**, financer une **croissance** : c'est le premier discriminant.
- **Profil des souscripteurs** — salariés / dirigeants assimilés salariés /
  advisors non salariés / investisseurs / associés existants. **Le BSPCE est
  juridiquement réservé** aux salariés et dirigeants assimilés salariés de
  sociétés éligibles (art. 163 bis G CGI [à vérifier]) ; pour un tiers non
  salarié, l'outil est le **BSA**. Ce point se vérifie avant toute
  recommandation.
- **Contraintes de dilution** — tolérance des fondateurs à une dilution
  **immédiate** (augmentation de capital) ou préférence pour une dilution
  **différée et conditionnelle** (BSPCE / BSA / OC).
- **Capacité à fixer une valorisation** — si la valorisation est difficile à
  arrêter maintenant, l'OC permet de la **différer** au tour qualifiant.

Ne pas trancher tant que ces points ne sont pas couverts ou explicitement
écartés. L'éligibilité de la société et du bénéficiaire pour le BSPCE est une
appréciation de fait → `[review]`.

---

## Étape 2 (--comparer) — Recommandation

1. Construire la **table comparative** depuis
   `${CLAUDE_SKILL_DIR}/../../references/instruments-financement-fr.md`, restreinte aux instruments
   pertinents pour le besoin cadré (axes : nature, bénéficiaires / souscripteurs,
   moment de la dilution, apport de trésorerie, finalité). Tags de provenance
   après chaque citation, **sans backticks dans les cellules**.
2. Formuler une **recommandation motivée** : un ou plusieurs instruments
   privilégiés, les instruments écartés et **pourquoi**. La motivation s'appuie
   sur les axes décisifs du dossier (qualité des souscripteurs, dilution
   immédiate ou différée, capacité à valoriser). Plusieurs instruments peuvent
   être **combinés** (ex. augmentation de capital de l'investisseur principal +
   plan de BSPCE pour l'équipe).
3. **Signaler la dimension fiscale et la renvoyer.** Chaque instrument comporte
   un volet fiscal — régime de faveur du BSPCE (art. 163 bis G CGI [à vérifier]),
   régime des intérêts d'OC, plus-values. Ce skill **signale** ce volet et le
   **renvoie à un conseil fiscal / expert-comptable**. Il ne le traite jamais au
   fond : pas de taux, pas de seuil, pas de montage.
4. **Signaler le renvoi `pacte-associes-review`** : dès qu'une levée externe est
   envisagée, un **pacte d'associés** l'accompagne presque toujours ; ses
   clauses (liquidation preference, anti-dilution, gouvernance, vesting) relèvent
   de `pacte-associes-review`. Le mentionner comme étape ultérieure.
5. Taguer `[review]` les appréciations de fait (valorisation, éligibilité BSPCE,
   ampleur de la dilution acceptable). Rappeler que la recommandation
   d'instrument est un **point de départ** : la documentation de l'opération
   reste à rédiger et à valider.

---

## Étape 1 (--review) — Identification

1. Lire le profil cabinet (CLAUDE.md droit-affaires, blocs M&A / Corporate et
   « vie sociale ») et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`. Identifier le
   **side** de l'utilisateur (fondateur / investisseur / société) et la posture
   pacte configurée — elle conditionne le ton du renvoi `pacte-associes-review`.
2. Identifier la **term sheet** : type d'opération (tour de seed, série A…),
   parties, droit applicable, **instruments mentionnés** (augmentation de
   capital, BSPCE, BSA, OC) et **clauses de pacte** esquissées (liquidation
   preference, anti-dilution, gouvernance, vesting…).

---

## Étape 2 (--review) — Analyse des instruments

Revue des **instruments** mentionnés dans la term sheet — et **uniquement** des
instruments. Pour chacun, à partir de `${CLAUDE_SKILL_DIR}/../../references/instruments-financement-fr.md` :

- **Valorisation** — pré-money / post-money retenue, prime d'émission ;
  appréciation économique → `[review]`.
- **Dilution** — immédiate et certaine (augmentation de capital) ou différée et
  conditionnelle (BSPCE / BSA / OC) ; effet sur le **capital pleinement dilué**
  (fully diluted) ; impact sur les fondateurs.
- **Mécanique propre** — pour les OC : échéance, taux, parité, décote, cap,
  déclencheur de conversion, sort à défaut de conversion (dette au passif). Pour
  les BSPCE / BSA : prix d'exercice, période d'exercice, éligibilité (BSPCE
  réservé aux salariés / dirigeants assimilés salariés). Pour l'augmentation de
  capital : droit préférentiel de souscription, sa suppression éventuelle.
- **Signalement fiscal** — tout volet fiscal (régime BSPCE art. 163 bis G CGI
  [à vérifier], intérêts d'OC, plus-values) est **signalé et renvoyé** à un
  fiscaliste — jamais traité au fond.

> **CLAUSES DE PACTE — flaguer et borner ici, router le détail.** Une term sheet de
> levée comporte presque toujours des clauses de pacte — **liquidation preference,
> anti-dilution / ratchet, gouvernance et droits de véto, vesting, drag / tag-along,
> good / bad leaver**. Ce skill **ne rédige pas** ces clauses et **ne déroule pas le
> playbook complet** (c'est le rôle de `pacte-associes-review`), MAIS il **ne les
> renvoie jamais sans les avoir traitées au stade term sheet**. Pour chaque clause
> de pacte présente :
> - **flaguer** avec une **sévérité** 🟢/🟡/🟠/🔴 ;
> - **énoncer l'enjeu** pour le client (ce que la clause lui coûte ou lui impose) ;
> - **borner activement** quand la term sheet est déséquilibrée — ex. véto investisseur
>   trop large → exiger seuils, carve-outs (budget approuvé), urgence et absence de
>   blocage abusif ; anti-dilution « méthode à définir » → **refuser** de la laisser
>   indéterminée et recommander une méthode avec exceptions usuelles ; vesting inversé /
>   leaver → poser les principes à négocier ; drag/tag → conditions de majorité, prix,
>   protection des fondateurs.
> PUIS **renvoyer la rédaction détaillée** vers `/h-da:pacte-associes-review`,
> avec les options : (a) enchaîner `pacte-associes-review`, (b) limiter
> `financement-startup` à l'analyse des instruments, (c) les deux en séquence.
> **Lister-puis-renvoyer sans flaguer ni borner est une sous-livraison** : le client
> arbitre et signe la term sheet *avant* l'étape pacte.

Tag inline `[review]` sur les appréciations de fait (valorisation, ampleur de la
dilution acceptable, éligibilité BSPCE). Respecter le plancher de sévérité
cross-skill : si `verifier-citations` remonte 🔴, ne pas dégrader
silencieusement.

---

## Étape 3 — Post-flight

Appel automatique de `verifier-citations` sur la sortie complète (mode défaut
`articles`). Le skill :

- extrait toutes les citations (art. L.NNN-N C.com., art. NNN C.civ., art. NNN
  CGI) ;
- vérifie l'existence et la version en vigueur via Légifrance ;
- annote : `[Légifrance ✓]`, `[abrogé]`, ou `[à vérifier]` en mode dégradé.

Articles attendus présents dans `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md` avec
identifiant Légifrance réel (→ à lire via `legifrance_get_article` ; `[Légifrance ✓]` seulement après lecture dans la session, sinon `[à vérifier]`) : L.210-2, L.227-9 C.com. Hors
index (→ `[à vérifier]` obligatoire) : **L.228-91 et s. C.com.** (valeurs
mobilières donnant accès au capital) et **l'art. 163 bis G CGI** (régime fiscal
BSPCE — relève du Code général des impôts, non couvert par l'index, et dont la
dimension fiscale est de toute façon renvoyée au fiscaliste).

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur
(« `verifier-citations` non exécuté — N citations à valider manuellement contre
Légifrance »).

---

## Ce skill ne fait pas

- Le **conseil fiscal** — régime de faveur du BSPCE (art. 163 bis G CGI), régime
  des intérêts d'OC, plus-values, droits d'enregistrement. La dimension fiscale
  est **signalée et renvoyée** à un conseil fiscal / expert-comptable, jamais
  traitée au fond.
- La **rédaction et le playbook détaillé des clauses de pacte d'associés** —
  liquidation preference, anti-dilution / ratchet, gouvernance et droits de véto,
  vesting, drag / tag-along, leaver. Ce skill les **flague, note leur sévérité et
  borne l'enjeu de négociation au stade term sheet**, puis renvoie la rédaction
  détaillée vers `/h-da:pacte-associes-review` — il ne les laisse
  jamais non traitées.
- La **valorisation** de la société — appréciation économique ; le skill la
  signale en `[review]`, il ne la chiffre pas.
- La **rédaction de la documentation** de l'opération (statuts modifiés, contrat
  d'émission, plan de BSPCE détaillé, pacte) — le skill compare et analyse, il
  ne rédige pas les actes.
- Les **formalités** post-opération (décisions collectives, dépôt, publicité,
  modification statutaire du capital) — actes de la société.
- La revue d'un **pacte d'associés** complet → `pacte-associes-review`.
- La revue d'une **LOI / term sheet d'opération M&A** (cession de titres) →
  `loi-term-sheet`. Ce skill traite la **levée de fonds** de la startup.
- Le conseil en **droit boursier** ou les opérations sur cibles cotées — hors
  périmètre.

---

## Ton

Technique, structuré, prudent. Le premier discriminant du choix d'instrument est
la **qualité des souscripteurs** : le BSPCE est juridiquement réservé aux
salariés et dirigeants assimilés salariés de sociétés éligibles ; un tiers non
salarié relève du BSA. Distinguer toujours la dilution **immédiate et certaine**
(augmentation de capital) de la dilution **différée et conditionnelle** (BSPCE /
BSA / OC). Deux frontières sont non négociables : (1) ce skill traite les
**instruments**, jamais les **clauses de pacte** — toute clause de pacte est
renvoyée à `pacte-associes-review` ; (2) ce skill ne donne **aucun conseil
fiscal** — la dimension fiscale, et notamment le régime de faveur du BSPCE (art.
163 bis G CGI), est signalée et renvoyée à un fiscaliste, jamais traitée au
fond. Toute sortie est un brouillon soumis à validation humaine (avocat).
