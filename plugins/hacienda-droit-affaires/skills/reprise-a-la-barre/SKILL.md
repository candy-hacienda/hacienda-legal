---
name: reprise-a-la-barre
description: >
  Playbook tactique côté candidat-repreneur pour construire, optimiser et
  défendre une offre de reprise sur une entreprise déjà placée en redressement
  ou liquidation judiciaire, dans le cadre d'un appel d'offres ouvert (plan de
  cession, L.642-1 s.). Double gate : (1) porte d'entrée — la cible est-elle déjà
  en RJ/LJ avec appel d'offres ouvert ? sinon, si la cession peut être préparée
  confidentiellement en amont, renvoi `pre-pack-cession` ; (2) recevabilité de
  l'offre — éligibilité du repreneur (L.642-3, interdictions / interposition
  prohibée) et offre ferme et écrite (L.642-2), pas une LOI indicative. Opère les
  mentions de l'offre (L.642-2), les contrats repris désignés (L.642-7), les
  critères de choix du tribunal (L.642-5), le sort des sûretés (L.642-12) et les
  voies de recours (L.661-6). Côté repreneur uniquement. Ne rédige pas l'acte de
  cession → `spa-review` / `gap-review` / `closing-checklist-fr`. Brouillon,
  validation humaine (avocat) OBLIGATOIRE.
version: "2.0.0"
argument-hint: "[note tactique (mode unique), cible en RJ ou LJ ?, appel d'offres ouvert ?, offre ferme ou LOI ?, côté repreneur]"
authors: ["Hacienda"]
tags: [reprise-a-la-barre, plan-de-cession, distressed-m&a, restructuring, l642, offre-de-reprise, redressement-judiciaire, liquidation-judiciaire]
---

# Skill — Reprise à la barre (offre de reprise en plan de cession)

> **BROUILLON, VALIDATION HUMAINE (AVOCAT) OBLIGATOIRE.**
>
> **🔴 Double gate.**
> - **Gate 1 — porte d'entrée** : ce skill ne joue que si la cible est **déjà en
>   RJ ou LJ avec un appel d'offres ouvert**. Si aucune procédure n'est ouverte et
>   que la cession peut être **préparée confidentiellement** (mandat ad hoc /
>   conciliation) → ce n'est pas une reprise à la barre → **renvoi
>   `pre-pack-cession`**.
>
> **Régime applicable — la LJ n'est PAS un préalable.** En **redressement
> judiciaire**, le tribunal peut arrêter une **cession totale ou partielle dès la
> période d'observation** : c'est **L.631-22** qui le permet et rend applicable le
> régime du plan de cession **L.642-1 et s.** Ne jamais dire qu'il faut attendre une
> liquidation, ni que la cession serait impossible pendant l'observation.
> - **Gate 2 — recevabilité de l'offre** : (a) **éligibilité du repreneur
>   (L.642-3)** — dirigeants, parents et alliés jusqu'au 2nd degré, interposition
>   de personne sont **interdits d'acquérir** → offre **nulle** ; (b) **offre ferme
>   et écrite (L.642-2)** — une **LOI / lettre d'intention indicative n'est pas**
>   une offre judiciaire recevable, et l'offre déposée est **irrévocable**.
>
> **Point pivot.** Le **tribunal** choisit l'offre sur les critères de **L.642-5**
> (pérennité de l'emploi, paiement des créanciers, garanties d'exécution) — **pas**
> le prix le plus élevé seul, ni la préférence du dirigeant. Une offre optimisée se
> construit sur ces trois axes.

## Examples

1. **LOI ≠ offre.** Le candidat n'a déposé qu'une lettre d'intention indicative
   avant la date limite. → Gate 2 (b) : une LOI n'est **pas** une offre L.642-2 →
   convertir en **offre ferme et écrite** (périmètre, contrats, prix, financement,
   emplois, garanties, date) avant le dépôt, sinon irrecevable.

2. **Repreneur inéligible.** Le candidat est contrôlé par un parent de l'ancien
   dirigeant, via une holding interposée. → Gate 2 (a) : **interdiction d'acquérir
   (L.642-3)** → l'offre serait **nulle**. STOP : signaler l'inéligibilité avant
   tout travail sur l'offre ; une dérogation du tribunal est exceptionnelle.

