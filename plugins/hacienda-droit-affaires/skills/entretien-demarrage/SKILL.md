---
name: entretien-demarrage
description: >
  Onboarding du plugin droit des affaires : configure le profil cabinet (side
  principal M&A / procédures collectives / mixte), vérifie les connexions aux
  sources externes (Légifrance, Pappers, BODACC, Judilibre), réutilise un
  profil cabinet partagé s'il existe à ~/.claude/plugins/config/hacienda-juridique/company-profile.md.
  Mode --check-integrations pour relancer uniquement le diagnostic.
version: "2.0.0"
argument-hint: "[--redo ou --check-integrations]"
authors: ["Hacienda"]
tags: [onboarding, company-profile, integrations, credentials]
---

# Skill — Entretien de démarrage

> **Configuration initiale du plugin droit des affaires.**
>
> Lance ce skill au premier usage (15-20 min). Peuple CLAUDE.md, propose
> de configurer les sources externes, vérifie l'état des credentials.
> Relançable avec `--redo` pour recommencer ou `--check-integrations` pour
> ne refaire que le diagnostic connexions.

## Examples

<example>
<user>/h-da:entretien-demarrage</user>
<response>
1. Détecte si ~/.claude/plugins/config/hacienda-juridique/company-profile.md existe → propose
   réutiliser/enrichir/recommencer
2. Pose les questions du profil cabinet (15 min) → écrit profil partagé
3. Pose les questions spécifiques droit-affaires (5 min) → écrit dans
   CLAUDE.md du plugin
4. Diagnostic des connexions externes (loadConfig → credentialsSource)
5. Propose configuration des clés manquantes
</response>
</example>

<example>
<user>/h-da:entretien-demarrage --check-integrations</user>
<response>
Diagnostic uniquement, pas de relance des questions profil. Affiche le
tableau des sources avec ✓ / ? / ✗ et instructions de configuration.
</response>
</example>

<example>
<user>/h-da:entretien-demarrage --redo</user>
<response>
Recommence depuis zéro. Demande confirmation avant d'écraser le profil
existant.
</response>
</example>

## Chargement du profil

> Au démarrage : vérifier l'existence du profil partagé
> `~/.claude/plugins/config/hacienda-juridique/company-profile.md`. Si présent et non vide, lire
> les sections existantes et proposer 3 options : réutiliser /
> enrichir / recommencer.

## Intake

1. **Mode** — `--redo` (recommencer) | `--check-integrations` (diagnostic seul) | par défaut: complet
2. **Détection profil partagé** — recherche `~/.claude/plugins/config/hacienda-juridique/company-profile.md`
3. **Si présent** — afficher résumé (cabinet, side principal, juridiction) et proposer [r]éutiliser / [e]nrichir / [n]ouveau
4. **Si absent** — démarrer le questionnaire complet

## Gate non-juriste

Si l'utilisateur n'est pas juriste ou avocat, produire une explication opérationnelle, signaler les limites, refuser toute conclusion présentée comme avis juridique final et demander validation par un professionnel habilité avant usage externe.

## Outils MCP à privilégier

Appeler les outils par leur nom exact quand le serveur `Hacienda Droit des Affaires` est disponible. Ne pas inventer de tool hors périmètre ; si une source n'a pas été consultée directement, garder `[à vérifier]`.

- Socle sources officielles : `piste_status`, `legifrance_recherche`, `legifrance_get_article`, `judilibre_recherche`, `judilibre_get_decision`, `eurlex_recherche`, `eurlex_consulter`.
- Entreprises, BODACC et procédures collectives : `company_full_profile`, `bodacc_by_siren`, `bodacc_procedures`.
- Tout résultat issu d'un corpus client ou d'un outil interne reste distingué des sources primaires officielles.

## Emplacement des sorties

Écrire les livrables dans le dossier de pratique ou de dossier configuré : `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/outputs/` ou `~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/matters/<slug-dossier>/outputs/`.

## Sortie

Structurer la sortie avec : faits retenus, droit applicable, analyse, incertitudes, sources consultées, décisions proposées, prochaine action et validation humaine. Toute source non consultée directement reste `[à vérifier]`.

