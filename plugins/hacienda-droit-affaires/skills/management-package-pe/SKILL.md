---
name: management-package-pe
description: >
  Cartographie un management package Private Equity (LBO) côté français :
  recense les documents et le « qui signe quoi », nomme et explique les
  instruments et economics (sweet equity, envy ratio, ratchet, vesting, leaver),
  signale le risque de clause confiscatoire, et produit une liste de questions
  fiscal/social à renvoyer au spécialiste. Ne valorise rien, ne donne aucun avis
  fiscal/social, ne fait pas la revue clause-par-clause (renvoi `pacte-associes-review --pe`).
  Side-aware sponsor | manager. Brouillon soumis à validation humaine (avocat).
version: "2.0.0"
argument-hint: "[package, side, documents, instruments, economics] [--side=sponsor|manager]"
authors: ["Hacienda"]
tags: [management-package, pe, lbo, sweet-equity, leaver, vesting, fiscal-social, brouillon]
---

# Skill — Cartographie management package PE

> **BROUILLON SOUMIS À validation humaine (avocat) PE.**
>
> Ce skill produit une cartographie de travail du management package LBO côté
> français. Il ne vaut ni acte, ni conseil juridique, ni conseil fiscal ou social :
> il recense et nomme les instruments, economics et clauses, et doit être validé
> par un avocat avant tout usage opérationnel.
>
> **STOP fiscal/social.** Ce skill nomme les enjeux fiscaux et sociaux liés aux
> instruments (qualification BSA/BSPCE/ADP/AGA/OC, régime d'imposition du gain
> managérial, charges sociales), il ne les tranche pas. Toute question fiscale ou
> sociale est taguée `[à vérifier]` et renvoyée au spécialiste (expert-comptable,
> avocat fiscal, conseil social). Aucune valorisation, aucun chiffrage, aucun avis
> de fond sur la structure.
>
> **Ce skill ne valorise rien.** Les economics (envy ratio, ratchet, taux de
> rendement cible) sont recensés et nommés, jamais calculés ni validés.

---

## Examples

<example>
<user>/h-da:management-package-pe --side=sponsor</user>
<response>
1. Intake : side = sponsor (fonds, BidCo) ; demander les documents du package (term sheet, pacte, BSPCE/BSA, promesses)
2. M1 — Cartographie documents et « qui signe quoi » (côté sponsor) : identification des parties, liste des actes constitutifs du package, signataires et leur rôle
3. M2 — Nommage instruments et economics : instrument(s) utilisé(s) (BSPCE / BSA / ADP / AGA / OC / actions ordinaires), mécanismes economics (sweet equity, envy ratio, ratchet, vesting schedule, good leaver / bad leaver)
4. M3 — Signalement clauses confiscatoires : leaver clauses à prix anormalement bas, ratchet défavorable, drag-along sans prix plancher — signalement `[review]`, aucun avis de fond
5. M4 — STOP fiscal/social : enjeux de qualification nommés (régime BSA/BSPCE, LPA, plus-value managériale, charges sociales potentielles) — `[à vérifier]`, renvoi expert
6. M5 — Question-list : liste de questions fiscales/sociales à poser au spécialiste avant signature
</response>
</example>

<example>
<user>/h-da:management-package-pe --side=manager</user>
<response>
1. Intake : side = manager (management) ; demander les documents reçus (term sheet, projet de pacte, instruments proposés)
2. M1 — Cartographie côté manager : documents reçus, engagements signés ou à signer, identité des contreparties (BidCo, fonds, co-investisseurs)
3. M2 — Nommage instruments et economics côté manager : instrument proposé, economics (upside cible, vesting, leaver conditions et prix de rachat), envy ratio
4. M3 — Signalement clauses sensibles côté manager : clauses confiscatoires potentielles (bad leaver prix symbolique, accélération ratchet défavorable, drag sans prix plancher) — `[review]`, renvoi `pacte-associes-review --pe` pour revue clause-par-clause
5. M4 — STOP fiscal/social : qualification de l'instrument et régime fiscal du gain managérial — `[à vérifier]`, renvoi avocat fiscal ; cotisations sociales potentielles — renvoi conseil social
6. M5 — Question-list à soumettre au conseil fiscal et social avant signature
</response>
</example>