3. **Cession encore préparable.** Aucune procédure ouverte, le dirigeant veut
   organiser discrètement la vente. → Gate 1 : pas d'appel d'offres ouvert →
   ce n'est pas une reprise à la barre → **renvoi `pre-pack-cession`** (montage
   confidentiel amont).

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`, bloc procédures collectives + bloc M&A :
> - **Position dominante** — ce skill suppose le **côté repreneur** (le candidat à la reprise)
> - **Tribunaux habituels** — tribunal compétent (commerce / judiciaire selon l'activité)
> - **Politique PII** — `passive` / `active` (défaut) / `strict` + seuil B

Si le bloc est `[A CONFIGURER]` : stopper et demander `/h-da:entretien-demarrage`.

---

## Intake

1. **Côté** — **repreneur** (le candidat à la reprise). Pas de mode neutre ; si l'utilisateur est côté débiteur/orchestration, renvoyer `pre-pack-cession` ou `prevention-difficultes`.
2. **État de la procédure** — la cible est-elle **déjà** en RJ / LJ ? appel d'offres **ouvert** ? date limite de dépôt des offres ? administrateur désigné ? (**déterminant** — voir Gate 1). Si aucune procédure ouverte → Gate 1 renvoie `pre-pack-cession`.
3. **Nature de l'intérêt du repreneur** — offre **ferme et écrite** déjà prête / simple **LOI indicative** / intention (**déterminant** — voir Gate 2 (b)).
4. **Éligibilité** — le candidat a-t-il un lien avec le dirigeant / un parent / une société interposée ? (**déterminant** — voir Gate 2 (a), L.642-3).
5. **Périmètre visé** — actifs (fonds, immeuble), **contrats à reprendre** (bail, licence, fournisseur), **emplois repris**, **actifs PI** (marques, brevets) ; risque de cherry-picking ?
6. **Concurrence** — d'autres offres déposées ? surenchère possible ? **sûretés** sur les actifs (nantissement, gage) ?

---

## Gate non-juriste

- [ ] **Gate 1 — porte d'entrée tranchée** : cible **déjà en RJ/LJ avec appel d'offres ouvert** → ce skill ; sinon (cession préparable confidentiellement) → STOP + renvoi `pre-pack-cession`
- [ ] **Régime confirmé** : en RJ, cession possible **dès la période d'observation** (L.631-22 → L.642-1 s.) ; ne jamais exiger une LJ préalable
- [ ] **Gate 2 (a) — éligibilité (L.642-3)** : pas de dirigeant / parent / interposition prohibée ; si lien suspect → STOP, offre potentiellement nulle, `[review]`
- [ ] **Gate 2 (b) — offre ferme et écrite (L.642-2)** : ce qui est sur la table est-il une **offre** (périmètre, contrats, prix, financement, emplois, garanties, date) ou une **LOI** ? une LOI est irrecevable
- [ ] **Point pivot rappelé** : le tribunal choisit sur **L.642-5** (emploi, créanciers, garanties), pas le prix seul
- [ ] Côté repreneur déclaré ; focale = exposition et optimisation de l'offre
- [ ] Durées / délais procéduraux (dépôt des offres, audience) tagués `[à vérifier]`
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`

---

## Outils MCP à privilégier

