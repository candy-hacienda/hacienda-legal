---
name: gap-review
description: >
  Revue de Garantie d'Actif et de Passif (GAP) — spécificité française sans
  équivalent direct R&W US. Couvre 5 axes : (1) périmètre garantie, (2)
  mécanique financière (plafond, franchise, panier, durée), (3) procédure de
  mise en œuvre, (4) clauses sensibles side-dependent (knowledge qualifier,
  best knowledge, garantie de la garantie), (5) confrontation findings DD.
  Side cédant ou acquéreur obligatoire. Brouillon, validation humaine (avocat) M&A
  obligatoire.
version: "2.0.0"
argument-hint: "[GAP, side cédant/acquéreur, findings DD]"
authors: ["Hacienda"]
tags: [gap, ma, garantie-actif-passif, cession, spa]
---

# Skill — Revue Garantie d'Actif et de Passif (GAP)

> **BROUILLON, validation humaine (avocat) M&A OBLIGATOIRE.**
>
> Spécificité du droit français : la GAP n'a pas d'équivalent direct des Representations & Warranties anglo-saxonnes. Elle s'articule avec la garantie d'éviction (art. 1626 C.civ) et la garantie des vices cachés (art. 1641 C.civ), supplétives mais aménageables.
>
> Travail technique, **side-dependent** (cédant vs acquéreur — lecture inversée sur knowledge qualifier, plafond, durée), sensible aux usages marché (fourchettes = référence praticien, pas une norme codifiée).
>
> **Si le périmètre cédé est principalement un actif PI** (cession portefeuille brevets, licence exclusive, R&D) : orienter vers un spécialiste PI (hors périmètre de ce plugin). Ce skill couvre la GAP commerciale standard.

---

## Examples

<example>
<user>/h-da:gap-review ./GAP-cession-Y.pdf --side=acquereur --prix=15000000</user>
<response>
1. Lecture profil bloc M&A (side acquéreur, plafond cible 20-25 %, approbateur SPA)
2. Identification GAP : parties, date référence (closing/signing), prix cession (CLI override 15 M€)
3. Analyse 5 axes (périmètre / mécanique / procédure / clauses sensibles / DD)
4. Liste de points consolidée via appel interne `liste-de-points` (mode composant)
5. Post-flight `verifier-citations`
6. Sortie : en-tête confidentialité + note du relecteur + résumé exécutif + analyse par axe + liste de points + recommandation Accepter/Négocier/Refuser + question hors checklist + arbre 5 options

Exemple finding : plafond global 12 % du prix → 🟠 (sous fourchette acquéreur 20-25 %) → négocier hausse vers 20 % ou exiger plafonds spécifiques fiscal-social non absorbés par le plafond commun.
</response>
</example>

<example>
<user>/h-da:gap-review ./GAP-projet.pdf --side=cedant --prix=8000000</user>
<response>
Posture inverse côté cédant : plafond cible 10-15 %, demander knowledge qualifier, accepter best knowledge si défini limitativement, refuser garantie de la garantie au-delà du séquestre standard. Findings calibrés en miroir : plafond 18 % → 🟠 cédant (au-dessus fourchette) là où il serait 🟡 acquéreur.
</response>
</example>

<example>
<user>/h-da:gap-review ./GAP.pdf --side=acquereur --dd-findings=./rapport-dd.md --prix=20000000</user>
<response>
Axe 5 activé : confrontation findings DD ↔ garanties. Tableau gap analysis par finding matériel : garantie applicable + couverture (Oui/Partielle/Non) + recommandation (clause ad hoc / réduction de prix / abandon point).

Exemple : finding « litige fiscal pendant 450 k€ — redressement TVA 2025-03 » → garantie fiscale standard couvre l'objet, mais plafond commun 1 M€ jugé insuffisant si autre passif révélé → recommander plafond fiscal séparé minimum 500 k€ + durée jusqu'à prescription fiscale (3 ans + délai de reprise) `[à vérifier]`.
</response>
</example>