<example>
<user>/h-da:management-package-pe --side=sponsor package mixte FR/Lux</user>
<response>
Gate France/Lux déclenché : le package comporte une composante luxembourgeoise (véhicule fonds Lux, instruments émis par une entité Lux).
Ce skill couvre la jambe française du package uniquement. Les instruments, documents et economics rattachés à l'entité luxembourgeoise (LP agreements, carried interest structure Lux, instruments Lux) sont hors périmètre — renvoi à un conseil luxembourgeois.
Jambe FR : cartographie M1–M5 appliquée aux instruments et parties de droit français (BidCo FR, managers résidents FR, BSPCE/BSA/ADP de droit français).
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`, bloc « M&A / Corporate » du §1 :
> - **Side habituel M&A** — cédant / acquéreur / conseil des deux — oriente la lecture du package (côté sponsor ou côté manager)
> - **Taille de deals typique et secteurs cibles** — pour calibrer l'ampleur de la cartographie attendue
> - **Politique PII** — `passive` / `active` (défaut) / `strict` + seuil B + catégories sensibles
> - **Rôle de l'utilisateur courant** — pour l'en-tête de confidentialité

Si le profil n'est pas encore peuplé (`[A CONFIGURER]` présent) : stopper et
demander `/h-da:entretien-demarrage`. Le bloc M&A est requis. Voir aussi
`~/.claude/plugins/config/hacienda-juridique/company-profile.md` pour les éléments
cabinet partagés cross-plugins.

---

## Intake

1. **Side** — `--side=sponsor` (fonds, BidCo, structureur) | `--side=manager` (management, salarié investisseur). Si absent, demander explicitement — la cartographie n'est pas la même selon le côté de la table.
2. **Documents disponibles** — term sheet, projet de pacte d'associés, instruments proposés (BSPCE, BSA, ADP, AGA, OC, promesses d'achat/vente), convention de vesting ou de leaver. Lire sans analyser au fond.
3. **Gate France/Lux** — si des signaux luxembourgeois apparaissent (entité fonds Lux, LP agreement Lux, instruments émis hors France, carried interest structure Lux) : STOP overlay Lux, renvoi à un conseil luxembourgeois ; l'overlay couvre la jambe française uniquement. Utiliser les signaux définis dans `${CLAUDE_SKILL_DIR}/../../references/management-package-pe-fr.md`.
4. **Gate fiscal/social** — dès qu'une question de qualification fiscale (régime BSA/BSPCE, LPA, plus-value managériale) ou sociale (cotisations sur gain managérial) est identifiée : nommer et renvoyer, ne pas trancher.

---

## Gate non-juriste

- [ ] Side posé (`--side=sponsor` ou `--side=manager`) — ou demandé explicitement si absent
- [ ] Profil cabinet bloc M&A lu
- [ ] Gate France/Lux vérifié — signaux Lux détectés ? Si oui, périmètre limité à la jambe FR
- [ ] M1 — cartographie documents et « qui signe quoi » présente
- [ ] M2 — instruments et economics nommés (sweet equity, envy ratio, ratchet, vesting, leaver) ; aucun calcul ni chiffrage
- [ ] M3 — clauses confiscatoires signalées `[review]` ; aucun avis de fond
- [ ] M4 — STOP fiscal/social : enjeux nommés et renvoyés (`[à vérifier]` systématique) ; aucune qualification tranchée
- [ ] M5 — question-list produite (artefact phare)
- [ ] Aucune date calendaire ni aucun montant fabriqué
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`
- [ ] Sortie comprend : en-tête confidentialité + note du relecteur + cartographie M1–M5 + question-list + arbre de décision 5 options

---

## Déroulé — axes M1–M5

Charger `${CLAUDE_SKILL_DIR}/../../references/management-package-pe-fr.md` pour la doctrine, la terminologie et les signaux de détection. Appliquer les cinq axes suivants :

