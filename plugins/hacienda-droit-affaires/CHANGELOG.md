# Changelog — hacienda-droit-affaires

## 0.20.0 — version initiale de ce dépôt (2026-10-19)

Plugin de droit des affaires français, brouillons ancrés dans les textes et
soumis à validation humaine.

### Contenu
- **31 skills et commandes** (`/h-da:…`) :
  - contrats commerciaux : `reviser-contrat`, `reviser-nda`, `cgv-generator`, `mise-en-demeure-commerciale`, `analyser-rupture-brutale` ;
  - vie sociale et financement : `constitution-societe`, `gouvernance-ag`, `pacte-associes-review`, `financement-startup`, `management-package-pe` ;
  - M&A, de la lettre d'intention au closing, avec lentille Private Equity : `loi-term-sheet`, `due-diligence-dataroom`, `spa-review`, `gap-review`, `closing-checklist-fr`, `revue-tabulaire`, `liste-de-points` ;
  - entreprises en difficulté, côté créancier, dirigeant et repreneur : `declaration-creance`, `declaration-cessation-paiements`, `prevention-difficultes`, `pre-pack-cession`, `reprise-a-la-barre`, `cession-actifs-isoles`, `asset-vs-share-distress`, `distress-cedant`, `responsabilite-dirigeant`, `defense-dirigeant` ;
  - transversaux : `entretien-demarrage`, `verifier-citations`, `consulter-digest`, `cas`.
- **4 agents de veille** : jurisprudence, BODACC (portefeuille et procédures), échéances sociétaires.
- **Serveur MCP embarqué** : Légifrance, Judilibre, BOFiP, BOSS, EUR-Lex, BODACC et profil entreprise (30 outils), construit depuis `packages/core`.

### Périmètre
Propriété intellectuelle, fiscal, RGPD, social et droit réglementaire sont hors
périmètre de ce plugin : le plugin le signale et oriente vers un spécialiste.

### Garde-fous
- Toute source non consultée reste marquée `[à vérifier]`.
- Aucune sortie n'est présentée comme un conseil juridique final.
- Les pièces et contenus récupérés sont des données, jamais des instructions.
