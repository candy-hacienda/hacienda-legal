---
name: mise-en-demeure-commerciale
description: >
  Rédige, relit ou gradue une mise en demeure commerciale B2B (mise en demeure
  de payer ou d'exécuter, relance amiable, sommation) en droit français. Calcule
  les sommes dues (principal, intérêts moratoires art. 1344-1 C.civ, indemnité
  forfaitaire de recouvrement 40 € L.441-10 C.com., clause pénale 1231-5),
  accorde un délai raisonnable et calibre la fermeté selon la posture cabinet.
  Garde-fou procédure collective : si le débiteur est en sauvegarde/RJ/LJ,
  l'arrêt des poursuites L.622-21 interdit la mise en demeure d'une créance
  antérieure -> renvoi declaration-creance. Brouillon, validation humaine (avocat)
  et matrice d'approbateurs OBLIGATOIRE.
version: "2.0.0"
argument-hint: "[--draft (défaut) | --relance | --sommation, --type=payer|executer, créance/obligation, contrat, side créancier]"
authors: ["Hacienda"]
tags: [mise-en-demeure, recouvrement, contentieux, b2b, 1344, l441-10, pre-judiciaire]
---

# Skill — Mise en demeure commerciale (B2B)

> **BROUILLON, VALIDATION HUMAINE (AVOCAT) + MATRICE D'APPROBATEURS OBLIGATOIRE.**
>
> Une mise en demeure n'est pas une action judiciaire, mais elle produit des
> effets de droit : elle fait courir les intérêts moratoires (art. 1344-1 C.civ),
> met le risque de la chose à la charge du débiteur (art. 1344-2
> C.civ) et conditionne la résolution par notification (art. 1226
> C.civ) comme l'exécution forcée. Sa formulation engage.
>
> **🔴 Garde-fou procédure collective.** Si le débiteur est en **sauvegarde,
> redressement ou liquidation judiciaire**, l'**arrêt des poursuites
> individuelles** (art. L.622-21 C.com.) **interdit** toute mise
> en demeure ou poursuite en paiement d'une créance **antérieure** au jugement
> d'ouverture. Ne pas rédiger la mise en demeure : renvoyer vers
> `declaration-creance` (la créance se déclare au passif, elle ne se réclame pas
> directement). Détection SIREN + BODACC à l'Étape 1, obligatoire.
>
> **🟡 Garde-fou rupture brutale.** Une mise en demeure ne doit pas servir de
> véhicule à une rupture de relation commerciale établie : si la cessation de la
> relation est en jeu, renvoyer vers `analyser-rupture-brutale` (art. L.442-1, II
> C.com.) avant d'envoyer un courrier qui pourrait être requalifié.
>
> Livrable destiné à la contrepartie = **externe** : retirer l'en-tête de
> confidentialité avocat (cf. CLAUDE.md plugin §2), ton d'associé.

---

## Examples

<example>
<user>/h-da:mise-en-demeure-commerciale --draft --type=payer ./factures-impayees.pdf --siren=552100554</user>
<response>
1. **Détection procédure collective** : `bodacc_procedures` sur le SIREN → aucune procédure ouverte `[BODACC]`. Poursuite possible.
2. Profil cabinet : posture « équilibré », approbateur mise en demeure identifié, matrice d'escalade lue.
3. Qualification : créance certaine, liquide et exigible (3 factures échues, non contestées).
4. Calcul des sommes : principal + intérêts moratoires (taux légal professionnel `[à vérifier]` + 5 pts si CGV) + indemnité forfaitaire 40 €/facture (L.441-10 C.com.) + clause pénale si stipulée `[review]`.
5. Rédaction : objet, rappel des factures, fondement, **délai raisonnable** (8 à 15 jours usuels `[review]`), conséquences (intérêts, résolution, action), formule comminatoire mesurée.
6. Post-flight `verifier-citations` (1344, 1344-1, 1231-6, L.441-10 C.com.).
7. Sortie : lettre prête à signer (mode silencieux externe) + note du relecteur + arbre 5 options.
</response>
</example>

<example>
<user>/h-da:mise-en-demeure-commerciale --relance ./facture-2025-0188.pdf</user>
<response>
Mode `--relance` : relance amiable préalable (ton 1, avant mise en demeure formelle).
Ton ferme mais courtois, sans formule comminatoire ni menace d'action, rappel de l'échéance dépassée et invitation à régulariser sous quinzaine. Pas d'intérêts réclamés à ce stade (réservés pour la mise en demeure formelle). Sortie : courrier de relance + note « si sans réponse sous 15 j, passer en `--draft` (mise en demeure formelle) ».
</response>
</example>

<example>
<user>/h-da:mise-en-demeure-commerciale --draft --type=payer ./facture.pdf --siren=400123456</user>
<response>
Étape 1 — Détection : la contrepartie est en **redressement judiciaire** (BODACC, jugement d'ouverture du 3 mars 2026, publication du 9 mars 2026) `[BODACC]`.

🔴 **STOP — arrêt des poursuites individuelles (art. L.622-21 C.com.).** La créance antérieure ne peut pas faire l'objet d'une mise en demeure ni d'une action en paiement directe. Elle doit être **déclarée au passif** dans le délai L.622-24 C.com. (2 mois post-publication BODACC).

Renvoi actif : `/h-da:declaration-creance --siren=400123456 --nature=facture --montant=<montant>`. Date de forclusion estimée : 9 mai 2026 `[à vérifier]`.

Ce skill ne produit PAS de mise en demeure ici.
</response>
</example>

<example>
<user>/h-da:mise-en-demeure-commerciale --draft --type=executer ./contrat-prestation.pdf</user>
<response>
Mise en demeure d'**exécuter** une obligation de faire (livraison/prestation non réalisée), pas de payer.
Étape 2 — qualification : obligation contractuelle exigible, inexécution caractérisée. Étape 4 — délai raisonnable d'exécution (art. 1226 C.civ, condition d'une résolution ultérieure par notification), réserve expresse des droits (résolution, exécution forcée art. 1221, dommages-intérêts). Pas de calcul d'intérêts moratoires (obligation non monétaire) — réserver les DI de retard `[review]`.
</response>
</example>

---

## Chargement du profil

> Lire `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`, bloc contrats commerciaux + matrice d'approbateurs :
> - **Posture par défaut** — protecteur / équilibré / facilitateur (calibre la fermeté)
> - **Position clause pénale (1231-5)** et **intérêts de retard** habituels
> - **Approbateur « Mise en demeure »** + déclencheur d'escalade (absence de réponse 30 j)

Si le bloc est `[A CONFIGURER]` : stopper et demander `/h-da:entretien-demarrage`. Sans approbateur configuré, la chaîne de validation n'est pas opposable.

---

## Intake

1. **Mode** — `--draft` (mise en demeure formelle, défaut) | `--relance` (relance amiable préalable) | `--sommation` (graduation post-mise en demeure, acte de commissaire de justice)
2. **Type** — `--type=payer` (somme d'argent, défaut) | `--type=executer` (obligation de faire / livrer / délivrer)
3. **Documents** — facture(s), contrat / CGV, bons de commande, échanges, relance(s) antérieure(s)
4. **SIREN débiteur** — `--siren=` recommandé (déclenche la détection procédure collective + enrichissement)
5. **Créance / obligation** — montant et échéance (payer) ou obligation précise et date due (exécuter)
6. **Délai souhaité** (optionnel) — délai raisonnable accordé ; défaut proposé 8-15 jours `[review]`

Side = **créancier / demandeur** par nature de l'acte.

---

## Gate non-juriste

- [ ] **Détection procédure collective** faite (SIREN + `bodacc_procedures`) ; si débiteur en sauvegarde/RJ/LJ → STOP + renvoi `declaration-creance`, AUCUNE mise en demeure produite
- [ ] Test rupture brutale : si cessation d'une relation établie en jeu → signaler + renvoi `analyser-rupture-brutale`
- [ ] Profil cabinet lu, posture et approbateur « Mise en demeure » identifiés
- [ ] Créance qualifiée **certaine, liquide et exigible** (payer) OU obligation exigible et inexécution caractérisée (exécuter)
- [ ] Prescription vérifiée : action commerciale 5 ans (art. L.110-4 C.com.) — signaler si la créance en approche
- [ ] Sommes ventilées : principal + intérêts moratoires + indemnité forfaitaire 40 € + clause pénale (le cas échéant), chaque taux/montant réglementaire tagué `[à vérifier]`
- [ ] **Délai raisonnable** explicite accordé au débiteur (condition d'une résolution/action ultérieure)
- [ ] Livrable externe : en-tête confidentialité retiré, ton d'associé, conséquences énoncées sans menace disproportionnée
- [ ] Citations vérifiées via `verifier-citations` ou taguées `[à vérifier]`

---

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Si une source n'a pas été consultée, garder `[à vérifier]`.

- Détection procédure collective + enrichissement : `bodacc_procedures`, `bodacc_by_siren`, `company_full_profile`.
- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `eurlex_recherche`, `eurlex_consulter`.

---

## Emplacement des sorties

```
outputs/mise-en-demeure-<debiteur-slug>-YYYY-MM-DD.md
```

Si plusieurs créances/factures, joindre un tableau récapitulatif ; au-delà de 10 lignes chiffrées, générer le dashboard HTML via `renderDashboard()` de `@hacienda/core`.

---

## Sortie

### Format livrable

```
[En-tête de confidentialité selon le rôle — voir CLAUDE.md plugin §2]

> ⚠️ Note du relecteur
> - **Sources :** Légifrance ✓ / BODACC ✓ / Judilibre ✓ (cocher ✗ si non connectée) ; articles lus dans cette session : {liste} ; autres citations `[à vérifier]`
> - **Procédure collective :** {résultat explicite de la détection — ex. « BODACC consulté, aucune sauvegarde/RJ/LJ ouverte pour {débiteur} : poursuite possible » | « ✗ BODACC non interrogé en live — à vérifier avant envoi »}. **Garde-fou L.622-21 C.com.** : si une procédure collective s'ouvrait (ou si la détection a échoué), l'arrêt des poursuites individuelles **interdirait** la mise en demeure d'une créance antérieure → bascule `declaration-creance`. *(Ligne obligatoire — ne jamais omettre, même quand le débiteur est in bonis.)*
> - **Lecture :** {N} factures / contrat / échanges
> - **Signalé pour ton jugement :** {N} éléments [review] (clause pénale, délai, taux) | aucun
> - **Fraîcheur :** taux légal du semestre + jurisprudence intérêts/clause pénale — {N} | recherche impossible
> - **Avant de t'appuyer dessus :** {action — ex. confirmer le taux conventionnel des CGV} | « prêt pour envoi LRAR »

# Synthèse (3 lignes décideur)
{Bottom-line : envoyer / relancer / renoncer (procédure collective). Risque dominant. Prochaine action.}

# Sommes réclamées (mode payer)
| Poste | Base | Montant | Tag |
|---|---|---|---|
| Principal | factures échues | [€] | [utilisateur fourni] |
| Intérêts moratoires | taux légal pro + 5 pts CGV, depuis échéance (art. 1344-1, 1231-6 C.civ) | [€] | [à vérifier] |
| Indemnité forfaitaire recouvrement | 40 €/facture (L.441-10, D.441-5 C.com.) | [€] | [à vérifier] |
| Clause pénale | si stipulée — modérable par le juge (1231-5 C.civ) | [€] | [review] |
| **Total réclamé** | | **[€]** | |

# Projet de mise en demeure
[texte complet de la lettre — Étape 4]

# Une question hors de ma checklist habituelle
{Observation transversale — ex. contestation latente qui fragiliserait le caractère certain de la créance, opportunité d'injonction de payer vs assignation. Omettre si rien d'honnête.}

# Que veux-tu faire ? Choisis une option :
1. **Rédiger** — je finalise la lettre LRAR prête à signer (mode silencieux externe).
2. **Escalader** — note vers {approbateur « Mise en demeure » configuré} avec faits, montant, risque.
3. **Compléter les faits** — questions au service compta / commercial (taux CGV exact, relances déjà envoyées, contestation reçue).
4. **Surveiller et attendre** — ajout au tracker recouvrement avec date de relance (J+30) et bascule `--sommation` si sans réponse.
5. **Autre** — précise.
```

### Mode silencieux (livrable externe — lettre adressée au débiteur)

- **Retirer l'en-tête de confidentialité avocat** (le débiteur n'est pas dans le périmètre du secret).
- Conserver la note du relecteur dans le message d'accompagnement, **pas dans la lettre**.
- Couper toute narration de skill et renvoi inter-commandes. La lettre doit se lire comme rédigée par le service contentieux / un associé.
- Tags de provenance : retirer de la version envoyée (consolidés en pied si nécessaire).

---

## Étape 1 — Détection procédure collective, qualification

1. Lire le profil cabinet (bloc contrats commerciaux + matrice d'approbateurs).
2. **Détection procédure collective (obligatoire).** Si un SIREN est fourni ou détectable (regex `\b[0-9]{9}\b` + Luhn) : `bodacc_procedures`. Si sauvegarde/RJ/LJ ouverte et la créance est **antérieure** au jugement → **STOP** : pas de mise en demeure (arrêt des poursuites L.622-21 C.com.), renvoi `declaration-creance`. Distinguer les créances **postérieures** privilégiées (art. L.622-17) qui, elles, peuvent être réclamées `[review]`. **Tracer le résultat dans la note du relecteur (ligne « Procédure collective » obligatoire), y compris quand aucune procédure n'est ouverte** : le garde-fou L.622-21 doit rester visible dans le livrable, jamais vérifié en silence.
3. **Test rupture brutale.** Si l'opération revient à cesser une relation commerciale établie → signaler le risque L.442-1, II C.com. et renvoyer `analyser-rupture-brutale` avant envoi.
4. Identifier les parties, le contrat applicable, le droit applicable et la juridiction (si clause attributive).

---

## Étape 2 — Qualification de la créance / obligation

**Mode payer** — la créance doit être **certaine** (non sérieusement contestable), **liquide** (montant déterminé) et **exigible** (échue). Si l'une fait défaut, le signaler `[review]` : une mise en demeure sur créance contestée fragilise une procédure ultérieure (injonction de payer rejetée si contestation sérieuse).

**Mode exécuter** — l'obligation doit être exigible et l'inexécution caractérisée (obligation de faire, de livrer, de délivrer conforme). Préciser l'objet exact de l'obligation inexécutée.

**Prescription** — action en paiement entre commerçants/pour acte de commerce : **5 ans** (art. L.110-4 C.com.), point de départ à l'exigibilité. Signaler si la créance approche la prescription (la mise en demeure n'interrompt PAS la prescription — seuls un acte d'exécution forcée, une reconnaissance ou une assignation l'interrompent, art. 2240 s. C.civ `[à vérifier]`).

---

## Étape 3 — Calcul des sommes (mode payer)

| Poste | Règle | Tag |
|---|---|---|
| Principal | montant des factures échues impayées | [utilisateur fourni] |
| Intérêts moratoires | à défaut de taux conventionnel : taux légal (art. 1231-6 C.civ) ; si CGV conformes : taux légal **professionnel** majoré (+ N points selon CGV) à compter de l'échéance / de la mise en demeure (art. 1344-1 C.civ). **Consulter Légifrance/PISTE pour la valeur du taux** (donnée publiée, pas un jugement) et la fournir avec source ; `[à vérifier]` **uniquement** si l'outil est indisponible (mode dégradé) ; **jamais inventer** | `[Légifrance]` (ou `[à vérifier]` si dégradé) |
| Indemnité forfaitaire de recouvrement | **40 € par facture** en retard (art. L.441-10, D.441-5 C.com.) ; indemnité complémentaire sur justificatifs si frais réels supérieurs | [à vérifier] |
| Clause pénale | si stipulée au contrat/CGV ; **modérable** par le juge si manifestement excessive ou dérisoire (art. 1231-5 C.civ) | [review] |

Ne pas inventer un taux légal : si le taux du semestre n'a pas été consulté sur une source officielle, écrire `[à vérifier]` et proposer la méthode, **pas un chiffre présenté comme certain**. Anatocisme (capitalisation des intérêts dus pour une année entière, art. 1343-2 C.civ) : à mentionner seulement si pertinent et `[review]`.

---

## Étape 4 — Rédaction de la mise en demeure

Trame (mode payer, `--draft`) :

```
[Coordonnées créancier]                         [Débiteur — raison sociale, SIREN, siège]
                                                 Lettre recommandée avec AR
                                                 [Ville], le [date]

Objet : MISE EN DEMEURE DE PAYER — [référence(s) facture(s)]

Madame, Monsieur,
Sauf erreur ou omission de notre part, nos écritures font apparaître que vous
restez redevable des sommes suivantes, échues et impayées :
[tableau : facture / date / échéance / montant]
soit un total en principal de [€], outre les intérêts de retard et l'indemnité
forfaitaire de recouvrement de 40 € par facture (art. L.441-10 C.com.).

En conséquence, par la présente, nous vous mettons en demeure de régler la somme
de [total] € dans un délai de [8 à 15] jours à compter de la réception de ce
courrier.

À défaut de règlement dans ce délai, nous nous réservons le droit, sans nouvel
avis, de [recouvrer la créance par toute voie de droit / engager une procédure
d'injonction de payer / saisir la juridiction compétente] et de réclamer
l'ensemble des intérêts, pénalités et frais. La présente vaut mise en demeure au
sens de l'article 1344 du Code civil et fait courir les intérêts moratoires.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations
distinguées.
[Signature, qualité du signataire]
```

Mode `--type=executer` : remplacer la demande de paiement par une demande d'exécution
de l'obligation dans un **délai raisonnable** (art. 1226 C.civ — préalable à une
résolution par notification), avec réserve expresse des droits (exécution forcée
art. 1221 C.civ, résolution, dommages-intérêts).

Calibrage de la fermeté par la posture profil : *protecteur* → comminatoire et bref ;
*équilibré* → ferme et factuel ; *facilitateur* → ouvre une porte de régularisation amiable.

---

## Étape 5 — Graduation (selon mode)

- `--relance` : courrier amiable préalable, sans formule comminatoire ni intérêts réclamés, délai de courtoisie ~15 j. Suggérer la bascule `--draft` si sans réponse.
- `--draft` : mise en demeure formelle (Étape 4).
- `--sommation` : étape suivante si la mise en demeure est restée infructueuse — trame de **sommation de payer / commandement** délivré par **commissaire de justice** (ex-huissier), avec rappel des sommes et mention des voies d'exécution. Signaler que l'acte relève du ministère du commissaire de justice (le skill produit la trame, pas l'acte authentique) `[review]`. Orienter ensuite vers injonction de payer (art. 1405 CPC `[à vérifier]`) ou assignation au fond selon le montant et la contestation.

---

## Étape 6 — Post-flight `verifier-citations`

Appel automatique. Articles à vérifier : 1344, 1344-1, 1344-2, 1231-5, 1231-6, 1226, 1221, 1343-2 C.civ ; L.441-10, L.110-4, L.622-17, L.622-21 C.com. (identifiants dans `${CLAUDE_SKILL_DIR}/../../references/articles-c-civ-c-com-index.md` : les lire via `legifrance_get_article` ; `[Légifrance]` seulement après lecture dans la session, sinon `[à vérifier]`). D.441-5 C.com. et art. 1405 CPC : même règle. Taux légal du semestre : jamais affirmé sans consultation source → `[à vérifier]`. Mode dégradé documenté si PISTE absent.

---

## Ce skill ne fait pas

- Délivrer la sommation/commandement (acte du **commissaire de justice**) ni l'assignation (acte de l'avocat plaidant) — trame seulement.
- Poursuivre un débiteur en procédure collective pour une créance antérieure → renvoyer `declaration-creance` (arrêt des poursuites L.622-21).
- Analyser une rupture de relation commerciale établie → renvoyer `analyser-rupture-brutale` (L.442-1, II).
- Réviser le contrat sous-jacent → renvoyer `reviser-contrat`.
- Fixer un taux légal ou un délai de prescription comme une certitude sans vérification → `[à vérifier]`.
- Conseiller une voie d'exécution forcée détaillée (saisie) → signalement, renvoi à l'avocat/commissaire de justice.

---

## Ton

Technique, factuel, **fermeté calibrée par la posture profil**. La lettre est un
acte externe : pas de jargon interne, pas de menace disproportionnée (une menace
d'action manifestement infondée peut être fautive). Énoncer les conséquences de
droit réelles (intérêts, résolution, voies de recouvrement) sans les outrer.
Toujours accorder un délai raisonnable. Rappeler que le brouillon est soumis à
validation humaine (avocat) et à la matrice d'approbateurs avant signature et envoi.