### M1 — Cartographie documents et « qui signe quoi »

Recenser l'ensemble des documents constituant le package (term sheet, pacte d'associés, acte d'émission d'instruments, convention de vesting, promesses réciproques, accession deed, contrat de travail le cas échéant). Pour chaque document : parties signataires, rôle de chaque partie, statut (signé / à signer / manquant).

Rendu en tableau (document / parties / rôle / statut). Les documents manquants sont des points de vigilance, jamais des omissions silencieuses.

### M2 — Nommage instruments et economics

Identifier et nommer chacun des instruments composant le package (BSPCE, BSA, ADP — actions de préférence —, AGA, OC — obligations convertibles —, actions ordinaires au prix de marché) et les economics associés :

- **Sweet equity** : la part d'instruments permettant au management de capter un retour supérieur à son investissement proportionnel — nommer, ne pas chiffrer.
- **Envy ratio** : rapport entre le levier financier du manager et celui du sponsor — nommer, ne pas calculer.
- **Ratchet** : mécanisme d'ajustement de la quote-part en fonction d'un TRI ou d'un multiple — nommer les seuils indiqués, aucune projection.
- **Vesting** : calendrier d'acquisition des droits (cliff, vesting linéaire ou par paliers) — recenser, aucune date calendaire fabriquée.
- **Good leaver / bad leaver** : conditions de départ et prix de rachat associés — recenser les définitions et le prix (valeur de marché / valeur nominale / prix symbolique), signaler tout prix de rachat anormalement bas `[review]`.

Rendu en tableau (instrument / caractéristique / valeur indiquée ou `[à compléter]` / observation).

### M3 — Signalement leaver et risque confiscatoire

Identifier les clauses susceptibles de priver le manager d'une partie substantielle de son upside en cas de départ (bad leaver à prix symbolique ou nominal, ratchet anormalement défavorable, drag-along sans prix plancher protégeant le management). Chaque clause identifiée est signalée `[review]` : elle est nommée, son mécanisme est décrit, son impact potentiel est indiqué — aucun avis de fond, renvoi à `pacte-associes-review --pe` pour la revue clause-par-clause. Toute clause dont la validité est en jeu (ex. non-concurrence sans contrepartie) est qualifiée « **potentiellement nulle `[review]`** », jamais « nulle » : conclure la nullité est un avis de fond interdit.

Une clause confiscatoire potentielle est un point 🟠/🔴 selon sa sévérité apparente.

### M4 — STOP fiscal/social

Nommer les enjeux fiscaux et sociaux attachés aux instruments identifiés :

- Qualification fiscale de l'instrument (BSPCE : régime art. 163 bis G CGI `[à vérifier]` ; BSA : régime plus-value de cession de valeurs mobilières ou traitement en salaire selon les faits `[à vérifier]` ; ADP/OC : régime à préciser `[à vérifier]`).
- Régime fiscal du gain managérial au débouclage : plus-value, traitement en salaire ou en revenu du capital — `[à vérifier]`, renvoi avocat fiscal.
- Risque de requalification en complément de salaire (cotisations sociales) — nommer, `[à vérifier]`, renvoi conseil social.
- LPA (Limited Partnership Agreement) si applicable — mécanique du carried interest, régime fiscal du carried — `[à vérifier]`, renvoi avocat fiscal spécialisé PE.

**Aucun avis fiscal ou social n'est donné.** Chaque enjeu est nommé et renvoyé. Les montants et taux sont toujours `[à vérifier]`.

### M5 — Question-list (artefact phare)

Produire la liste structurée des questions à poser au conseil fiscal et social avant toute signature. La question-list est l'artefact central de ce skill côté manager comme côté sponsor.

Format : liste numérotée, une question par ligne, destinataire indiqué (avocat fiscal / expert-comptable / conseil social / conseil Lux si applicable). Aucune réponse anticipée — les questions sont ouvertes.

---

## Ce skill ne fait pas