- Identification entreprise + procédures publiées : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures` (confirmer la procédure ouverte sur la cible, le type RJ/LJ, l'administrateur, les dates).
- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `eurlex_recherche`, `eurlex_consulter`.

---

## Emplacement des sorties

```
outputs/reprise-a-la-barre-<entreprise-slug>-YYYY-MM-DD.md
```

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle]

> ⚠️ Note du relecteur
> - **Sources :** Légifrance ✓ / BODACC ✓ / Judilibre ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** situation décrite + {N} pièces
> - **Signalé pour ton jugement :** {N} éléments [review] (éligibilité du repreneur, fermeté de l'offre, périmètre) | aucun
> - **Fraîcheur :** réforme du 15 septembre 2021 (ord. transposition directive restructuration) — vérifier durées/seuils en vigueur | recherche impossible
> - **Avant de t'appuyer dessus :** {action — ex. confirmer l'absence de lien d'interposition} | « prêt pour relecture »

# Reprise à la barre — note tactique [CÔTÉ repreneur]

# 1. Diagnostic & recevabilité
- **Gate 1 — porte d'entrée** : cible en {RJ / LJ} ✅, appel d'offres ouvert, date limite {date [review]}, administrateur {nom}. {Si pas de procédure ouverte → pas une reprise à la barre, renvoi pre-pack-cession.}
- **Régime** : en RJ, la cession (totale/partielle) peut être arrêtée **dès la période d'observation** (**L.631-22**, qui rend applicable **L.642-1 s.**) — pas besoin d'attendre une LJ.
- **Gate 2 (a) — éligibilité (L.642-3)** : {OK / 🔴 lien dirigeant-parent-interposition → offre nulle}.
- **Gate 2 (b) — offre ferme L.642-2** : {offre ferme ✅ / 🔴 simple LOI indicative → irrecevable, à convertir}.

# 2. Construction de l'offre (mentions L.642-2 II)
- Mentions **à peine d'irrecevabilité** : **désignation des biens, droits et contrats** inclus ; **prévisions d'activité et de financement** ; **prix et modalités de règlement** ; **apporteurs de capitaux et garants** ; **date de réalisation** ; **niveau et perspectives d'emploi** ; **garanties d'exécution** ; **cessions d'actifs envisagées dans les 2 ans** ; **durée des engagements**.
- **Porteur de l'offre / NEWCO (L.642-9)** : identifier le **cessionnaire**, les **apporteurs de capitaux** et **garants** ; toute **substitution** au profit d'une NEWCO suppose l'**autorisation du tribunal** et la **garantie solidaire** de l'auteur de l'offre retenue.
- **Activité autonome (L.642-1)** : alerter si le périmètre isole des actifs clés (marque + fichier) au point de **vider l'activité** (cherry-picking) → risque de rejet.

# 3. Optimisation vs critères du tribunal (L.642-5)
- **Pérennité de l'emploi** : nombre d'emplois maintenus, plan social éventuel.
- **Paiement des créanciers** : prix offert, affectation, sûretés.
- **Garanties d'exécution** : solidité financière, garanties apportées.
- **Positionnement vs offres concurrentes** : points faibles à couvrir, surenchère possible.

# 4. Risques & suites
- **Sûretés (L.642-12)** : quote-part du prix par actif grevé + droit de préférence ; droit de suite maintenu **tant que le prix n'est pas intégralement payé** ; droit de rétention (gage stock) **non affecté** par le plan ; échéances des crédits sur biens conservés. **Ne disparaissent pas** sans traitement.
- **Inexécution / résolution** du plan de cession (L.642-11).
- **Publicité de l'offre** : le contenu des offres est **communiqué aux organes de la procédure et déposé au greffe** (consultable par les intéressés) → **calibrer** les informations concurrentielles sensibles que l'on y fait figurer ; pas de confidentialité totale.
- **Inaliénabilité (L.642-10)** : le tribunal peut **interdire la revente** de tout ou partie des biens cédés pendant un délai → anticiper si le fonds vise une cession ultérieure de la marque / du fichier.
- **Voies de recours (L.661-6)** : recours **restreints** — le **cessionnaire ne peut faire appel** du jugement arrêtant le plan **que s'il lui impose des charges autres que ses engagements** ; un **candidat évincé** n'a pas de recours ordinaire équivalent à une renégociation. Ne pas tabler sur un appel large.
- **Irrévocabilité** de l'offre une fois déposée (L.642-2).

# Renvois & prochaines étapes
- **Amont** : `/h-da:pre-pack-cession` si la cession peut être préparée en amont.
- **Aval** : `/h-da:spa-review` / `/h-da:gap-review` / `/h-da:closing-checklist-fr` (l'acte de cession et son closing).
- **Latéral** : spécialiste PI (hors périmètre de ce plugin) si actifs PI substantiels dans le périmètre repris.

# Une question hors de ma checklist habituelle
{Observation transversale — ex. articulation prix / désintéressement des créanciers privilégiés, sort d'un contrat de location-gérance, clean team si repreneur concurrent. Omettre si rien d'honnête.}

# Que veux-tu faire ? Choisis une option :
1. **Rédiger** — je prépare la trame de l'offre de reprise ferme (mentions L.642-2) ou la note d'analyse des offres concurrentes.
2. **Escalader** — note vers {approbateur configuré} pour décision d'engager / surenchérir.
3. **Compléter les faits** — questions (lien éventuel avec le dirigeant, date limite exacte de dépôt, contrats à reprendre, état des sûretés).
4. **Surveiller et attendre** — suivi avec point de revisite (avant la date limite de dépôt des offres).
5. **Autre** — précise.
```

