---
name: prevention-difficultes
description: >
  Oriente une entreprise en difficulté vers le bon dispositif préventif et en
  prépare la demande : mandat ad hoc (L.611-3), conciliation (L.611-4 s.,
  accord constaté ou homologué, privilège de new money L.611-11), sauvegarde
  accélérée (L.628-1 s.) comme passerelle vers le collectif. Gate diagnostic
  obligatoire : la cessation des paiements depuis plus de 45 jours ferme la
  conciliation et impose une procédure collective de droit commun (renvoi).
  Dispositifs amiables strictement confidentiels (L.611-15). Brouillon,
  validation humaine (avocat) OBLIGATOIRE.
version: "2.0.0"
argument-hint: "[--orienter (défaut) | --draft, dispositif visé, état cessation des paiements, nature de la difficulté, side débiteur]"
authors: ["Hacienda"]
tags: [prevention, mandat-ad-hoc, conciliation, sauvegarde-acceleree, l611, entreprise-en-difficulte]
---

# Skill — Prévention des difficultés (mandat ad hoc / conciliation / sauvegarde accélérée)

> **BROUILLON, VALIDATION HUMAINE (AVOCAT) OBLIGATOIRE.**
>
> **🔴 Gate cessation des paiements.** La cessation des paiements — impossibilité
> de faire face au passif exigible avec l'actif disponible (art. L.631-1 C.com.)
> — commande tout :
> - **Pas en cessation des paiements** (ou difficulté seulement prévisible) →
>   mandat ad hoc et conciliation ouverts.
> - **Cessation des paiements depuis ≤ 45 jours** → conciliation encore possible
>   (art. L.611-4 C.com.).
> - **Cessation des paiements depuis > 45 jours** → conciliation **fermée** ;
>   obligation de déclarer la cessation des paiements (« dépôt de bilan ») dans
>   les 45 jours et d'ouvrir un redressement ou une liquidation judiciaire
>   (art. L.631-4 C.com. `[à vérifier]`). **Hors périmètre de ce skill** :
>   signaler et renvoyer vers un avocat restructuring / le mode collectif.
>
> **Confidentialité (art. L.611-15 C.com.).** Mandat ad hoc et
> conciliation sont **strictement confidentiels**. Le livrable CONSERVE son
> en-tête de confidentialité ; ne jamais le diffuser à des tiers non liés par la
> confidentialité. Seul l'accord **homologué** fait l'objet d'une publicité.

---

## Examples

<example>
<user>/h-da:prevention-difficultes --orienter "trésorerie tendue, négociation avec 3 banques, pas en cessation des paiements"</user>
<response>
1. Lecture profil cabinet (position dominante : débiteur).
2. **Gate cessation des paiements** : l'entreprise fait encore face à son passif exigible → PAS en cessation des paiements. Dispositifs préventifs ouverts.
3. Orientation : difficulté financière avérée, besoin de négocier avec un petit nombre de créanciers identifiés et de préserver la confidentialité → **mandat ad hoc** (souple, sans limite de durée) ou **conciliation** (cadre, 4+1 mois, accord constaté/homologué). Recommandation motivée selon l'objectif (simple négociation vs accord exécutoire + new money).
4. Sortie : note d'orientation confidentielle + arbre d'options (dont `--draft` pour la requête).
</response>
</example>

