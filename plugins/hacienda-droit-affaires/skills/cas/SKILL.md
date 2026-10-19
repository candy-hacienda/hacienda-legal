---
name: cas
description: >
  Point de départ de toute requête droit des affaires dans Cowork : aiguille
  l'utilisateur (débutant comme confirmé) qui ne sait pas quel skill lancer, ou
  qui décrit un dossier sans nommer d'outil — « j'ai un dossier de…, par où je
  commence ? », « comment je traite ça ? », « quel outil pour… ? ». Trie par
  TYPE de dossier (contrat / litige-impayé / M&A / entreprise en difficulté /
  créance en procédure / vie sociale), puis route vers le bon skill ou
  sous-routeur (`asset-vs-share-distress` pour le distressed). Routeur agnostique au side : il
  ne demande pas si tu es cédant ou acquéreur, c'est le skill cible qui le fera.
  Il ORIENTE, il n'exécute pas et ne produit aucune analyse juridique. Ne pas
  déclencher quand l'utilisateur nomme déjà l'action (« révise ce contrat »,
  « rédige une mise en demeure ») : laisser le skill direct s'activer.
version: "2.0.0"
argument-hint: "[décris ta situation ou ton type de dossier — ex : « reprise d'une société en difficulté », « contrat reçu à relire », « impayé client »]"
authors: ["Hacienda"]
tags: [orientation, routeur, triage, onboarding, front-door]
---

# Skill — Orientation droit des affaires

> **Le point de départ.** Tu as un dossier mais tu ne sais pas quel outil
> utiliser ? Décris ta situation : je trie et je t'amène au bon skill.
> J'oriente, je n'exécute pas.

## Examples

<example>
<user>j'ai un dossier de reprise d'une boîte en difficulté, par où je commence ?</user>
<response>
1. Lecture du profil cabinet pour pré-classer (position dominante, side principal).
2. Triage : nature = entreprise en difficulté.
3. Route selon le side : si le dossier est **côté repreneur/acquéreur** →
   « → `/h-da:asset-vs-share-distress` » (sous-routeur titres vs actifs) ; si
   **côté cédant/débiteur** (le dirigeant de la boîte en difficulté) →
   « → `/h-da:distress-cedant` » (sous-routeur sauver / céder / déposer).
   Chaque sous-routeur garde son double gate. Ne PAS dérouler L.642-x ici.
</response>
</example>

<example>
<user>un client ne me paie pas une facture, qu'est-ce que je peux faire ?</user>
<response>
Triage : nature = litige / impayé. Route :
« → `/h-da:mise-en-demeure-commerciale` (mise en demeure de payer) ; si la
relation est ancienne et que tu crains une rupture, vois aussi
`/h-da:analyser-rupture-brutale` ». Garde-fou signalé : si le débiteur est en
procédure collective, l'arrêt des poursuites interdit la mise en demeure d'une
créance antérieure → `/h-da:declaration-creance`.
</response>
</example>

<example>
<user>révise ce contrat de distribution</user>
<response>
[Ne PAS s'activer comme routeur.] L'utilisateur nomme l'action : laisser
`reviser-contrat` s'activer directement. Si ce skill s'est déclenché par erreur,
rediriger immédiatement vers `/h-da:reviser-contrat` sans poser de question de
triage.
</response>
</example>

## Chargement du profil

> Au démarrage, lire le profil cabinet partagé
> `~/.claude/plugins/config/hacienda-juridique/company-profile.md` et le profil
> plugin `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/CLAUDE.md`
> s'ils existent. En extraire **uniquement pour pré-classer les suggestions** :
> `Side principal` (domaine de pratique : M&A / procédures collectives /
> contrats) et `Position dominante` (créancier / débiteur / mandataire).
>
> Ces champs ordonnent les propositions (cabinet procédures collectives →
> remonter `declaration-creance` et le moat distressed en tête). Ils ne
> présument **jamais** du side cédant/acquéreur d'un deal donné — laissé au
> skill cible. Profil absent ou `[A CONFIGURER]` → triage générique + suggérer
> `/h-da:entretien-demarrage`.

## Intake

1. **Détection d'interception** — si l'utilisateur a déjà nommé une action
   précise (« révise », « rédige une mise en demeure », « déclare ma créance »),
   ne pas faire de triage : rediriger vers le skill direct correspondant.
2. **Triage nature** (une question si la nature n'est pas évidente) :
   contrat à relire · contrat à produire · litige / impayé · opération M&A ·
   entreprise en difficulté · créance dans une procédure ouverte · vie sociale
   (AG / pacte / financement).
3. **Routage** — annoncer le(s) skill(s) cible(s) et pourquoi, puis passer la
   main. Pour le distressed, router vers `asset-vs-share-distress` sans dérouler
   sa logique.

### Carte de routage (type → skill)

| Nature du dossier | Route vers |
|---|---|
| Contrat entrant à relire | `/h-da:reviser-contrat` · `/h-da:reviser-nda` · `/h-da:revue-tabulaire` |
| Contrat à produire | `/h-da:cgv-generator` · `/h-da:constitution-societe` |
| Litige commercial / impayé | `/h-da:mise-en-demeure-commerciale` · `/h-da:analyser-rupture-brutale` |
| Opération M&A (cible saine) | `/h-da:loi-term-sheet` → `/h-da:due-diligence-dataroom` → `/h-da:spa-review` → `/h-da:gap-review` → `/h-da:closing-checklist-fr` |
| Entreprise en difficulté — **côté repreneur/acquéreur** | → `/h-da:asset-vs-share-distress` (sous-routeur titres vs actifs) |
| Entreprise en difficulté — **côté cédant/débiteur** | → `/h-da:distress-cedant` (sous-routeur sauver / céder / déposer) |
| Dirigeant exposé / responsabilité personnelle (procédure ouverte ou imminente) | `/h-da:responsabilite-dirigeant` |
| Dirigeant **assigné** (action L.651-2 / L.653 engagée — assignation reçue) | `/h-da:defense-dirigeant` |
| Créance dans une procédure ouverte | `/h-da:declaration-creance` |
| Vie sociale (AG / pacte / financement) | `/h-da:gouvernance-ag` · `/h-da:pacte-associes-review` · `/h-da:financement-startup` |

## Gate non-juriste

Si l'utilisateur n'est pas juriste ou avocat, produire une orientation
opérationnelle, signaler les limites, refuser toute conclusion présentée comme
avis juridique final et demander validation par un professionnel habilité avant
usage externe.

## Outils MCP à privilégier

**Ce routeur n'appelle aucun outil MCP directement** : il oriente vers les skills
qui les utilisent. Les outils du serveur `Hacienda Droit des Affaires` — notamment
`piste_status`, `legifrance_recherche`, `judilibre_recherche`, `eurlex_recherche`,
`bodacc_procedures`, `company_full_profile` — sont mobilisés par les skills cibles,
pas par l'orientation. Ne pas inventer de tool ; toute source non consultée
directement reste `[à vérifier]`.

## Emplacement des sorties

La recommandation d'orientation est conversationnelle et éphémère. Si l'utilisateur
demande une trace écrite, l'écrire dans
`~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/outputs/`.

## Sortie

Structurer la sortie d'orientation par : nature retenue du dossier ·
skill(s) recommandé(s) avec une phrase de justification chacun · garde-fous éventuels (ex : arrêt des poursuites si
procédure collective) · invitation à lancer le skill cible. Aucune analyse
juridique de fond. Toute orientation reste un aiguillage, pas un avis.

---

> Aiguillage — l'analyse juridique est produite par le skill cible, soumise à
> **validation humaine** avant tout usage externe.