<example>
<user>/h-da:gap-review ./GAP-FR-UK-deal.pdf --side=acquereur</user>
<response>
Détection clauses common law importées (waiver, indemnification, representations & warranties, disclosure letter) → traduction en concepts FR (GAP française, déclarations et garanties au sens du droit FR, devoir précontractuel art. 1112-1 C.civ, articulation dol / réticence dolosive `[à vérifier]`).

Note du relecteur : « Doc bilingue détecté — ce skill applique le cadre français. La version UK doit être confrontée séparément contre le droit applicable et la juridiction effectivement retenus dans le SPA. »
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`, bloc M&A :
> - **Side habituel** — cédant (sell-side) / acquéreur (buy-side) / indifférent
> - **Posture GAP par défaut** — fourchettes durée / plafond / franchise / panier
> - **Approbateur signature SPA** — avocat M&A + GC + sponsor business
> - **Clauses "jamais acceptées"** côté habituel (ex. acquéreur : refus knowledge qualifier ; cédant : refus garantie de la garantie au-delà séquestre standard)

Si le profil n'est pas peuplé (`[A CONFIGURER]`) : stopper et demander `/h-da:entretien-demarrage`. Le bloc M&A est requis — sans side habituel ni fourchettes, le calibrage des findings est impossible.

---

## Intake

1. **Fichier GAP** — chemin du PDF / DOCX / Markdown (clauses GAP du SPA ou acte séparé)
2. **Side** — `--side=cedant` | `--side=acquereur` (**obligatoire**, pas d'auto-détection)
3. **Findings DD** (optionnel) — `--dd-findings=./rapport-dd.md` — active l'axe 5
4. **Prix cession** (optionnel) — `--prix=15000000` (en €) — active les ratios plafond/prix
5. **Mode `--distressed`** (optionnel) — overlay « cible en difficulté » : charge `${CLAUDE_SKILL_DIR}/../../references/distressed-overlay-fr.md` et centre la revue sur la **garantie de la garantie** (séquestre/GAPD face à un cédant insolvable) et le passif non purgé. Hors flag, si des **signaux de difficulté** apparaissent (procédure collective, cessation des paiements, cédant en perte, prix symbolique), **proposer** l'overlay sans l'imposer.
6. **Mode `--pe`** (optionnel) — overlay Private Equity side sponsor : charge `${CLAUDE_SKILL_DIR}/../../references/pe-spa-gap-overlay-fr.md` et centre la GAP sur la **matrice GAP / W&I / disclosure**. `--side=sponsor` par défaut (`--side=sponsor` ≡ côté acquéreur ; `--side=cedant` ≡ côté cédant sponsor). Hors flag, si des signaux PE apparaissent, **proposer** l'overlay sans l'imposer.

Si `--side` est absent : stopper et demander explicitement. Le skill est side-dependent, une analyse « neutre » n'a pas de sens praticien.

---

## Gate non-juriste

- [ ] `--side` fourni et confirmé (cédant ou acquéreur — pas d'analyse neutre)
- [ ] Profil cabinet bloc M&A lu, fourchettes usage cabinet identifiées
- [ ] Renvoi PI effectué si le périmètre cédé est PI-centric
- [ ] SIREN cible détecté → enrichissement Pappers/BODACC + alerte procédure collective si applicable
- [ ] 5 axes couverts (axe 5 sauté seulement si `--dd-findings` absent, et mentionné en note du relecteur)
- [ ] Matrice clauses sensibles lue côté `--side` configuré, pas en neutre
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur + résumé exécutif + analyse par axe + liste de points + recommandation + question hors checklist + arbre 5 options

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Points sociaux de due diligence : `boss_recherche`, `boss_get_document`. Points fiscaux : `bofip_rechercher` / `bofip_consulter` ne donnent que des circulaires ministérielles (fonds CIRC), **pas la base BOFiP-Impôts** — toute doctrine fiscale reste `[à vérifier]` sur bofip.impots.gouv.fr, sans tag `[BOFiP]`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/gap-review-<parties-slug>-YYYY-MM-DD.md
```

Si la liste de points dépasse 10 lignes ou si l'axe 5 contient des findings chiffrés sérialisables, générer en parallèle un dashboard HTML autonome via `renderDashboard()` de `@hacienda/core` (voir `${CLAUDE_SKILL_DIR}/../../references/dashboard-template.md`).