<example>
<user>/h-da:prevention-difficultes --draft "conciliation, accord avec apport de trésorerie d'un actionnaire"</user>
<response>
Mode conciliation, avec apport d'argent frais. Étape 4 :
- Requête en ouverture de conciliation au président du tribunal (désignation d'un conciliateur, mission, durée 4 mois prorogeable 1 mois).
- Choix accord **homologué** (vs constaté) pour faire bénéficier l'apporteur du **privilège de conciliation / new money** (art. L.611-11 C.com.) : paiement prioritaire en cas de procédure collective ultérieure. Conditions d'homologation à vérifier (pas en cessation des paiements ou l'accord y met fin, pérennité, pas d'atteinte aux non-signataires) `[review]`.
Sortie : requête + structure d'accord + note sur l'arbitrage constaté/homologué.
</response>
</example>

<example>
<user>/h-da:prevention-difficultes --orienter "cessation des paiements depuis 2 mois, plus de trésorerie"</user>
<response>
**Gate cessation des paiements** : cessation des paiements depuis ~60 jours, soit **> 45 jours**.

🔴 La conciliation est **fermée** (art. L.611-4 C.com.). L'entreprise est tenue de déclarer la cessation des paiements dans les 45 jours de sa survenance (art. L.631-4 C.com. `[à vérifier]`) et d'ouvrir un **redressement ou une liquidation judiciaire**. Le retard expose le dirigeant à des sanctions `[review]`.

**Hors périmètre de ce skill.** Renvoi : avocat spécialisé restructuring / mode procédure collective de droit commun. Ce skill ne prépare pas la déclaration de cessation des paiements.
</response>
</example>

<example>
<user>/h-da:prevention-difficultes --orienter "conciliation en cours, un créancier minoritaire bloque l'accord"</user>
<response>
Conciliation engagée mais un créancier minoritaire refuse un accord soutenu par la majorité → orientation **sauvegarde accélérée** (art. L.628-1 s. C.com.) : procédure collective rapide ouverte **sur la base de la conciliation** pour imposer le plan pré-négocié aux récalcitrants, dans un délai bref (le tribunal arrête le plan sous ~2 mois, prorogeable `[à vérifier]`). Conditions : conciliation préalable, comptes établis, projet de plan susceptible d'un soutien suffisant `[review]`. C'est la passerelle de l'amiable vers le collectif.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`, bloc procédures collectives :
> - **Position dominante** — créancier / **débiteur** (cas dominant ici) / mandataire / mixte
> - **Tribunaux habituels** — président du tribunal compétent (commerce / judiciaire selon l'activité)

Si le bloc est `[A CONFIGURER]` : stopper et demander `/h-da:entretien-demarrage`.

---

## Intake

1. **Mode** — `--orienter` (diagnostic + recommandation de dispositif, défaut) | `--draft` (brouillon de requête / structure d'accord)
2. **État de cessation des paiements** — non / oui depuis ≤ 45 j / oui depuis > 45 j / incertain (**déterminant** — voir gate). Si incertain : poser la question avant d'avancer (passif exigible vs actif disponible).
3. **Nature de la difficulté** — juridique / économique / financière, avérée ou prévisible
4. **Créanciers concernés** — nombre, identité, enjeux (banques, fournisseurs critiques, fisc/social)
5. **Objectif** — simple négociation confidentielle / accord exécutoire / apport d'argent frais (new money) / imposer un plan à une minorité
6. **Side** — `débiteur` (défaut) ou `créancier` invité à la conciliation

---

## Gate non-juriste

- [ ] **Gate cessation des paiements tranché** : si > 45 j → STOP, renvoi droit commun, AUCUN dispositif préventif proposé
- [ ] Profil cabinet lu, position (débiteur/créancier) et tribunal identifiés
- [ ] Dispositif recommandé cohérent avec l'objectif (mandat ad hoc = souplesse/confidentialité ; conciliation = cadre + accord exécutoire + new money ; sauvegarde accélérée = imposer un plan à une minorité, suppose une conciliation préalable)
- [ ] Confidentialité L.611-15 rappelée ; en-tête de confidentialité **conservé** (sauf accord homologué publié)
- [ ] Durées et seuils réglementaires tagués `[à vérifier]` (4+1 mois conciliation, délais sauvegarde accélérée, conditions d'homologation)
- [ ] Si new money envisagé : arbitrage accord **homologué** (privilège L.611-11) vs **constaté** explicité
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`

---

## Outils MCP à privilégier

- Identification entreprise + difficultés publiées : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures` (vérifier qu'aucune procédure collective n'est déjà ouverte).
- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `eurlex_recherche`, `eurlex_consulter`.

---

## Emplacement des sorties

```
outputs/prevention-difficultes-<entreprise-slug>-YYYY-MM-DD.md
```

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle — CONSERVÉ (dispositif confidentiel L.611-15)]

> ⚠️ Note du relecteur
> - **Sources :** Légifrance ✓ / BODACC ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** situation décrite + {N} pièces
> - **Signalé pour ton jugement :** {N} éléments [review] (cessation des paiements, conditions d'homologation, seuils) | aucun
> - **Fraîcheur :** réforme du 15 septembre 2021 (directive restructuration) — vérifier durées/seuils en vigueur | recherche impossible
> - **Avant de t'appuyer dessus :** {action — ex. confirmer la date exacte de cessation des paiements} | « prêt pour relecture »

# Diagnostic — cessation des paiements
{Non / oui ≤ 45 j / oui > 45 j / incertain [review]}. Conséquence sur l'éligibilité aux dispositifs préventifs.

# Dispositif recommandé
{Mandat ad hoc / conciliation (constaté ou homologué) / sauvegarde accélérée / renvoi droit commun} — justification liée à l'objectif et au gate.

# Mise en œuvre
{Selon le mode : note d'orientation OU brouillon de requête / structure d'accord — Étapes 3 à 5.}

# Une question hors de ma checklist habituelle
{Observation transversale — ex. risque de soutien abusif si new money mal cadré, articulation avec une caution dirigeant. Omettre si rien d'honnête.}

# Que veux-tu faire ? Choisis une option :
1. **Rédiger** — je produis la requête (mandat ad hoc / conciliation) ou la structure d'accord.
2. **Escalader** — note vers {approbateur configuré} pour décision d'engager le dispositif.
3. **Compléter les faits** — questions (date exacte de cessation des paiements, état du passif exigible / actif disponible, position des créanciers clés).
4. **Surveiller et attendre** — suivi avec point de revisite (avant que la cessation des paiements n'atteigne 45 j).
5. **Autre** — précise.
```

### Note de confidentialité (pas un « mode silencieux »)

Contrairement à une mise en demeure, le dispositif préventif est **confidentiel**. Ne pas produire de version « à diffuser » : le livrable reste interne au débiteur et à ses conseils. Une requête s'adresse au **président du tribunal**, pas à la contrepartie.

---

## Étape 1 — Diagnostic cessation des paiements (gate)

1. Lire le profil cabinet (bloc procédures collectives).
2. Vérifier via `bodacc_procedures` qu'**aucune procédure collective n'est déjà ouverte** (sinon le dispositif préventif est sans objet → renvoi).
3. **Trancher la cessation des paiements** (art. L.631-1 C.com.) : passif exigible vs actif disponible. Date de survenance si applicable.
   - Non / prévisible → Étape 2.
   - Oui ≤ 45 j → conciliation encore possible, Étape 2.
   - Oui > 45 j → **STOP** : obligation de déclarer (art. L.631-4 C.com. `[à vérifier]`), renvoi droit commun. Ne pas proposer de dispositif préventif.
   - Incertain → poser la question, ne pas présumer.

---

## Étape 2 — Orientation vers le dispositif

| Objectif dominant | Dispositif | Pourquoi |
|---|---|---|
| Négocier discrètement avec quelques créanciers, sans cadre rigide | **Mandat ad hoc** (L.611-3) | souple, sans durée légale, confidentiel, mission sur mesure |
| Accord exécutoire avec les principaux créanciers, éventuellement avec new money | **Conciliation** (L.611-4 s.) | cadre (4+1 mois), accord constaté ou homologué, privilège L.611-11 |
| Imposer un plan pré-négocié à une minorité de créanciers récalcitrants | **Sauvegarde accélérée** (L.628-1 s.) | passerelle collectif rapide, suppose une conciliation préalable |
| Cessation des paiements > 45 j | **Droit commun (RJ/LJ)** | hors périmètre — renvoi |

---

## Étape 3 — Mandat ad hoc (L.611-3)

- À la demande du **débiteur** au président du tribunal ; désignation d'un mandataire ad hoc dont le président **fixe la mission** (typiquement : négocier un rééchelonnement avec les principaux créanciers).
- Pas de durée légale (souplesse) ; **confidentiel** (L.611-15).
- Brouillon (`--draft`) : requête en désignation d'un mandataire ad hoc — exposé des difficultés, mission proposée, éventuelle suggestion de mandataire.

---

## Étape 4 — Conciliation (L.611-4 s.)

- **Conditions** : difficulté juridique, économique ou financière, avérée ou prévisible ; **pas en cessation des paiements depuis plus de 45 jours** (L.611-4).
- **Durée** : 4 mois, prorogeable d'1 mois (L.611-6 `[à vérifier]`). Désignation d'un conciliateur, mission de favoriser un accord (L.611-7).
- **Issue de l'accord** :
  - **Constaté** par le président (art. L.611-8, I) — confidentiel, force exécutoire entre les parties.
  - **Homologué** par le tribunal (art. L.611-8, II) — publicité, mais déclenche le **privilège de conciliation / new money** (art. L.611-11) et la sécurisation des apports. Conditions d'homologation `[review]` : absence de cessation des paiements ou accord y mettant fin ; pérennité de l'activité ; pas d'atteinte aux intérêts des créanciers non signataires.
- **New money (L.611-11)** : les personnes apportant, dans l'accord homologué, un nouvel apport en trésorerie ou un nouveau bien/service, bénéficient d'un **paiement prioritaire** en cas de procédure collective ultérieure. Arbitrer **homologué** si new money en jeu.
- Brouillon (`--draft`) : requête en ouverture de conciliation + ossature de l'accord (parties, concessions, calendrier, clause de new money le cas échéant).

---

## Étape 5 — Sauvegarde accélérée (L.628-1 s.)

- **Passerelle conciliation → collectif.** Ouverte au débiteur **engagé dans une conciliation** ayant élaboré un projet de plan susceptible de recueillir un soutien suffisant des créanciers, pour **imposer le plan** à une minorité via les classes de parties affectées.
- **Conditions** `[à vérifier]` : conciliation préalable ; comptes établis (commissaire aux comptes / expert-comptable) ; seuils issus de la réforme du 15 septembre 2021.
- **Délai** : le tribunal arrête le plan dans un délai bref (≈ 2 mois, prorogeable `[à vérifier]`, art. L.628-8).
- Ce skill **oriente** vers la sauvegarde accélérée et en pose les conditions ; l'ouverture et la conduite de la procédure relèvent de l'avocat / mandataire (voir « Ce skill ne fait pas »).

---

## Étape 6 — Post-flight `verifier-citations`

Articles à vérifier : L.611-3, L.611-4, L.611-6, L.611-7, L.611-8, L.611-10, L.611-11, L.611-15, L.628-1, L.628-8, L.631-1, L.631-4 C.com. Les lire via `legifrance_get_article` ; ceux non lus dans la session restent `[à vérifier]` (l'index `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md` donne les identifiants, ce n'est pas une vérification). **Fraîcheur impérative** : l'ordonnance du 15 septembre 2021 (transposition directive (UE) 2019/1023 restructuration) a remanié durées, seuils et classes — toute durée/seuil non confirmé sur source reste `[à vérifier]`. Mode dégradé documenté si PISTE absent.

---

## Ce skill ne fait pas

- Préparer la **déclaration de cessation des paiements** (« dépôt de bilan ») ni l'ouverture d'un RJ/LJ de droit commun → renvoi avocat restructuring.
- Conduire la procédure de **sauvegarde accélérée** (constitution des classes, vote, arrêté du plan) — orientation et conditions seulement.
- Rédiger l'**accord de conciliation** définitif et négocier à la place des parties — produit une ossature, pas l'acte final négocié.
- Conseiller sur la **responsabilité du dirigeant** (soutien abusif, L.651-2 insuffisance d'actif) — signalement uniquement, renvoi.
- Traiter une **créance** en procédure collective ouverte → renvoyer `declaration-creance`.
- Fixer une durée, un seuil ou une condition comme certaine sans vérification post-réforme 2021 → `[à vérifier]`.

---

## Ton

Technique, prudent, **piloté par le gate cessation des paiements** : tant qu'il n'est pas tranché, ne pas recommander de dispositif. Insister sur la **confidentialité** des dispositifs amiables (ne pas produire de document destiné à des tiers). Distinguer nettement mandat ad hoc (souplesse), conciliation (cadre + new money) et sauvegarde accélérée (imposer un plan). Rappeler que toute durée/seuil dépend de l'état du droit post-réforme 2021 et reste `[à vérifier]` si non confirmé. Brouillon soumis à validation humaine (avocat) avant toute saisine du tribunal.