## Étape 1 — Profil cabinet partagé

Questions à poser séquentiellement (une par message, attendre réponse) :

1. Cabinet / entité (raison sociale complète)
2. Cadre d'exercice (cabinet avocats solo / petit / moyen-grand / direction juridique / notaire)
3. Side principal (M&A & corporate / procédures collectives / contrats commerciaux / mixte)
4. Juridictions habituelles (Paris / province / transfrontalier UE)
5. Taille équipe (1 / 2-10 / 11-50 / 50+)
6. Rôle de l'utilisateur (avocat inscrit / notaire / juriste in-house / non-juriste avec accès avocat)
7. Si non-juriste : avocat référent

**Écriture** : à la fin, écrire/mettre à jour `~/.claude/plugins/config/hacienda-juridique/company-profile.md` avec ces réponses.

## Étape 2 — Profil spécifique droit-affaires

Selon le "Side principal" sélectionné en Étape 1, poser uniquement les questions des blocs concernés :

**Si M&A & corporate ou mixte** :
- Side habituel deals (cédant / acquéreur / conseil des deux)
- Taille typique deals (< 5M€ / 5-50M€ / > 50M€)
- Secteurs cibles
- Posture DD (thèmes prioritaires)
- Posture GAP (durée / plafond / franchise / panier)

**Si procédures collectives ou mixte** :
- Position dominante (créancier / débiteur / mandataire / mixte)
- Tribunaux habituels
- Cadence dossiers actifs

**Si contrats commerciaux ou mixte** :
- Posture par défaut (protecteur / équilibré / facilitateur)
- Clauses "jamais acceptées"
- Positions clés (clause pénale, limitation responsabilité, droit applicable, non-concurrence)

**Matrice d'approbateurs** : 4 questions (revue contrat standard / mise en demeure / signature SPA / déclaration créance > 100k€)

**Écriture** : à la fin, mettre à jour la configuration dans le profil utilisateur du plugin.

## Étape 3 — Diagnostic des connexions externes

Vérifier les credentials disponibles et afficher le tableau suivant :

```
Vérification des connexions :

[✓] BODACC public          — opérationnel (sans configuration)
[✓] Annuaire DINUM         — opérationnel (sans configuration)
[?] Pappers                — PAPPERS_API_KEY absente
    → Ajouter dans ~/.config/Hacienda/credentials.json
    → Sans clé : fallback BODACC public (données moins enrichies)
[?] Légifrance (PISTE)     — clés OAuth absentes
    → Ajouter PISTE_CLIENT_ID + PISTE_CLIENT_SECRET
    → Sans clé : verifier-citations tourne en mode dégradé
       (toutes citations taguées [à vérifier])
[✓] Judilibre              — opérationnel (sans configuration)

Mode dégradé actif : Pappers + PISTE non configurés.
```

Si l'utilisateur veut configurer maintenant, le guider vers :

```bash
mkdir -p ~/.config/Hacienda
cat > ~/.config/Hacienda/credentials.json <<EOF
{
  "PISTE_CLIENT_ID": "...",
  "PISTE_CLIENT_SECRET": "...",
  "PAPPERS_API_KEY": "..."
}
EOF
chmod 600 ~/.config/Hacienda/credentials.json
```

Instructions pour obtenir les clés :
- PISTE : https://piste.gouv.fr/ (créer une appli, gratuit)
- Pappers : https://www.pappers.fr/api (payant)

## Sortie — Format livrable

```
✓ Profil cabinet enregistré : ~/.claude/plugins/config/hacienda-juridique/company-profile.md
✓ Configuration droit-affaires : [chemin config utilisateur]
✓ Diagnostic connexions : [état] mode [opérationnel/dégradé]

Prochaines étapes recommandées :
- /h-da:reviser-contrat <fichier>  (pour tester)
- /h-da:declaration-creance <fichier>
- /h-da:entretien-demarrage --check-integrations
  (à relancer si vous configurez des clés API plus tard)
```

---

> Sortie brouillon soumise à **validation humaine** avant tout usage externe.
