---
name: reviser-contrat
description: >
  Revue d'un contrat commercial entrant contre le playbook du cabinet : CGV,
  distribution, franchise, prestation de services, bail commercial, SPA, NDA
  commercial. Analyse clause par clause, génère liste de points (issues list)
  avec criticité 🟢/🟡/🟠/🔴, identifie risques juridiques avec articles
  applicables et jurisprudence Judilibre. Signale hors périmètre (spécialiste PI) si le
  contrat est PI-centric. Brouillon soumis à validation humaine (avocat).
version: "2.0.0"
argument-hint: "[contrat, type, side, playbook cabinet]"
authors: ["Hacienda"]
tags: [contrats, revue, playbook, ma, distribution, prestation, bail, spa]
---

# Skill — Revue de contrat commercial

> **BROUILLON DE REVUE, PAS AVIS JURIDIQUE.**
>
> Analyse documentaire du contrat contre le playbook configuré. Identifie
> les clauses sensibles, propose des reformulations, signale les risques.
> Toute sortie doit être validée par un avocat avant transmission ou
> signature.
>
> **Si le contrat est PI-centric** (licence brevet, accord de coexistence
> marques, NDA partenariat R&D, transfert de technologie) : orienter vers
> un spécialiste PI (hors périmètre de ce plugin). Ce skill couvre le tronc
> commercial standard, pas le coeur PI.

---

## Examples

<example>
<user>/h-da:reviser-contrat ./SPA-cession-X.pdf --review</user>
<response>
1. Lecture profil cabinet (posture équilibré, plafond GAP 20 % prix, approbateur SPA = avocat + GC + sponsor business)
2. Identification du contrat : SPA, parties, droit français applicable, closing conditionné
3. Détection SIREN cible → `company_full_profile` (Pappers ✓) → tag `[Pappers]`
4. Analyse clause par clause contre `clauses-sensibles-fr.md` (déclarations et garanties, clause pénale, non-concurrence cédant, GAP)
5. Liste de points triée par criticité (🔴 → 🟢) via skill `liste-de-points`
6. Post-flight `verifier-citations` (12 articles vérifiés, 1 alerte abrogation)
7. Sortie : en-tête confidentialité + note du relecteur + résumé exécutif + liste de points + recommandation + question hors checklist + arbre de décision
</response>
</example>

<example>
<user>/h-da:reviser-contrat ./contrat-licence-brevet.pdf</user>
<response>
Détection contrat PI-centric (licence de brevet) → renvoi taxonomie :
"Ce contrat porte principalement sur une licence de brevet. L'analyse des
spécificités PI (revendications licenciées, TTBER, inscription RNB pour
opposabilité) est hors du périmètre de ce plugin : je te recommande de la
confier à un spécialiste PI. Souhaites-tu (a) que je poursuive sur les seules
clauses commerciales (paiement, durée, juridiction), le volet PI étant
signalé `[review]`, ou (b) t'arrêter ici ?"
</response>
</example>

<example>
<user>/h-da:reviser-contrat ./CGV-fournisseur.pdf --review --side=client</user>
<response>
Identification CGV B2B → vérifications spécifiques de transparence et d'équilibre :
- art. L.441-1 C.com. — transparence prix, conditions de règlement
- art. L.441-10 C.com. — délais de paiement plafonds B2B
- art. L.442-1 C.com. — déséquilibre significatif et rupture brutale
- art. 1171 C.civ — clauses abusives en contrat d'adhésion
- art. 1170 C.civ — clause privant l'obligation essentielle de sa substance
Sortie complète avec liste de points et formulations alternatives selon posture.
</response>
</example>