---

## Étape 1 — Gate 1 (porte d'entrée)

1. Lire le profil cabinet (blocs procédures collectives + M&A) et confirmer le **côté repreneur**. Raisonner **à la date du jour** (dates absolues) avec un **rétroplanning** : date limite de dépôt des offres, audience.
2. Vérifier via `bodacc_procedures` / `bodacc_by_siren` que la cible est **bien en RJ/LJ** : type de procédure, date du jugement d'ouverture, administrateur désigné.
3. **Trancher la porte d'entrée** : procédure ouverte + appel d'offres en cours → ce skill. **Aucune procédure ouverte** et cession préparable confidentiellement → ce n'est pas une reprise à la barre → **renvoi `/h-da:pre-pack-cession`** (montage amont). Ne pas avancer sans avoir tranché.
4. **Trancher le régime (art. L.631-22 / L.642-1 s.)** : si la cible est en **redressement judiciaire**, le tribunal peut arrêter la cession (totale ou partielle) **dès la période d'observation** sur le fondement de **L.631-22**, qui rend applicable le régime du plan de cession **L.642-1 et s.** Ne jamais conditionner la reprise à la barre à une **liquidation préalable** ni affirmer que la cession serait impossible pendant l'observation.

## Étape 2 — Gate 2 (recevabilité de l'offre)

Trancher les **deux** verrous. Si l'un tombe → STOP + signalement motivé.
1. **Éligibilité (L.642-3 C.com.)** — dirigeants de droit ou de fait, parents et alliés jusqu'au 2nd degré inclus, et toute **interposition de personne** sont **interdits de se porter acquéreurs**. Une offre émanant d'une telle personne est **nulle**. Repérer toute holding interposée, prête-nom, lien familial. Dérogation du tribunal exceptionnelle. `[review]`.
2. **Offre ferme et écrite (L.642-2 C.com.)** — l'offre doit comporter périmètre, contrats repris, prix, financement, emplois maintenus, garanties, date. Une **LOI / lettre d'intention indicative n'est pas** une offre recevable. Une fois déposée, l'offre est **irrévocable** et ne peut être modifiée que dans un sens plus favorable.

## Étape 3 — Construction de l'offre (L.642-2 / L.642-7 / L.642-1)

Bâtir l'offre sur les **mentions obligatoires (L.642-2 II)** (cf. Bloc 2 : biens/droits/contrats, prévisions, prix, apporteurs/garants, date, emploi, garanties, cessions d'actifs <2 ans, durée des engagements). Identifier les **contrats à reprendre** : ce sont ceux **désignés par le tribunal** dans le jugement de cession (L.642-7), cédés de plein droit au cessionnaire — lister ceux qui sont nécessaires à l'activité (bail, licence, fournisseurs). Points d'attention par contrat :
- **Bail commercial** : cessible par le plan **nonobstant clause contraire**, aux **conditions en vigueur au jour de l'ouverture** ; toute **clause imposant au cédant une solidarité avec le cessionnaire est réputée non écrite** — le repreneur ne reprend donc pas automatiquement les arriérés locatifs par solidarité.
- **Licence de procédé concédée par un tiers** : vérifier une éventuelle clause d'**intuitu personae / agrément / changement de contrôle** ; recueillir les observations du concédant — un repreneur concurrent peut crisper.

Vérifier que le périmètre forme une **activité autonome (L.642-1)** : alerter sur tout cherry-picking (isoler la marque + le fichier clients) qui viderait l'activité et exposerait l'offre au rejet.

## Étape 4 — Optimisation vs critères du tribunal (L.642-5)

Le **tribunal arrête le plan de cession** en retenant l'offre qui assure le mieux, sur les trois critères de **L.642-5** : (1) la **pérennité de l'emploi**, (2) le **paiement des créanciers**, (3) les **garanties d'exécution**. Optimiser l'offre sur ces axes (pas le prix seul). En cas d'**offre(s) concurrente(s)**, identifier les points faibles relatifs et la marge de surenchère (l'offre ne peut être modifiée que dans un sens plus favorable, L.642-2). Si le repreneur est un **concurrent**, prévoir NDA / clean team / limitation des données sensibles (clients, prix) en data-room.

