---
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
runs: 3
---

Dossier ci-dessous (fictif). Traite la demande formulée en fin de dossier.

Donne ta réponse dans la conversation ; ne crée pas de fichier.

## Scénario fictif

### L'entreprise : Boréal Logistique SAS

**Boréal Logistique SAS** (SIREN 491 327 605) est une PME de messagerie et de
logistique du dernier kilomètre, implantée à Roanne (42). Elle exploite un
entrepôt loué de 3 200 m², une flotte de 12 véhicules utilitaires (dont 8 en
crédit-bail) et emploie **31 salariés** en CDI. Son dirigeant-fondateur et
actionnaire majoritaire (78 % des titres) est **M. Armand Tessier**, gérant de
droit. Un fonds régional détient les 22 % restants.

**Contrats structurants :**
- Un **contrat-cadre** avec une enseigne de e-commerce (Cargonet) représentant
  **1,8 M€ sur 4,1 M€** de CA annuel, dénoncé par le client le mois dernier avec
  effet dans trois mois.
- Un **crédit-bail mobilier** sur 8 véhicules (loyers mensuels 14 000 €).
- Un **bail commercial** 3/6/9 avec clause de résiliation en cas de cession.

---

### Situation financière

L'exercice clos le 31 décembre 2025 fait apparaître :

| Poste | Montant |
|---|---|
| Chiffre d'affaires | 4 100 000 € |
| Résultat net | — 295 000 € |
| Dettes fournisseurs (> 90 j) | 410 000 € |
| TVA et cotisations sociales en souffrance | 247 000 € |
| Échéances de crédit-bail impayées (3 mois) | 42 000 € |
| Découvert bancaire autorisé (utilisé à 95 %) | 180 000 € |
| Ligne de crédit confirmée NON tirée | 150 000 € |
| Trésorerie disponible au 1er juin 2026 | 28 000 € |
| **Déficits fiscaux reportables** | **510 000 €** |

M. Tessier indique lors d'un entretien de mi-juin 2026 que la société « n'arrive
plus à payer les fournisseurs et l'URSSAF depuis le printemps, peut-être avril ou
mai, je ne saurais pas dire exactement ». Il précise qu'il **n'a rien déposé** au
greffe du Tribunal de commerce de Roanne et qu'**aucune procédure** ne figure au
BODACC au 20 juin 2026. Il s'est **porté caution personnelle** du découvert
bancaire (180 000 €) et d'une partie du crédit-bail.

---

### Ce que le dirigeant demande

> « On a perdu le contrat Cargonet, c'est la moitié de notre activité qui part
> dans trois mois. Honnêtement je ne sais plus quoi faire : est-ce que j'essaie de
> redresser la barre, est-ce que je vends à un confrère qui m'a approché, ou est-ce
> que je dois "déposer le bilan" ? Je veux surtout éviter d'y laisser ma maison —
> je me suis porté caution. Un cabinet m'a dit qu'il fallait d'abord tenter une
> conciliation pour gagner du temps, est-ce que c'est encore possible vu où on en
> est ? »

Un **repreneur potentiel** (un concurrent local) s'est manifesté de manière
informelle, sans offre écrite.

---

## Pièces fournies

### Pièce 1 — Extrait du bilan simplifié 31/12/2025 (fourni par Boréal)

| Actif | € | Passif | € |
|---|---|---|---|
| Immobilisations nettes | 520 000 | Capital social | 100 000 |
| Créances clients | 365 000 | Réserves | — 60 000 |
| Stocks / en-cours | 45 000 | Report à nouveau | — 180 000 |
| Trésorerie | 28 000 | Résultat | — 295 000 |
| | | Dettes financières | 360 000 |
| | | Dettes fournisseurs | 410 000 |
| | | Dettes fiscales et sociales | 247 000 |
| | | Autres dettes | 376 000 |
| **Total** | **958 000** | **Total** | **958 000** |

### Pièce 2 — Courriel de M. Tessier à son conseil (extrait, 17 juin 2026)

> « Comme je vous l'ai dit, on ne paie plus les fournisseurs ni l'URSSAF depuis le
> printemps — avril, mai, je ne sais plus trop. La banque me met la pression sur le
> découvert. J'ai encore une ligne de crédit de 150 000 € que je n'ai pas touchée,
> ça peut peut-être aider ? Je ne veux pas déposer le bilan, ça va faire fuir les
> derniers clients. Le concurrent qui veut racheter pourrait être une porte de
> sortie. »

### Pièce 3 — Lettre de dénonciation du contrat Cargonet (extrait, mai 2026)

> « Nous vous informons de notre décision de ne pas reconduire le contrat-cadre,
> avec effet à l'issue du préavis contractuel de trois mois. »

### Pièce 4 — Acte de cautionnement (extrait)

> « M. Armand Tessier se porte caution personnelle et solidaire envers la Banque du
> Forez, à hauteur de 180 000 €, de toutes sommes dues par Boréal Logistique SAS au
> titre du découvert en compte courant. »

---

## Posture cabinet configurée

**Cabinet** : Cabinet Verdière & Associés (conseil en droit des affaires, 3 avocats)
**Rôle** : conseil du dirigeant-cédant (M. Tessier / Boréal Logistique)
**Side** : cédant / débiteur
**Taille de deals typique** : 0,5 M€ – 10 M€
**Approbateur** : associé responsable restructuring (Me Verdière)
**Seuil d'escalade** : tout risque > 100 000 € ou exposition personnelle du dirigeant
**Politique PII** : active (défaut)

---

## Question / demande explicite

> « Bonjour, nous accompagnons M. Tessier, dirigeant de Boréal Logistique. Il
> hésite entre tenter de redresser l'entreprise, la céder à un concurrent qui s'est
> manifesté, ou déposer le bilan. Il s'inquiète aussi de son cautionnement
> personnel. Pouvez-vous nous préparer une note d'orientation sur la voie à
> privilégier et la marche à suivre ? »