---

## Sortie

Structurer la sortie avec : faits retenus, droit applicable, analyse, incertitudes, sources consultées, décisions proposées, prochaine action et validation humaine. Toute source non consultée directement reste `[à vérifier]`.

## Étape 1 — Identification

1. Lire profil cabinet (bloc M&A) et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`.
2. Identifier : parties, side confirmé via CLI, prix de cession (CLI override prioritaire sinon extrait du doc), date de référence (signing/closing — critique pour l'axe 1), date d'effet GAP.
3. Détection SIREN cible → `company_full_profile` (Pappers ✓) + alerte procédure collective via BODACC. Tag `[Pappers]` ou `[BODACC]`.
4. Si `--dd-findings` fourni : indexer chaque finding (libellé, sévérité DD, quantification).

---

## Étape 2 — Axe 1 : Périmètre de la garantie

Vérifier :

- **Actifs garantis vs périmètre de cession** — cohérence (pas de couverture hors périmètre, pas d'exclusion sans justification claire)
- **Exclusions et réserves déclarées** — disclosure letter / annexes ; exclusions datées, identifiées, opposables (devoir précontractuel art. 1112-1 C.civ)
- **Date de référence** — closing ou signing ? (signing-driven : risque interim period acquéreur ; closing-driven : risque divulgation tardive cédant)
- **Date de réalisation** — effet rétroactif au closing, à compter de la notification, etc.
- **Articulation garanties légales** — éviction (art. 1626 C.civ), vices cachés (art. 1641 C.civ), délivrance (art. 1602 C.civ) : la GAP complète, n'écarte pas par principe `[review]`
- **Plancher d'ordre public — non négociable.** Une clause d'exclusivité ou d'écartement des recours ne peut **jamais** neutraliser le **dol et la réticence dolosive (art. 1137 C.civ)**, la **fraude**, ni plus largement les **vices du consentement (art. 1130 C.civ)** et l'exigence de **bonne foi contractuelle (art. 1104 C.civ)** : ces fondements sont d'ordre public et survivent à la GAP, hors plafond et hors durée. Face à une clause « garantie exclusive / garanties légales écartées dans toute la mesure permise », **affirmer explicitement** que rien ne limite l'action pour dol/fraude (1130/1137) ni le recours pour mauvaise foi (1104) — c'est 🔴 si la clause prétend les écarter absolument.

Findings 🟢/🟡/🟠/🔴 par sous-point. Tag `[review]` sur jugements subjectifs (opposabilité d'une disclosure tardive, étendue raisonnable d'une exclusion).

---

## Étape 3 — Axe 2 : Mécanique financière

Vérifier et tabuler :

| Paramètre | Trouvé | Usage marché (référence praticien) | Écart | Statut |
|---|---|---|---|---|
| Plafond global | x % du prix | 15-25 % standard (15 % bas / 25 % haut) | ± | 🟢/🟡/🟠/🔴 |
| Plafond fiscal / social spécifique | x € ou x % | Souvent séparé ou non-absorbé par plafond commun | ± | 🟢/🟡/🟠/🔴 |
| Plafond environnement / RGPD / PI | x € | Selon exposition cible | ± | 🟢/🟡/🟠/🔴 |
| Franchise / seuil de déclenchement (panier) | x € | 0,5-1 % du prix usuel | ± | 🟢/🟡/🟠/🔴 |
| Franchise absolue vs déduite | absolue / déduite | Déduite = avantageux acquéreur ; absolue = avantageux cédant | impact économique | 🟢/🟡/🟠/🔴 |
| Durée garantie générale | x ans | 18-24 mois standard | ± | 🟢/🟡/🟠/🔴 |
| Durée garantie fiscale / sociale | x ans | Prescription + délai de reprise (3 ans min) [à vérifier] | ± | 🟢/🟡/🟠/🔴 |

**Durée fiscale — ancrage droit de reprise.** La garantie fiscale doit survivre **au moins jusqu'à l'expiration du droit de reprise de l'administration**, et non sur la durée générale. Pour la **TVA, droit de reprise jusqu'à la fin de la 3ᵉ année suivante (art. L.176 LPF)** ; impôts directs : 3 ans (art. L.169 LPF), porté à 10 ans en cas d'activité occulte/fraude `[à vérifier]`. Une durée générale de 12-18 mois est **manifestement insuffisante** pour des exercices encore dans le délai de reprise (ex. exercices N-1/N-2) → 🔴, exiger une durée fiscale spécifique alignée sur la reprise + 30 jours.
| Durée garantie environnement | x ans | 5-10 ans selon exposition [à vérifier] | ± | 🟢/🟡/🟠/🔴 |

**Franchise absolue vs déduite.** Absolue = en deçà du seuil, aucune indemnisation ; au-delà, indemnisation **du dépassement seulement**. Déduite = au-delà du seuil, indemnisation **intégrale**. Impact économique très différent. `[review]` si la clause est ambiguë.

Toutes les fourchettes « usage marché » sont des références praticien — taguer `[connaissance modèle — à vérifier]` à proximité, jamais comme norme codifiée.

---

## Étape 4 — Axe 3 : Procédure de mise en œuvre

Vérifier :

- **Notification de mise en jeu** — formalisme (LRAR, email avec AR, plateforme), délai (30-60 jours usuels à compter de la connaissance du fait générateur)
- **Délai de contestation cédant** — 15-30 jours usuel ; au-delà, présomption d'acceptation possible `[review]`
- **Mode de règlement** — compensation sur earn-out / séquestre (escrow) / paiement direct ; séquestre = option la plus sécurisante acquéreur
- **Articulation earn-out / complément de prix** — compensation autorisée ? interdiction de retenue ?
- **Juridiction** — TC Paris en standard / arbitrage CMAP-CCI en deal international ou sensible ; vérifier opposabilité clause attributive (art. 48 CPC si parties commerçantes)
- **Tiers décideur / expert** — clause d'expertise art. 1592 C.civ pour contestations chiffrées (utile sur le quantum, à cadrer sur la procédure)

Findings 🟢/🟡/🟠/🔴 par sous-point.

---

## Étape 5 — Axe 4 : Clauses sensibles (matrice side-dependent en miroir)

| Clause | Côté acquéreur (buy-side) | Côté cédant (sell-side) |
|---|---|---|
| **Knowledge qualifier** (limitation aux faits connus du cédant) | ✗ Refuser — neutralise la garantie sur les passifs cachés | ✓ Demander — réduit l'exposition |
| **Best knowledge** (meilleure connaissance après vérifications raisonnables) | ✗ Refuser sauf définition opposable du standard | ✓ Demander — middle ground |
| **Plafond / prix ratio** | Cible 20-25 % — refus en deçà de 15 % | Cible 10-15 % — refus au-delà de 25 % |
| **Garantie de la garantie** (caution bancaire / séquestre / nantissement) | ✓ Exiger — sécurise le recouvrement | ✗ Refuser au-delà du séquestre minimal proportionné |
| **Durée garantie générale** | 24 mois min, 36 mois préférable | 12-18 mois |
| **Durée fiscale / sociale** | Aligner sur prescription + délai de reprise | Strict minimum prescription |
| **Franchise (panier)** | Faible, déduite | Élevée, absolue |
| **Non-concurrence cédant** (le cédant s'engage à ne pas concurrencer la cible pendant N années) | ✓ Exiger — durée 2-5 ans, périmètre activité + géographie, contrepartie souvent intégrée au prix | À négocier — durée courte (1-2 ans), périmètre restreint, contrepartie identifiée — art. L.420-1 C.com. si effet d'éviction de marché |

Voir `${CLAUDE_SKILL_DIR}/../../references/clauses-sensibles-fr.md` (clause #9 limitation de responsabilité, clause #15 changement de contrôle) pour articulation avec le droit commun.

Tag `[review]` sur l'arbitrage knowledge qualifier vs best knowledge — décision contextuelle (management dirigeant à racheter, profondeur DD, séquestre disponible).

---

## Étape 6 — Axe 5 : Confrontation findings DD (si `--dd-findings` fourni)

Pour chaque finding matériel du rapport de DD : identifier la garantie GAP applicable et évaluer la couverture.

| Finding DD | Sévérité DD | Garantie applicable | Couvert ? | Recommandation |
|---|---|---|---|---|
| ex. Litige fiscal pendant 450 k€ — TVA 2025-03 [utilisateur fourni] | 🟠 | Garantie fiscale | Partielle (plafond commun absorbé) | Plafond fiscal séparé 500 k€ |
| ex. Salarié protégé, contentieux prud'homal en cours | 🟠 | Garantie sociale | Oui | Inclure dans périmètre, durée jusqu'à prescription |
| ex. Non-conformité RGPD (registre incomplet) | 🟡 | Garantie RGPD spécifique [review] | Non si pas de garantie RGPD distincte | Ajouter clause ad hoc ou réduction de prix |
| ex. Brevet cédé sans inscription RNB | 🟠 | Orientation vers un spécialiste PI (hors périmètre) | — | Régulariser inscription avant closing |

**Risque public ≠ coût de travaux.** Un finding réglementaire inexécuté (ex. mise en demeure ICPE, arrêté préfectoral de mise en conformité non exécuté) ne se chiffre **pas** au seul coût des travaux : son inexécution expose à des **sanctions administratives et à l'exécution d'office aux frais de l'exploitant (art. L.171-8 C. env.)**, voire à une consignation de sommes, une suspension d'activité ou des sanctions pénales. Conséquence GAP : qualifier 🔴, exiger une **condition suspensive d'exécution + quitus de l'autorité (DREAL)** et/ou une garantie environnementale spécifique de longue durée (exposition sols/eaux 7-10 ans) avec plafond dédié — ne jamais se limiter à une indemnité égale au coût estimé des travaux.

**Plancher sévérité cross-skill.** Si la DD signale 🔴, ne pas dégrader silencieusement en 🟠 dans la GAP review. Si l'analyse GAP estime la couverture suffisante, le statut reste 🔴 sur le finding DD avec mention « couvert par garantie X » — ne pas réécrire la criticité source.

Si `--dd-findings` non fourni : sauter l'axe et mentionner dans la note du relecteur : « Axe 5 non exécuté — pas de findings DD fournis. La GAP ne peut pas être validée définitivement sans confrontation à une DD documentée. »

---

## Étape 6bis — Overlay difficulté (si `--distressed` ou overlay accepté)

**N'exécuter que si le mode distressed est actif.** Charger `${CLAUDE_SKILL_DIR}/../../references/distressed-overlay-fr.md` :

1. **Gate barre** : cible **déjà en RJ/LJ avec appel d'offres ouvert** → STOP overlay → renvoi `/h-da:reprise-a-la-barre` / `/h-da:cession-actifs-isoles` (l'acte serait judiciaire).
2. **D3 — garantie de la garantie (point central GAP distressed)** : une GAP d'un cédant en difficulté ne vaut rien sans **séquestre / garantie autonome à première demande (GAPD) / caution bancaire**. Sans elle, qualifier la GAP **🔴** (protection théorique) ; calibrer durée/montant sur les passifs latents (fiscal/social/environnemental, exposition longue).
3. **D2 — passif non purgé** : la GAP couvre-t-elle l'antérieur non révélé et les conséquences d'une procédure future ?
4. **D1 — période suspecte** : une GAP ou une sûreté consentie en période suspecte peut elle-même être attaquable (L.632-1/2) — signaler `[review]`, **ne pas dater** la cessation des paiements.
5. **D4** : transferts & solidarités (L.1224-1, L.1684 CGI/L.267 LPF, ICPE — cross-link avec l'axe environnement existant).
6. **Exposition dirigeant cédant** : nommer et renvoyer `/h-da:responsabilite-dirigeant` ; ne pas évaluer.

Intégrer les findings distressed dans la liste de points (sévérité side-aware). **Ne pas chiffrer** le passif (`[à compléter]`).

---

## Étape 6ter — Overlay PE — matrice GAP/W&I/disclosure (si `--pe` ou overlay accepté)

**N'exécuter que si le mode PE est actif.** Charger `${CLAUDE_SKILL_DIR}/../../references/pe-spa-gap-overlay-fr.md` :
1. **W1 — matrice GAP / W&I / disclosure** : ce que la police W&I couvre vs la GAP ; exclusions (known issues, forward-looking, environnement, transfer pricing) ; alignement rétention / de minimis / basket / cap **police ↔ GAP** ; disclosure letter comme outil contre les exclusions « known ».
2. **W2 — recours limité côté cédant sponsor** : GAP « nil recourse / 1 € » adossée W&I — l'acquéreur s'appuie sur la police, pas sur le covenant du cédant sortant ; security for claims ; sandbagging / anti-sandbagging `[review]`.
3. **W3 — discipline disclosure FR** : articulation disclosure letter ↔ devoir d'information `1112-1 C.civ [à vérifier]` ; fair disclosure ; data room comme disclosure ; réticence dolosive `1137 C.civ [à vérifier]`.

**Gate France/Lux** (cf. module partagé) : docs fonds Lux hors périmètre. Intégrer les findings PE dans la liste de points (sévérité side-aware sponsor). Si la cible est aussi en difficulté, **les overlays `--pe` et `--distressed` s'empilent** sans se dupliquer (garantie de la garantie reste l'axe distressed). **Ne pas chiffrer** (`[à compléter]`).

---

## Étape 7 — Liste de points consolidée

Appel interne au skill `liste-de-points` en **mode composant** (findings array en input, pas de fichier intermédiaire). Retour du tableau seul (6 colonnes) ; en-tête de confidentialité et note du relecteur fournis par `gap-review`.

Tri par criticité décroissante 🔴 → 🟠 → 🟡 → 🟢. À criticité égale : tri par axe (1 → 5) puis par numéro de paragraphe GAP.

Si aucun écart : retour explicite — `Aucun point de vigilance identifié contre la posture configurée. GAP conforme aux usages marché.` — sans remplissage.

---

## Étape 8 — Post-flight `verifier-citations`

Appel automatique sur la sortie complète. Articles C.civ / C.com. cités doivent exister dans `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md`. À défaut, tag `[à vérifier]` et ligne dédiée en note du relecteur. Si PISTE non configuré : mode dégradé documenté.

---

## Étape 9 — Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — voir les 4 variantes dans CLAUDE.md du plugin]

> ⚠️ Note du relecteur
> - **Sources :** Légifrance ✓ / Judilibre ✓ / Pappers ✓ / BODACC ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** intégrale ({N} pages GAP + {M} pages annexes disclosure)
> - **Signalé pour ton jugement :** {N} éléments marqués [review] | aucun
> - **Fraîcheur :** recherche jurisprudence post-{date} sur articulation GAP / 1112-1 / 1626 / 1641 — {N} arrêts intégrés
> - **Avant de t'appuyer dessus :** {action concrète OU « prêt pour relecture »}

# Résumé exécutif

{Trois phrases pour comité d'investissement / DG / sponsor business. Pas de
jargon. Une ligne bottom-line : signer / négocier sur N points / refuser.
Une ligne de risque dominant (plafond insuffisant, knowledge qualifier
abusif, exposition fiscale non couverte). Une ligne de prochaine action.}

# Analyse par axe

## Axe 1 — Périmètre
{Findings + statuts}

## Axe 2 — Mécanique financière
{Tableau usage marché + écarts}

## Axe 3 — Procédure
{Notification, contestation, règlement, juridiction}

## Axe 4 — Clauses sensibles (matrice side-dependent)
{Lecture côté {side configuré} avec décision recommandée par clause}

## Axe 5 — Confrontation DD (si fourni)
{Tableau gap analysis finding par finding ; sinon mention « axe non exécuté »}

## Overlay difficulté (si `--distressed`)
- Gate barre : {à la barre → renvoi reprise/cession-actifs | GAP privée, overlay appliqué}
- Garantie de la garantie : {séquestre/GAPD présent | absent → 🔴} [review]
- Passif non purgé / période suspecte (L.632-1/2) : {risque [review] | sans objet}
- Renvois : {spa-review --distressed / responsabilite-dirigeant / asset-vs-share-distress}

## Overlay PE (si `--pe`)
- Side : {sponsor | cedant}
- Matrice : {W1 GAP/W&I/disclosure · W2 recours limité · W3 disclosure FR}
- Renvois PE : {spa-review --pe / pacte-associes-review --pe}

# Liste de points

| # | Axe | Clause | Statut | Risque | Position souhaitée ({side}) | Formulation proposée |
|---|---|---|---|---|---|---|
| ... | ... | ... | 🔴/🟠/🟡/🟢 | ... | ... | ... |

# Recommandation

{Accepter / Négocier / Refuser} — justification 2-3 lignes liée à la posture
M&A configurée, au side et aux points 🔴 / 🟠. Pour acquéreur : exiger
plafond minimum X %, knowledge qualifier retiré, séquestre. Pour cédant :
plafond maximum Y %, durée plafonnée Z mois, knowledge qualifier maintenu.

# Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait. Omettre si rien
d'honnête à dire — ne pas fabriquer.}

# Que veux-tu faire ? Choisis une option et je la déroule :

1. **Rédiger** — je produis un projet de courrier de négociation à la contrepartie reprenant la liste de points priorisée, ou une note GAP pour comité d'investissement.
2. **Escalader** — note d'escalade vers {approbateur SPA configuré} avec faits-clés, risque dominant et décision attendue avant signature.
3. **Compléter les faits** — questions ouvertes à poser au {cédant / acquéreur / management cible / conseil} avant d'avancer sur la GAP.
4. **Surveiller et attendre** — j'ajoute la GAP au tracker du deal avec note motivée et date de revisite (closing, expiration garantie, échéance compensation).
5. **Autre** — précise.
```