## Étape 5 — Risques post-arrêté (L.642-12 / L.642-11 / L.642-10 / L.661-6)

- **Sûretés — sort complet (L.642-12 C.com.).** Ne jamais dire que le nantissement (fonds de commerce) ou le gage (stock) disparaissent sans traitement. Mécanique :
  - une **quote-part du prix de cession** est affectée par le tribunal à chaque bien grevé compris dans le périmètre, sur laquelle s'exerce le **droit de préférence** des créanciers inscrits ;
  - le **droit de suite** est **maintenu tant que le prix de cession n'est pas intégralement payé** : le cessionnaire ne purge qu'au **paiement complet du prix** (sous réserves textuelles) ;
  - pour un **bien grevé que le cessionnaire conserve** et qui sert de garantie à un crédit, il peut devoir **régler les échéances** restant dues ;
  - le **droit de rétention** d'un créancier (ex. gage avec dépossession sur le stock) **n'est pas affecté** par le plan : il faut le **désintéresser pour récupérer le bien**.
  - → **Ventiler le prix par actif grevé** dès l'offre et chiffrer cette charge. `[review]`
- **Inexécution du plan** : si le cessionnaire n'exécute pas ses engagements, le tribunal peut prononcer la **résolution du plan de cession** (L.642-11) — mesurer l'exposition ; ne s'engager que sur du tenable.
- **Inaliénabilité (L.642-10)** : le tribunal peut **interdire la revente** de tout ou partie des biens cédés pendant un délai → vérifier avant tout projet de cession ultérieure (marque, fichier).
- **Publicité de l'offre (L.642-2 / L.642-5)** : son contenu est **communiqué aux organes et déposé au greffe** (consultable) → **calibrer** les informations concurrentielles sensibles que l'on y fait figurer ; pas de confidentialité totale.
- **Voies de recours (L.661-6 C.com.)** : recours **restreints** — le **cessionnaire ne peut faire appel** du jugement arrêtant le plan **que si celui-ci lui impose des charges autres que les engagements souscrits** ; un **candidat évincé** ne dispose pas d'un recours ordinaire équivalent à une renégociation. Ne pas tabler sur un appel large en cas de rejet.

## Étape 6 — Post-flight `verifier-citations`

Lancer `verifier-citations` sur tous les articles cités (L.631-22, L.642-1, L.642-2, L.642-3, L.642-5, L.642-7, L.642-9, L.642-10, L.642-11, L.642-12, L.661-6). Tout article non confirmé reste `[à vérifier]`.

---

## Ce skill ne fait pas

- **Rédiger l'acte de cession / le SPA** → renvoi `/h-da:spa-review`, `/h-da:gap-review`, `/h-da:closing-checklist-fr`.
- **Cadrer le montage amont confidentiel** (mandat ad hoc / conciliation, double gate cessation des paiements) → renvoi `/h-da:pre-pack-cession`.
- **Traiter le côté débiteur / organes de la procédure** (orchestration, prospection) — ce skill est côté repreneur uniquement.
- **Cession d'actifs isolés en LJ (L.642-19)** hors plan de cession — hors périmètre v1.
- Tout seuil / durée procédurale post-réforme 2021 reste `[à vérifier]` si non confirmé en source primaire.

---

## Ton

Technique, prudent, **piloté par le double gate** : tant que le Gate 1 (porte d'entrée) et le Gate 2 (éligibilité L.642-3 + offre ferme L.642-2) ne sont pas tranchés, ne pas travailler l'offre. Marteler le **point pivot** (le tribunal choisit sur L.642-5 — emploi, créanciers, garanties — pas le prix seul) et l'**irrévocabilité** de l'offre déposée. Côté repreneur : mesurer l'exposition (purge réelle des sûretés, contrats repris désignés par le tribunal, recours des évincés) et optimiser sur les trois critères. Si la cession est encore préparable en amont, le dire et renvoyer `pre-pack-cession`. Brouillon soumis à validation humaine (avocat) avant tout dépôt d'offre.