<example>
<user>/h-da:reviser-contrat ./bail-commercial.pdf</user>
<response>
Identification bail commercial relevant des art. L.145-1 et suivants C.com. → vérifications spécifiques :
- Durée minimale 9 ans et droit au renouvellement (L.145-4, L.145-8) `[à vérifier]`
- Indexation du loyer (ILC obligatoire pour activités commerciales, pas IRL) `[connaissance modèle — à vérifier]`
- Charges récupérables (décret 2014-1317) `[à vérifier]`
- Clause résolutoire avec commandement préalable d'un mois `[connaissance modèle — à vérifier]`
Sortie adaptée bail commercial, formulations alternatives selon posture cabinet.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md` :
> - **Posture par défaut** — protecteur / équilibré / facilitateur
> - **Clauses "jamais acceptées"** — listées dans le bloc contrats commerciaux
> - **Positions clés** — clause pénale (1231-5 C.civ), limitation de responsabilité, droit applicable et juridiction, non-concurrence
> - **Matrice d'approbateurs** — par type d'acte (revue standard, SPA, mise en demeure)

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : stopper et
demander `/h-da:entretien-demarrage` avant toute revue
substantielle. Voir aussi `~/.claude/plugins/config/hacienda-juridique/company-profile.md` pour les
éléments cabinet partagés cross-plugins.

---

## Intake

1. **Mode** — `--review` (analyser un contrat existant, défaut)
2. **Fichier contrat** — chemin du PDF / DOCX / Markdown
3. **Side** (optionnel) — `--side=fournisseur` | `--side=client` (auto-détecté si non précisé)
4. **Posture override** (optionnel) — `--posture=protecteur` | `--posture=équilibré` | `--posture=facilitateur` (force une posture pour cette revue, sans modifier le profil)

---

## Gate non-juriste

- [ ] Type de contrat correctement identifié (taxonomie respectée)
- [ ] Profil cabinet lu et posture applicable identifiée
- [ ] Renvoi PI effectué si le contrat est PI-centric (pas de revue forcée)
- [ ] SIREN détecté → enrichissement tenté + tag source + alerte procédure collective si applicable
- [ ] Liste de points triée par criticité décroissante, sans doublon, sans remplissage
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur + résumé exécutif + liste de points + recommandation + question hors checklist + arbre de décision 5 options

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

```
outputs/revue-contrat-<type>-<parties-slug>-YYYY-MM-DD.md
```

Si la liste de points dépasse 10 lignes ou contient des dates / montants
sérialisables, générer en parallèle un dashboard HTML autonome via
`renderDashboard()` de `@hacienda/core` (voir `${CLAUDE_SKILL_DIR}/../../references/dashboard-template.md`).

---

## Sortie

Structurer la sortie avec : faits retenus, droit applicable, analyse, incertitudes, sources consultées, décisions proposées, prochaine action et validation humaine. Toute source non consultée directement reste `[à vérifier]`.

## Étape 1 — Identification

1. Lire le profil cabinet (CLAUDE.md droit-affaires) et `~/.claude/plugins/config/hacienda-juridique/company-profile.md`.
2. Détecter le type de contrat à partir des termes dominants (voir `${CLAUDE_SKILL_DIR}/../../references/taxonomie-contrats-fr.md`).
3. **Test PI-centric.** Si les termes dominants sont brevet, marque, licence, coexistence, invention, savoir-faire, R&D ou transfert de technologie → signaler immédiatement que le volet PI est hors périmètre (orientation vers un spécialiste PI) avec les options (a) poursuivre sur les clauses commerciales seulement, le volet PI étant signalé `[review]`, (b) s'arrêter.
4. Identifier les parties (raison sociale, qualité, pays d'établissement), le droit applicable, la juridiction et la date d'effet.

---

## Étape 2 — Détection SIREN et enrichissement entreprise

Si une chaîne de 9 chiffres apparaît dans le document (regex `\b[0-9]{9}\b` + validation Luhn), tenter l'enrichissement :

```typescript
import { company_full_profile } from "@hacienda/core";
const profile = await company_full_profile(siren);
```

Tag dans la sortie : `[Pappers]` si l'API Pappers a répondu, `[BODACC]` si seul le fallback BODACC OpenDataSoft a fourni la donnée. Mentionner explicitement la source utilisée à côté de la donnée enrichie (forme sociale, dirigeant, capital, statut).

**Alerte procédure collective.** Si BODACC remonte une procédure de sauvegarde, redressement judiciaire ou liquidation en cours :

> 🟠 Alerte — la contrepartie est en {sauvegarde | redressement | liquidation} depuis le {date} `[BODACC]`. Vérifier (a) la qualité du signataire (administrateur, mandataire, dirigeant maintenu), (b) l'autorisation du juge-commissaire pour les actes en cours, (c) la nécessité d'une déclaration de créance dans les 2 mois post-publication BODACC du jugement d'ouverture `[à vérifier]`. Renvoyer vers `/h-da:declaration-creance` si le cabinet est créancier.

Si aucun SIREN détecté ou aucune source disponible : ne pas inventer, tag `[utilisateur fourni]` sur les éléments parties.

---

## Étape 3 — Analyse clause par clause

Pour chaque clause sensible identifiée (voir `${CLAUDE_SKILL_DIR}/../../references/clauses-sensibles-fr.md`, 15 clauses pilotes), produire une ligne de tableau :

| Champ | Contenu |
|---|---|
| Citation | Numéro de clause dans le contrat + libellé court (5-15 mots) |
| Comparaison playbook | Conforme / écart léger / écart majeur |
| Statut | 🟢 OK / 🟡 À discuter / 🟠 À négocier / 🔴 Bloquant |
| Article applicable | art. xxx + `[tag provenance]` (voir `articles-c-civ-c-com-index.md`) |
| Risque | 1-2 phrases concrètes pour le client |
| Position souhaitée | Selon posture playbook (protecteur / équilibré / facilitateur) |
| Formulation proposée | Texte de remplacement prêt à coller |

**Règles d'analyse :**

- Les articles cités doivent exister dans `articles-c-civ-c-com-index.md`. À défaut, tag `[à vérifier]` et signaler en note du relecteur.
- Les arrêts cités doivent être tagués `[Judilibre]` si consultés en session ou `[connaissance modèle — à vérifier]` sinon. Pas de fausse jurisprudence.
- Tag inline `[review]` sur les jugements subjectifs (clauses borderline déséquilibre L.442-1, qualification d'obligation essentielle 1170 C.civ, exigibilité d'une non-concurrence sans contrepartie chiffrée).
- Respecter le plancher de sévérité cross-skill : si `verifier-citations` remonte 🔴, ne pas dégrader silencieusement.

**Clauses pilotes.** La liste complète des 15 clauses pilotes vit dans `${CLAUDE_SKILL_DIR}/../../references/clauses-sensibles-fr.md` (source de vérité unique). Le skill traite les 15. Exemples emblématiques :

1. Clause pénale (art. 1231-5 C.civ)
2. Non-concurrence salariée (Cass. soc. 10 juil. 2002, n° 00-45.135)
3. Exclusivité (art. L.420-1 C.com.)
4. Limitation de responsabilité (art. 1170 C.civ)
5. Déséquilibre significatif B2B (art. L.442-1, I, 2° C.com.)

---

## Étape 4 — Liste de points (issues list)

Appel interne au skill `liste-de-points` pour produire un tableau consolidé, trié par criticité décroissante (🔴 → 🟠 → 🟡 → 🟢) :

```
| # | Clause | Statut | Risque | Position souhaitée | Formulation proposée |
|---|---|---|---|---|---|
```

La liste de points est l'artefact central transmis à la contrepartie ou à l'équipe de négociation. Une ligne par clause. Pas de doublon. Tri stable par numéro de clause à criticité égale.

Si le contrat n'a aucun écart par rapport au playbook : retourner une liste vide explicite — `Aucun point de vigilance identifié contre le playbook configuré. Lecture intégrale sans alerte.` — et ne pas fabriquer de findings de remplissage.

---

## Étape 5 — Post-flight verifier-citations

Appel automatique de `verifier-citations` sur la sortie complète, mode défaut (`articles` + `jurisprudence`). Le skill :

- Extrait toutes les citations (art. NNN C.civ, L.NNN-N C.com., arrêts Cass. / CA Paris / CJUE).
- Vérifie l'existence et la version en vigueur via Légifrance / Judilibre.
- Annote la sortie : `[Légifrance ✓]`, `[Judilibre ✓]`, `[abrogé]`, ou `[à vérifier]` en mode dégradé.

Si une citation `[abrogé]` est remontée → ligne dédiée dans la note du relecteur en 🔴 avec le remplacement applicable (par exemple : « art. 1100 ancien C.civ → remplacé par 1101 réforme 2016 »).

Si PISTE n'est pas configuré → mode dégradé documenté en note du relecteur (« `verifier-citations` non exécuté — N citations à valider manuellement contre Légifrance »).

---

## Étape 6 — Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur]

> ⚠️ Note du relecteur
> - Sources : Légifrance ✓ / Judilibre ✓ / Pappers ✓ / BODACC ✓ (cocher ✗ si non connectée)
> - Lecture : intégrale ({N} pages) | partielle (pages X à Y)
> - Signalé pour ton jugement : {N} éléments marqués [review] | aucun
> - Fraîcheur : recherche jurisprudence post-{date} — {N} arrêts intégrés
> - Avant de t'appuyer dessus : {action concrète OU « prêt pour relecture »}

# Résumé exécutif

{Trois phrases pour DG / DAF / sponsor business. Pas de jargon. Une ligne de
bottom-line : signer en l'état / négocier sur N points / refuser. Une ligne
de risque dominant. Une ligne de prochaine action attendue.}

# Liste de points

| # | Clause | Statut | Risque | Position souhaitée | Reformulation |
|---|---|---|---|---|---|
| ... | ... | 🔴/🟠/🟡/🟢 | ... | ... | ... |

# Recommandation

{Signer / Négocier / Refuser} — justification 2-3 lignes liée à la posture
playbook et aux points 🔴 / 🟠.

# Une question hors de ma checklist habituelle

{Observation transversale qu'un relecteur attentif ferait. Omettre la ligne
si rien d'honnête à dire — ne pas fabriquer.}

# Que veux-tu faire ? Choisis une option :

1. **Rédiger** — je produis un projet de courrier de négociation à la contrepartie reprenant la liste de points priorisée.
2. **Escalader** — note d'escalade vers {approbateur configuré} avec faits-clés, risque dominant et décision attendue.
3. **Compléter les faits** — questions ouvertes à poser à {PM / client / contrepartie / conseil} avant d'avancer.
4. **Surveiller et attendre** — ajouter au tracker du dossier avec date de revisite.
5. **Autre** — précise.
```