- Ne valorise rien, ne chiffre pas les economics (envy ratio, ratchet, TRI, multiple) — cartographie et nommage uniquement.
- Ne donne aucun avis fiscal ou social : il nomme les enjeux et les renvoie au spécialiste (`[à vérifier]` systématique sur tout point fiscal/social).
- Ne conclut **jamais** à la nullité, la validité ou la licéité d'une clause — y compris une clause de non-concurrence sans contrepartie financière, même quand la règle paraît évidente. Il écrit « clause **potentiellement nulle `[review]`** » et renvoie au spécialiste (avocat social / fiscaliste). Affirmer qu'une clause « est nulle » est un avis de fond, interdit.
- Ne fait pas la revue clause-par-clause du pacte d'associés ou des instruments → `pacte-associes-review --pe`.
- Ne couvre pas le droit luxembourgeois (entité fonds Lux, instruments Lux, carried interest structure Lux) — gate France/Lux, renvoi conseil Lux.
- Ne fabrique aucune date calendaire ni aucun montant.
- La sortie est un brouillon soumis à validation humaine (avocat) avant tout usage opérationnel.

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Points sociaux : `boss_recherche`, `boss_get_document`. Points fiscaux : `bofip_rechercher` / `bofip_consulter` ne donnent que des circulaires ministérielles (fonds CIRC), **pas la base BOFiP-Impôts** — toute doctrine fiscale reste `[à vérifier]` sur bofip.impots.gouv.fr, sans tag `[BOFiP]`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

---

## Emplacement des sorties

```
outputs/management-package-pe-<parties-slug>-YYYY-MM-DD.md
```

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle utilisateur — voir CLAUDE.md §2]

> **⚠️ Note du relecteur**
> - **Sources :** Légifrance ✓ / Judilibre ✓ (cocher ✗ si non connectée)
> - **Lecture :** {documents fournis lus — ou « aucun document fourni, cartographie générée sur la base de l'intake »}
> - **Signalé pour ton jugement :** {N} éléments marqués [review] | aucun
> - **Fraîcheur :** recherche des évolutions depuis {date} — {N} mises à jour intégrées | rien trouvé
> - **Avant de t'appuyer dessus :** {1-2 actions concrètes — typiquement « faire valider la qualification fiscale des instruments par un avocat fiscal avant signature »}

# Management package PE — {side} — {parties ou slug}

## M1 — Documents et « qui signe quoi »

[tableau : document / parties / rôle / statut]

## M2 — Instruments et economics

[tableau : instrument / caractéristique / valeur indiquée ou [à compléter] / observation]

## M3 — Clauses confiscatoires signalées

[liste : clause / mécanisme / impact potentiel / sévérité — [review] systématique]

## M4 — Enjeux fiscal/social à renvoyer au spécialiste

[liste : enjeu / instrument concerné / destinataire du renvoi — [à vérifier] systématique]

## M5 — Question-list fiscal/social

[liste numérotée : question / destinataire]
```

# Une question hors de ma cartographie habituelle

{Observation transversale qu'un relecteur attentif ferait. Omettre la ligne si rien d'honnête à dire — ne pas fabriquer.}

# Que veux-tu faire ? Choisis une option et je la déroule :

1. **Rédiger** — je produis la question-list M5 mise en forme prête à être adressée au conseil fiscal/social.
2. **Escalader** — je rédige une note d'escalade vers {approbateur configuré} avec les points `[review]` identifiés et la décision attendue avant signature.
3. **Compléter les faits** — questions ouvertes à poser au {sponsor / manager / conseil / expert-comptable} pour compléter la cartographie.
4. **Surveiller et attendre** — j'ajoute la cartographie au tracker du dossier avec note motivée et date de revisite.
5. **Autre** — précise ce que tu veux en faire.

---

## Ton

Praticien PE FR, jargon réel assumé (anglicismes : sweet equity, envy ratio, ratchet, vesting, leaver, LPA, carried, waterfall, closing). Sobre : cartographie et nomenclature, pas de narration. La question-list M5 est l'artefact le plus utile pour le manager — la mettre en avant.