### Mode silencieux (livrable externe)

Si la sortie est destinée à un comité d'investissement, sponsor business non-juriste, contrepartie ou conseil tiers :

- Conserver en-tête de confidentialité (si destinataire dans le périmètre du secret) et note du relecteur.
- Retirer narration de skill et renvois inter-commandes (les placer dans un message séparé).
- Le livrable doit se lire comme s'il avait été rédigé par un associé M&A.

---

## Ce skill ne fait pas

- Signer ou exécuter le SPA (acte des parties + approbateur configuré).
- Rédiger une GAP from scratch — `v1.1+`.
- Revue d'un SPA complet hors GAP (conditions suspensives, MAC clause, locked box vs completion accounts) — `v1.1+`.
- Revue PI-centric d'un actif cédé → hors périmètre : orienter vers un spécialiste PI.
- Conseil fiscal détaillé sur la cession (régime plus-values, droits d'enregistrement, intégration fiscale, neutralité 210-A CGI) — signalement uniquement, renvoi conseil fiscal.
- Conseil social détaillé (information-consultation CSE art. L.2312-8 C. trav. `[à vérifier]`, transfert des contrats art. L.1224-1 C. trav. `[à vérifier]`) — signalement, renvoi.
- Préparer une déclaration de créance si la cible entre en procédure collective post-signing → renvoyer `/h-da:declaration-creance`.
- **Dater** la cessation des paiements / la période suspecte en mode `--distressed` (semaines relatives ; date fixée par le tribunal).
- **Couvrir une GAP de cession judiciaire à la barre** — renvoi `/h-da:reprise-a-la-barre` / `/h-da:cession-actifs-isoles`.
- **Souscrire / placer** la police W&I ni en interpréter les conditions au fond en mode `--pe` (signalée, articulation seulement).
- **Traiter au fond** la requalification fiscale/sociale (nommée et renvoyée).

---

## Ton

Technique, structuré, factuel. **Side-dépendant explicite** : à chaque recommandation, rappeler « côté acquéreur » ou « côté cédant ». Les fourchettes de marché sont des références praticien, jamais une norme codifiée (tag `[connaissance modèle — à vérifier]`). Signaler la spécificité française vs R&W US chaque fois qu'une clause importe un concept anglo-saxon (waiver, indemnification, disclosure letter). La sortie est un brouillon soumis à validation humaine (avocat) M&A avant signature du SPA — la GAP engage le quantum sur plusieurs années, l'erreur d'analyse est coûteuse.