### Mode silencieux (livrable externe)

Si l'utilisateur précise que la sortie est destinée à une contrepartie ou à un destinataire non-juriste :
- Conserver l'en-tête de confidentialité (s'il protège le document) et la note du relecteur.
- Retirer la narration de skill et les renvois inter-commandes (les placer dans un message séparé).
- Le livrable doit se lire comme s'il avait été rédigé par un associé.

---

## Ce skill ne fait pas

- Signer ou exécuter le contrat (acte des parties).
- Revoir un contrat PI-centric → hors périmètre : orienter vers un spécialiste PI.
- Faire le focus GAP M&A → renvoyer `gap-review` (v1).
- Préparer une déclaration de créance → renvoyer `declaration-creance` (v1).
- Rédiger un pacte d'associés ou un term sheet → `v1.1+`.
- Donner un avis fiscal détaillé (TVA, droits d'enregistrement) — signalement uniquement.
- Donner un avis social complet sur les clauses RH (non-concurrence salariée, intéressement) — la clause est analysée, la stratégie sociale est renvoyée à un spécialiste social (hors périmètre de ce plugin).

---

## Ton

Technique, structuré, factuel. Identifier clairement la position du client
(side fournisseur ou client). Signaler systématiquement les risques majeurs
(déséquilibre significatif, rupture brutale, clause privant l'obligation
essentielle de sa substance, indemnités forfaitaires manifestement excessives).
Rappeler que la sortie est un brouillon soumis à validation humaine (avocat) avant toute
transmission, signature ou ouverture de négociation formelle.
