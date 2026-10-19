---
name: reviser-nda
description: >
  Triage rapide d'un NDA / accord de confidentialité commercial : VERT (OK
  signer), ORANGE (négocier 1-2 points), ROUGE (refuser ou renégocier
  largement). Couvre champ confidentialité, exceptions standard, durée,
  juridiction, et clause de non-concurrence salariée (si présente : vérifie
  contrepartie financière obligatoire selon jurisp soc. 10 juil. 2002). Signale
  hors périmètre (spécialiste PI) si NDA partenariat R&D PI-centric.
version: "2.0.0"
argument-hint: "[NDA, side, contexte, niveau de triage]"
authors: ["Hacienda"]
tags: [nda, confidentialite, triage, non-concurrence]
---

# Skill — Triage NDA / accord de confidentialité

> **TRIAGE RAPIDE, PAS REVUE COMPLÈTE.**
>
> Ce skill produit un verdict 🟢 VERT / 🟠 ORANGE / 🔴 ROUGE sur 9 points clés,
> calibré pour une décision rapide « signer / négocier 1-2 points / refuser ».
> Il ne remplace pas une revue clause par clause.
>
> **Pour une revue complète** (NDA bilatéral M&A complexe, NDA inséré dans un
> contrat cadre, asymétries fortes à analyser dans le détail) : utiliser
> `/h-da:reviser-contrat` à la place.
>
> **Pour un NDA PI-centric** (partenariat R&D, transfert de technologie,
> savoir-faire substantiel, co-développement, secret d'affaires structurant) :
> orienter vers un spécialiste PI (hors périmètre de ce plugin). Ce skill
> couvre le tronc commercial standard, pas le coeur PI.

---

## Examples

<example>
<user>/h-da:reviser-nda ./NDA-prestataire-marketing.pdf</user>
<response>
NDA unilatéral standard, prestataire marketing → droit français → triage 9 points :
1. Définition info confidentielles : précise, catégories listées → 🟢
2. Exceptions standard : 5 sur 5 (déjà publique, indépendant, légale, tiers, autorisée) → 🟢
3. Durée : 3 ans post-contrat → 🟢
4. Sort de l'info en fin : destruction + attestation → 🟢
5. Juridiction : TC Paris → 🟢
6. Loi applicable : droit français → 🟢
7. Clause pénale : 10k€ raisonnable, modulable art. 1231-5 C.civ → 🟢
8. Non-concurrence : absente → N/A

**Verdict : 🟢 VERT — OK signer en l'état.**
</response>
</example>

<example>
<user>/h-da:reviser-nda ./NDA-fournisseur-industriel.pdf</user>
<response>
NDA bilatéral, fournisseur industriel, durée 10 ans + clause non-concurrence 2 ans sans contrepartie chiffrée → triage 9 points :
1. Définition info : large mais bornée par usage → 🟡
2. Exceptions : 4 sur 5 (manque "développement indépendant") → 🟠
3. Durée : 10 ans → 🟠 (limite haute, à négocier vers 5 ans)
4. Sort de l'info : restitution mentionnée mais sans délai → 🟡
5. Juridiction : TC Paris → 🟢
6. Loi applicable : droit français → 🟢
7. Clause pénale : 100k€ forfaitaire → 🟠 (potentiellement disproportionné, révision possible art. 1231-5 C.civ)
8. **Non-concurrence salariée sans contrepartie financière → 🔴 NULLE** (Cass. soc. 10 juil. 2002 n° 00-45.135 `[Judilibre]` — contrepartie obligatoire)

**Verdict : 🔴 ROUGE — refuser ou renégocier largement.** Au minimum : (a) supprimer la non-concurrence ou ajouter une contrepartie ≥ 25 % rémunération, (b) ramener la durée à 5 ans, (c) plafonner la clause pénale.
</response>
</example>

<example>
<user>/h-da:reviser-nda ./NDA-partenariat-R&D-biotech.pdf</user>
<response>
Détection NDA partenariat R&D substantiel (mention "savoir-faire", "résultats de recherche", "co-développement", "brevet potentiel") → renvoi PI :

"Ce NDA porte sur un partenariat R&D avec composante PI substantielle (savoir-faire, résultats de recherche, co-développement, anticipation de brevet). L'analyse des spécificités PI (background / foreground IP, residuals, grant-back, articulation L.151-1 C.com. secret des affaires) est hors du périmètre de ce plugin : je te recommande de la confier à un spécialiste PI. Souhaites-tu (a) que je poursuive sur les seules clauses commerciales (durée, juridiction, clause pénale), le volet PI étant signalé `[review]`, ou (b) t'arrêter ici ?"
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md` :
> - **Posture par défaut** — protecteur / équilibré / facilitateur
> - **Clauses "jamais acceptées"** — listées dans le bloc contrats commerciaux
> - **Position non-concurrence** (avec contrepartie obligatoire)
> - **Position droit applicable + juridiction**
> - **Matrice d'approbateurs** — par type d'acte (revue standard NDA)
> - **Politique PII** — `passive` / `active` (défaut) / `strict` + seuil B + catégories sensibles

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : stopper et
demander `/h-da:entretien-demarrage` avant tout triage
substantiel.

---

## Intake

1. **Fichier NDA** — chemin du PDF / DOCX / Markdown
2. **Side** (optionnel) — `--side=emetteur` | `--side=recepteur` (auto-détecté si non précisé, important pour les NDA unilatéraux)

---

## Gate non-juriste

- [ ] Routing PI testé — orientation vers un spécialiste PI (hors périmètre) si NDA partenariat R&D / PI substantiel
- [ ] Structure du NDA qualifiée (unilatéral / bilatéral)
- [ ] Droit applicable et juridiction identifiés ; cadre FR / UE confirmé ou alerte juridiction étrangère
- [ ] Tableau 9 points renseigné, aucune ligne vide
- [ ] Non-concurrence salariée : vérification contrepartie financière obligatoire si présente
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`
- [ ] Verdict 🟢 / 🟠 / 🔴 cohérent avec la règle de synthèse
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur (5 champs) + tableau 9 points + recommandations + question hors checklist + arbre de décision 5 options

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/triage-nda-<parties-slug>-YYYY-MM-DD.md
```

Pour un triage NDA standard (8 lignes max), pas de dashboard HTML — le format Markdown suffit.

---

## Sortie

Structurer la sortie avec : faits retenus, droit applicable, analyse, incertitudes, sources consultées, décisions proposées, prochaine action et validation humaine. Toute source non consultée directement reste `[à vérifier]`.

## Étape 1 — Routing PI et qualification

1. **Test PI-centric.** Rechercher dans le document les termes : "savoir-faire", "brevet", "résultat de recherche", "co-développement", "secret d'affaires", "transfert de technologie", "background IP", "foreground IP", "residuals". Si présence substantielle (pas une simple mention en exception) → signaler immédiatement que le volet PI est hors périmètre (orientation vers un spécialiste PI) avec les options (a) poursuivre sur les clauses commerciales seulement, le volet PI étant signalé `[review]`, (b) s'arrêter. Citer art. L.151-1 C.com. (secret des affaires) pour cadrer le signalement.
2. **Qualifier la structure du NDA** :
   - **Unilatéral** (un émetteur, un récepteur) ou **bilatéral** (réciprocité complète) — impacte la lecture asymétrie.
   - **Contexte** : précontractuel (LOI / data room M&A), opérationnel (prestation), partenariat industriel.
3. **Identifier les parties** : raison sociale, qualité (donneur d'ordre / prestataire / cible / acquéreur), pays d'établissement.
4. **Droit applicable et juridiction** : extraire la clause. Si droit étranger ou juridiction étrangère → signaler immédiatement (cadre FR / UE par défaut, ne pas appliquer le test FR à des faits étrangers).
5. **Détection non-concurrence salariée** : rechercher toute clause restreignant l'activité du destinataire (employé du récepteur) après la fin du contrat. Si présente → activation du point 8 du tableau.

---

## Étape 2 — Analyse 9 points clés

Triage rapide selon le tableau de référence ci-dessous. Pour chaque point, attribuer un statut 🟢 Conforme / 🟡 À surveiller / 🟠 À négocier / 🔴 Bloquant.

| # | Point | Conforme = | À surveiller = | Bloquant = |
|---|---|---|---|---|
| 1 | Définition info confidentielles | Précise (catégories listées) | Trop large (toute info) | Définition manquante |
| 2 | Exceptions standard | 5 exceptions classiques | 3-4 sur 5 | Aucune (info publique inclue) |
| 3 | Durée | 2-5 ans | 5-10 ans | > 10 ans ou indéterminée |
| 4 | Sort de l'info en fin de contrat | Destruction/restitution | Mention vague | Aucune |
| 5 | Juridiction | TC/CCom Paris ou neutre | Étranger pour partie FR | Juridiction abusive |
| 6 | Loi applicable | FR ou UE | Common law neutre | Pays sans état de droit fiable |
| 7 | Clause pénale | Montant raisonnable + révision possible 1231-5 | Montant disproportionné | Astreinte journalière abusive |
| 8 | Non-concurrence (si présente, salarié) | Avec contrepartie ≥ 25% rémunération | Contrepartie symbolique | **Sans contrepartie = NULLE** (jurisp 10 juil. 2002) |
| 9 | Périmètre destinataires / affiliés / tiers | Destinataires nommés ou par fonction (need-to-know) ; tiers liés par engagement écrit ; récepteur responsable de leurs manquements | « Affiliates » larges sans liste, flow-down de responsabilité implicite | Partage libre à affiliés / clients / agents / sous-traitants sans liste ni signature, ou sous simple « commercially reasonable efforts », sans responsabilité du récepteur |

**Les 5 exceptions classiques (point 2)** — informations (a) déjà publiques au moment de la divulgation, (b) tombées dans le domaine public sans faute du récepteur, (c) déjà détenues par le récepteur avant la divulgation, (d) développées indépendamment sans usage de l'information confidentielle, (e) divulguées sur ordonnance judiciaire ou obligation légale impérative.

**Articles et jurisprudence applicables :**
- Point 1 (définition / secret d'affaires) — art. L.151-1 C.com., loi n° 2018-670 du 30 juil. 2018 `[à vérifier]`
- Point 7 (clause pénale) — art. 1231-5 C.civ (pouvoir modérateur du juge sur peine manifestement excessive ou dérisoire)
- Point 8 (non-concurrence salariée) — **Cass. soc. 10 juil. 2002, n° 00-45.135** `[Judilibre]` : contrepartie financière obligatoire, à défaut nullité de la clause. Articulation avec art. L.1121-1 C.trav `[à vérifier]` (restriction proportionnée).
- Point 9 (périmètre destinataires / tiers) — un tiers non-signataire n'est en principe pas tenu par le NDA (effet relatif des contrats, art. 1199 C.civ `[à vérifier]`) : pour engager affiliés, salariés, sous-traitants et clients, exiger soit leur signature, soit un **porte-fort** par lequel la partie réceptrice se rend garante de leur respect et répond de leurs manquements (art. 1204 C.civ `[à vérifier]`). Une définition large des « Affiliates » sans liste ni mécanisme d'engagement vide la confidentialité de sa portée.

**Règles d'analyse :**
- Les articles cités doivent exister dans `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md`. À défaut, tag `[à vérifier]` et signaler en note du relecteur.
- Pour des exemples emblématiques de libellés (clause pénale, non-concurrence salariée, confidentialité, droit applicable et juridiction), se reporter à `${CLAUDE_SKILL_DIR}/../../references/clauses-sensibles-fr.md` (source de vérité unique : entrées 1, 2, 10 et 11).
- Tag inline `[review]` sur les jugements subjectifs : portée d'une définition "large mais bornée", proportionnalité d'une clause pénale au préjudice prévisible, exigibilité d'une non-concurrence dont la contrepartie est chiffrée mais faible.

---

## Étape 3 — Verdict 🟢 VERT / 🟠 ORANGE / 🔴 ROUGE

Règle de synthèse appliquée au tableau des 9 points :

- **🟢 VERT — OK signer en l'état.** Tous les points 🟢 ou 🟡 isolé sans enjeu structurant. Aucun 🟠, aucun 🔴.
- **🟠 ORANGE — négocier 1 à 2 points avant signature.** 1 à 2 points 🟠, aucun 🔴. La négociation est ciblée : un mail court sur les points concernés suffit.
- **🔴 ROUGE — refuser ou renégocier largement.** Au moins un 🔴, ou 3 points 🟠 et plus (déséquilibre cumulatif). Une refonte est nécessaire, pas un toilettage.

**Cas particulier non-concurrence salariée sans contrepartie** : le point 8 🔴 emporte verdict ROUGE à lui seul, même si tous les autres points sont 🟢. La clause est nulle (Cass. soc. 10 juil. 2002 `[Judilibre]`) ; la laisser passer expose le récepteur à une fausse sécurité contractuelle.

**Plancher de sévérité.** Le verdict ne peut pas être rétrogradé sans justification explicite (par exemple : « point 8 🔴 mais le NDA précise explicitement que le salarié n'est pas dans le périmètre — verdict ramené à 🟢 sur ce point »).

---

## Étape 4 — Post-flight verifier-citations

Appel automatique de `verifier-citations` sur la sortie complète, mode défaut (`articles` + `jurisprudence`). Le skill :

- Extrait les citations (art. 1231-5 C.civ, art. L.151-1 C.com., Cass. soc. 10 juil. 2002 n° 00-45.135, etc.).
- Vérifie l'existence et la version en vigueur via Légifrance / Judilibre.
- Annote la sortie : `[Légifrance ✓]`, `[Judilibre ✓]`, `[abrogé]`, ou `[à vérifier]` en mode dégradé.

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur. Si une citation `[abrogé]` est remontée → ligne dédiée dans la note du relecteur en 🔴 avec remplacement applicable.

---

## Sortie — Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — 4 variantes]

> ⚠️ Note du relecteur
> - **Sources :** Légifrance ✓ / Judilibre ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Lecture :** intégrale ({N} pages) | partielle (pages X à Y) | qualification unilatéral / bilatéral confirmée
> - **Signalé pour ton jugement :** {N} éléments marqués [review] | aucun
> - **Fraîcheur :** recherche jurisprudence post-{date} sur non-concurrence et clause pénale — {N} arrêts intégrés | rien trouvé
> - **Avant de t'appuyer dessus :** {action concrète — ex. « négocier les points 🟠 avant signature » OU « prêt pour relecture »}

# Triage NDA — {parties} — {date}

**Structure :** {Unilatéral émetteur→récepteur | Bilatéral} · **Droit applicable :** {FR | UE | étranger signalé} · **Juridiction :** {TC Paris | autre}

## Verdict : {🟢 VERT — OK signer | 🟠 ORANGE — négocier 1-2 points | 🔴 ROUGE — refuser ou renégocier largement}

{Une phrase de bottom-line liant le verdict aux 1-2 points dominants.}

## Tableau 9 points

| # | Point | Constat dans le NDA | Statut | Article / jurisprudence |
|---|---|---|---|---|
| 1 | Définition info confidentielles | ... | 🟢/🟡/🟠/🔴 | art. L.151-1 C.com. |
| 2 | Exceptions standard | ... | ... | — |
| 3 | Durée | ... | ... | — |
| 4 | Sort de l'info en fin de contrat | ... | ... | — |
| 5 | Juridiction | ... | ... | règlement Bruxelles I bis n° 1215/2012 `[à vérifier]` |
| 6 | Loi applicable | ... | ... | règlement Rome I n° 593/2008 `[à vérifier]` |
| 7 | Clause pénale | ... | ... | art. 1231-5 C.civ |
| 8 | Non-concurrence salariée | présente / absente / N/A | ... | Cass. soc. 10 juil. 2002 n° 00-45.135 `[Judilibre]` |
| 9 | Périmètre destinataires / affiliés / tiers | ... | ... | art. 1199 C.civ ; art. 1204 C.civ (porte-fort) `[à vérifier]` |

## Recommandations

{Pour chaque point 🟠 ou 🔴 : 1-2 phrases de position souhaitée + formulation alternative courte si négociation envisagée. Renvoyer vers `${CLAUDE_SKILL_DIR}/../../references/clauses-sensibles-fr.md` pour les libellés complets.}

## Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait. Omettre la ligne si rien d'honnête à dire — ne pas fabriquer.}

## Que veux-tu faire ? Choisis une option :

1. **Rédiger un mail de négociation** — je produis un projet de mail court à la contrepartie reprenant les 1-2 points à négocier, ton professionnel mesuré.
2. **Escalader vers {approbateur configuré}** — note d'escalade courte avec faits-clés, verdict, risque dominant et décision attendue.
3. **Signer en l'état** — confirmation rapide, archivage du triage au dossier, pas d'action supplémentaire.
4. **Surveiller et attendre** — l'instruction n'est pas mûre : ajouter au tracker du dossier avec date de revisite, le cas échéant après questions ouvertes ciblées à la contrepartie sur les points ambigus (définition, périmètre salariés concernés, durée intentionnelle).
5. **Autre** — précise.
```

### En-tête de confidentialité — 4 variantes selon rôle

| Rôle | En-tête à apposer |
|------|-------------------|
| Avocat inscrit à un barreau français | `CONFIDENTIEL — DOCUMENT DE TRAVAIL — Secret professionnel art. 66-5 loi n°71-1130 du 31 décembre 1971` |
| Notaire (officier public) | `CONFIDENTIEL — TRAVAIL NOTARIAL — Devoir de discrétion art. 23 loi 25 ventôse an XI` |
| Juriste in-house (non avocat) | `NOTES DE TRAVAIL INTERNES — NE CONSTITUE PAS UN AVIS JURIDIQUE — Faire valider par un avocat avant tout acte` |
| Non-juriste avec accès avocat | `NOTES DE TRAVAIL — Faire valider par [avocat référent configuré] avant tout usage externe` |

### Mode silencieux (livrable externe)

Si l'utilisateur précise que la sortie est destinée à une contrepartie ou à un destinataire non-juriste :
- Conserver l'en-tête de confidentialité (s'il protège le document) et la note du relecteur.
- Retirer la narration de skill et les renvois inter-commandes (les placer dans un message séparé).
- Le livrable doit se lire comme s'il avait été rédigé par un associé.

---

## Ce skill ne fait pas

- Revue complète clause par clause d'un NDA complexe → renvoyer `reviser-contrat`.
- Revue d'un NDA PI-centric → hors périmètre : orienter vers un spécialiste PI.
- Rédaction d'un NDA from scratch → renvoyer `reviser-contrat --draft` (hors périmètre : spécialiste PI si PI).
- Avis sur la stratégie sociale d'une non-concurrence salariée (calcul exact de la contrepartie, articulation avec convention collective) — signalement uniquement, renvoi à un spécialiste social (hors périmètre de ce plugin).
- Signer ou exécuter le NDA (acte des parties).

---

## Ton

Rapide, factuel, orienté décision. Le triage est calibré pour qu'un juriste in-house ou un avocat puisse décider en 5 minutes. Identifier clairement la position du client (émetteur ou récepteur). Signaler systématiquement le piège classique de la non-concurrence salariée sans contrepartie (nullité de la clause). Rappeler que le triage est un brouillon soumis à validation humaine (avocat) avant signature ou ouverture de négociation formelle.
