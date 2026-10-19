# Grille de due diligence M&A — droit français

Grille de référence pour le skill `due-diligence-dataroom`. Sept thèmes
d'audit d'une cible française dans le cadre d'une cession de titres ou
d'actifs. Pour chaque thème : les **points de contrôle**, les **documents
typiquement attendus en data-room**, les **signaux d'alerte (red flags)**.

> **Statut.** Document de référence praticien. Les listes de documents sont des
> standards de marché, pas une norme codifiée — taguer `[connaissance modèle —
> à vérifier]` à proximité quand on s'en sert dans un livrable. Les seuils de
> matérialité dépendent du deal et de la posture DD configurée au profil.

> **Thèmes 4 (PI), 5 (Fiscal) et 7 (RGPD) — pointeurs vers expertise dédiée.**
> `due-diligence-dataroom` réalise pour ces trois thèmes l'**analyse de premier
> niveau** : recensement des documents, détection des red flags, documents
> manquants. Il **ne se substitue pas** à l'expertise approfondie : l'audit PI
> détaillé relève d'un spécialiste PI (hors périmètre de ce plugin), l'audit fiscal d'un spécialiste fiscal et de l'expert-comptable, l'audit RGPD approfondi d'un
> spécialiste RGPD (tous hors périmètre de ce plugin). Les pointeurs sont rappelés en tête de chaque thème
> concerné.

---

## Échelle de gravité des findings

Échelle canonique du `CLAUDE.md §3` du plugin :

| Niveau | Icône | Lecture DD |
|---|---|---|
| Faible | 🟢 | Conforme / documenté / sans réserve |
| Moyen | 🟡 | Point à clarifier, surveiller, question au cédant |
| Élevé | 🟠 | Anomalie ou exposition à traiter — clause GAP, ajustement de prix, condition suspensive |
| Bloquant | 🔴 | Risque dirimant — escalade, condition suspensive ferme, ou remise en cause du deal |

Tout jugement subjectif (matérialité d'un litige, opposabilité d'une clause,
suffisance d'une couverture) porte le tag inline `[review]`.

---

## Thème 1 — Corporate / Gouvernance

### Points de contrôle

- **Statuts** à jour, cohérents avec la forme sociale et le capital ; clauses
  d'agrément, de préemption, d'inaliénabilité ; dernière mise à jour postérieure
  aux dernières opérations sur le capital.
- **Capital social** : montant, répartition, libération intégrale, catégories
  d'actions / parts (actions de préférence), valeurs mobilières donnant accès au
  capital (BSA, BSPCE, OC, OBSA), dilution potentielle.
- **PV d'assemblées générales** (ordinaires et extraordinaires) et **PV d'organes**
  (conseil d'administration, conseil de surveillance, comité — selon la forme) :
  approbation régulière des comptes, décisions soumises à autorisation, quorum et
  majorités respectés.
- **Pactes d'associés** : existence, parties, clauses (sortie conjointe, sortie
  forcée, préemption, droit d'information, leaver, anti-dilution), articulation
  avec les statuts, sort du pacte en cas de changement de contrôle — renvoi
  `pacte-associes-review` pour l'analyse de fond.
- **Registres de mouvements de titres** et comptes individuels d'associés :
  tenue, à jour, traçabilité de la chaîne de propriété des titres jusqu'au cédant.
- **Délégations de pouvoirs** : existence, périmètre, validité, signataires
  habilités à engager la société.
- **Conventions réglementées** : recensement, autorisations et rapports spéciaux.
- **Filiales et participations** : organigramme, contrôle, titres détenus.

### Documents attendus en data-room

- Statuts à jour + extrait Kbis récent.
- Procès-verbaux des AG des 3 derniers exercices + PV des organes de direction.
- Tableau de capitalisation (cap table) et historique des opérations sur le capital.
- Registre des mouvements de titres, comptes individuels d'associés, ordres de mouvement.
- Pacte(s) d'associés et avenants en vigueur.
- Délégations de pouvoirs et de signature.
- Rapports spéciaux sur les conventions réglementées.
- Organigramme juridique du groupe.

### Signaux d'alerte (red flags)

- 🔴 Chaîne de propriété des titres incomplète ou incohérente (rupture dans le
  registre des mouvements) — la cible n'est pas en mesure de prouver qui détient quoi.
- 🔴 Clause d'agrément ou de préemption non purgée avant cession — l'opération
  est inopposable ou attaquable `[review]`.
- 🟠 Pacte d'associés contenant une clause de changement de contrôle, un droit de
  sortie conjointe ou de préemption déclenché par la cession — articulation à
  traiter avant signing.
- 🟠 Statuts non mis à jour après une opération sur le capital ; capital non
  intégralement libéré.
- 🟠 PV manquants, comptes non approuvés sur un ou plusieurs exercices.
- 🟡 Délégations de pouvoirs imprécises, périmées, ou signataires non identifiables.
- 🟡 Conventions réglementées non autorisées ou non rapportées.

---

## Thème 2 — Contrats matériels

### Points de contrôle

- **Contrats clients et fournisseurs clés** : identification des contrats
  structurants (concentration du chiffre d'affaires, dépendance économique),
  parties, objet, volumes.
- **Clauses de changement de contrôle** (*change of control*) : présence d'une
  clause permettant au cocontractant de résilier, renégocier ou exiger son
  consentement en cas de changement d'actionnariat de la cible — **red flag
  central d'une DD M&A** : la cession peut déclencher la perte d'un contrat clé.
- **Clauses d'exclusivité** : engagements d'exclusivité donnés ou reçus, périmètre,
  durée, articulation avec le droit de la concurrence (art. L.420-1 C.com.
  `[à vérifier]` si effet d'éviction).
- **Durée et résiliation** : durée ferme, tacite reconduction, préavis, conditions
  et indemnités de résiliation, contrats à durée indéterminée résiliables à court
  préavis (risque de perte rapide).
- **Conditions financières** : pénalités, clauses pénales (art. 1231-5 C.civ
  `[Légifrance]`), indexation, *most favored customer*.
- **Engagements hors exploitation** : cautionnements, garanties données à des tiers,
  contrats intra-groupe.

### Documents attendus en data-room

- Liste des principaux clients et fournisseurs avec part dans le chiffre d'affaires.
- Contrats clients et fournisseurs clés (top 10–20 par CA), avec avenants.
- Conditions générales de vente et d'achat.
- Contrats de distribution, d'agence, de franchise, de sous-traitance.
- Baux commerciaux et contrats immobiliers.
- Contrats de financement, conventions de trésorerie, cautionnements.

### Signaux d'alerte (red flags)

- 🔴 Contrat client ou fournisseur clé comportant une clause de changement de
  contrôle permettant au cocontractant de résilier ou de bloquer la cession —
  risque direct sur la valeur de la cible.
- 🔴 Concentration excessive du chiffre d'affaires sur un client résiliable à court préavis.
- 🟠 Clause d'exclusivité longue ou large susceptible de tomber sous L.420-1 C.com.
  `[à vérifier]` ; engagement de non-concurrence donné par la cible.
- 🟠 Contrat clé arrivé à échéance ou en tacite reconduction sans contrat écrit à jour.
- 🟠 Cautionnement ou garantie donné à un tiers, hors bilan, non provisionné.
- 🟡 Contrats clés non signés, non datés, ou en version projet.
- 🟡 Préavis de résiliation très court sur des contrats structurants.

---

## Thème 3 — Social / RH

### Points de contrôle

- **Contrats des dirigeants** : mandat social, rémunération, avantages,
  indemnités de départ (*golden parachute*), clauses de non-concurrence
  post-mandat, clauses de changement de contrôle.
- **Contrats des salariés clés** (*key persons*) : hommes-clés dont le départ
  affecterait la valeur de la cible, clauses de non-concurrence (contrepartie
  financière obligatoire en droit français — à vérifier), clauses de mobilité.
- **Accords collectifs** : convention collective applicable, accords d'entreprise,
  usages et engagements unilatéraux.
- **Engagements de retraite** et avantages assimilés : indemnités de fin de
  carrière, retraite supplémentaire, provisionnement.
- **Intéressement, participation, épargne salariale**, plans d'actionnariat
  salarié (BSPCE, attributions gratuites d'actions).
- **Effectif et masse salariale** : registre du personnel, contrats à durée
  déterminée, intérim, temps partiel.
- **Contentieux prud'homal** : litiges en cours et menaçants, provisions.
- **Représentation du personnel** : CSE, obligation d'information-consultation
  préalable à l'opération (art. L.2312-8 C. trav. `[à vérifier]`), transfert des
  contrats de travail en cas de cession d'actifs (art. L.1224-1 C. trav.
  `[à vérifier]`).

### Documents attendus en data-room

- Contrats de travail des dirigeants et des salariés clés, avenants.
- Registre unique du personnel, organigramme RH, table des effectifs.
- Convention collective et accords d'entreprise en vigueur.
- Accords d'intéressement et de participation, règlements de plans.
- Évaluation des engagements de retraite, rapports actuariels.
- État des contentieux prud'homaux et provisions associées.
- PV des réunions du CSE, avis rendus.

### Signaux d'alerte (red flags)

- 🔴 Contentieux prud'homal significatif en cours, non ou insuffisamment provisionné `[review]`.
- 🔴 Absence d'information-consultation du CSE alors qu'elle est requise pour
  l'opération `[à vérifier]` — irrégularité de procédure.
- 🟠 Indemnité de départ de dirigeant déclenchée par le changement de contrôle
  (*golden parachute*) — passif latent.
- 🟠 Clause de non-concurrence de salarié clé sans contrepartie financière —
  clause nulle, l'homme-clé n'est pas retenu.
- 🟠 Engagements de retraite non provisionnés ou sous-provisionnés.
- 🟡 Recours important aux CDD / intérim, requalification possible.
- 🟡 Convention collective mal identifiée ou accords d'entreprise non à jour.

---

## Thème 4 — Propriété intellectuelle

> **Pointeur — spécialiste PI (hors périmètre de ce plugin).** Ce thème couvre le
> **recensement et la détection des red flags PI**. L'audit PI approfondi
> (validité des titres, liberté d'exploitation, valorisation, chaîne de cession
> des droits) relève d'un spécialiste PI (hors périmètre de ce plugin).
> Orienter dès qu'un actif PI est structurant pour la valeur de
> la cible.

### Points de contrôle

- **Titularité des droits** : la cible est-elle bien titulaire des droits qu'elle
  exploite ? Chaîne de cession des droits d'auteur (notamment développeurs,
  prestataires externes — cession écrite requise), dévolution des inventions de salariés.
- **Dépôts** : marques, brevets, dessins et modèles, noms de domaine — titularité,
  classes, territoires, échéances de renouvellement, inscriptions à jour aux registres.
- **Licences entrantes** : droits de tiers utilisés par la cible (logiciels,
  brevets, marques), conditions, clauses de changement de contrôle, durée.
- **Licences sortantes** : droits concédés par la cible à des tiers, exclusivités consenties.
- **Logiciels et open source** : composants open source intégrés aux produits,
  licences (copyleft / permissives), risque de contamination, conformité des obligations.
- **Secrets d'affaires et savoir-faire** : mesures de protection, accords de
  confidentialité avec les salariés et prestataires.

### Documents attendus en data-room

- Portefeuille de titres de PI : marques, brevets, dessins et modèles, noms de domaine.
- Certificats de dépôt et d'enregistrement, état des renouvellements.
- Contrats de cession de droits (développeurs, prestataires, fondateurs).
- Contrats de licence entrants et sortants.
- Inventaire des logiciels et des composants open source (*software bill of materials*).
- Accords de confidentialité et clauses de PI des contrats de travail.

### Signaux d'alerte (red flags)

- 🔴 Actif PI structurant exploité sans titularité établie (pas de cession écrite
  des droits par les développeurs ou prestataires) — la cible ne possède pas ce
  qu'elle vend `[review]`.
- 🔴 Composant open source en licence copyleft intégré à un produit propriétaire
  distribué — risque de contamination ; orientation vers un spécialiste PI.
- 🟠 Titre de PI clé non renouvelé, déchu, ou avec inscription non à jour au registre.
- 🟠 Licence entrante critique comportant une clause de changement de contrôle.
- 🟡 Portefeuille de marques mal couvert (classes ou territoires d'exploitation non protégés).
- 🟡 Absence de clause de PI dans les contrats de travail des développeurs.

---

## Thème 5 — Fiscal / Financier

> **Pointeur — spécialiste fiscal (hors périmètre de ce plugin) et expert-comptable.** Ce thème couvre le
> **recensement et la détection des red flags fiscaux et financiers**. L'audit
> fiscal approfondi (chiffrage d'un risque de redressement, régime des plus-values,
> droits d'enregistrement, neutralité fiscale d'une restructuration) relève d'un
> spécialiste fiscal (hors périmètre de ce plugin) et de l'expert-comptable. Pas de conseil fiscal
> détaillé ici — signalement et renvoi.

### Points de contrôle

- **Liasses fiscales** des 3 derniers exercices : cohérence avec les comptes,
  résultat fiscal, impôt sur les sociétés.
- **Contrôles fiscaux** en cours ou passés : avis de vérification, propositions
  de rectification, contentieux fiscal, transactions avec l'administration.
- **Intégration fiscale** : périmètre du groupe intégré, convention d'intégration,
  sort de la cible en cas de sortie du groupe intégré (réintégrations, conventions
  de répartition de la charge d'impôt).
- **Reports déficitaires** : montant des déficits reportables, conditions de
  conservation après changement de contrôle ou d'activité.
- **TVA** : régime, déclarations, crédits de TVA.
- **Impôts locaux et taxes diverses** : CFE, CVAE, taxes assises sur les salaires.
- **Prix de transfert** : politique, documentation, opérations intra-groupe transfrontalières.
- **Situation financière** : endettement, covenants bancaires, trésorerie,
  engagements hors bilan, *locked box* ou comptes de closing.

### Documents attendus en data-room

- Liasses fiscales et comptes annuels des 3 derniers exercices.
- Avis de vérification, propositions de rectification, courriers de l'administration fiscale.
- Convention d'intégration fiscale et calcul des déficits reportables.
- Déclarations de TVA, état des crédits de TVA.
- Documentation prix de transfert.
- Contrats de financement, tableau d'endettement, covenants.

### Signaux d'alerte (red flags)

- 🔴 Contrôle fiscal en cours avec proposition de rectification chiffrée non
  provisionnée — passif fiscal probable `[review]` ; orientation vers un spécialiste fiscal.
- 🟠 Déficits reportables substantiels exposés à la perte en cas de changement de
  contrôle ou d'activité — la valeur attendue de l'actif d'impôt différé peut
  disparaître `[à vérifier]`.
- 🟠 Sortie de l'intégration fiscale entraînant des réintégrations ou une charge
  de sortie non anticipée.
- 🟠 Covenants bancaires comportant une clause d'exigibilité anticipée en cas de
  changement de contrôle.
- 🟡 Documentation prix de transfert absente ou incomplète sur des flux intra-groupe significatifs.
- 🟡 Crédit de TVA important non remboursé, ancienneté élevée.

---

## Thème 6 — Contentieux / Passifs

### Points de contrôle

- **Litiges en cours** : procédures judiciaires, arbitrales et administratives où
  la cible est demanderesse ou défenderesse — objet, montant en jeu, stade, aléa.
- **Litiges menaçants** : réclamations reçues, mises en demeure, précontentieux non
  encore judiciarisés.
- **Provisions** : adéquation des provisions comptables aux risques contentieux
  identifiés, méthode d'évaluation.
- **Garanties données** : cautionnements, garanties autonomes, lettres d'intention,
  garanties de passif consenties lors d'opérations antérieures.
- **Engagements hors bilan** : crédit-bail, engagements de retraite (renvoi thème 3),
  nantissements, sûretés consenties.
- **Assurances** : police responsabilité civile, sinistralité, couverture des
  risques identifiés, exclusions.
- **Conformité produits / responsabilité** : rappels de produits, réclamations
  consommateurs, contentieux de responsabilité du fait des produits.

### Documents attendus en data-room

- État des litiges en cours et menaçants, avec note d'évaluation par les conseils.
- Décisions de justice et sentences arbitrales rendues.
- Tableau des provisions pour risques et charges.
- État des garanties données, sûretés, cautionnements.
- Engagements hors bilan recensés.
- Polices d'assurance et historique de sinistralité.

### Signaux d'alerte (red flags)

- 🔴 Litige en cours d'enjeu significatif au regard de la taille de la cible,
  insuffisamment provisionné ou non provisionné `[review]`.
- 🔴 Garantie de passif ou caution donnée à un tiers, exposant la cible à un passif
  non maîtrisé hors bilan.
- 🟠 Provisions manifestement sous-évaluées par rapport aux notes des conseils.
- 🟠 Litige menaçant sérieux non encore judiciarisé, non provisionné.
- 🟠 Couverture d'assurance insuffisante ou exclusion sur un risque matériel identifié.
- 🟡 Multiplication de petits litiges révélant un risque systémique (qualité produit,
  pratique commerciale, RH).
- 🟡 Absence de note d'évaluation des conseils sur des litiges en cours.

---

## Thème 7 — RGPD / Conformité réglementaire

> **Pointeur — spécialiste RGPD (hors périmètre de ce plugin).** Ce thème couvre le **recensement et la
> détection des red flags de conformité données personnelles**. L'audit RGPD
> approfondi (analyse du registre traitement par traitement, conformité des
> bases légales, analyses d'impact, transferts hors UE, contrôle des
> sous-traitants) relève d'un spécialiste RGPD (hors périmètre de ce plugin). L'analyse de premier niveau
> ci-dessous reste réalisée par `due-diligence-dataroom`.

### Points de contrôle

- **Registre des traitements** (art. 30 RGPD `[à vérifier]`) : existence,
  exhaustivité, mise à jour ; finalités, bases légales, durées de conservation,
  catégories de données et de personnes concernées.
- **Contrats de sous-traitance** (art. 28 RGPD `[à vérifier]`) : la cible
  encadre-t-elle ses sous-traitants par un acte conforme à l'art. 28 ? Inversement,
  est-elle elle-même sous-traitant et liée à ses clients ?
- **Information et droits des personnes** : mentions d'information, modalités
  d'exercice des droits, gestion des demandes.
- **Sécurité et violations** : mesures techniques et organisationnelles,
  historique des violations de données et notifications à la CNIL.
- **Transferts hors UE** : existence de transferts, garanties (clauses types,
  décisions d'adéquation).
- **Analyses d'impact** (AIPD) pour les traitements à risque élevé.
- **DPO** : désignation le cas échéant, positionnement.
- **Conformité sectorielle** : réglementation propre au secteur de la cible
  (santé, finance, transport, ICPE environnement, etc.).
- **Autorisations administratives** : agréments, licences, enregistrements
  nécessaires à l'activité ; transférabilité en cas de changement de contrôle.

### Documents attendus en data-room

- Registre des traitements de données personnelles.
- Contrats de sous-traitance (clauses ou avenants art. 28 RGPD).
- Politiques de confidentialité, mentions d'information, procédures d'exercice des droits.
- Registre des violations de données, notifications CNIL.
- Analyses d'impact (AIPD) réalisées.
- Documentation des transferts hors UE et garanties associées.
- Autorisations, agréments et licences sectorielles ; correspondances avec les régulateurs.

### Signaux d'alerte (red flags)

- 🔴 Absence de registre des traitements, ou registre manifestement incomplet —
  non-conformité structurelle ; orientation vers un spécialiste RGPD pour l'audit approfondi `[review]`.
- 🔴 Autorisation ou agrément sectoriel indispensable à l'activité non transférable,
  ou caduc en cas de changement de contrôle.
- 🟠 Sous-traitants non encadrés par un acte conforme à l'art. 28 RGPD `[à vérifier]`.
- 🟠 Violation de données passée non notifiée, ou traitement à risque sans AIPD.
- 🟠 Transferts hors UE sans garanties documentées.
- 🟡 Mentions d'information incomplètes, procédures d'exercice des droits non formalisées.
- 🟡 DPO non désigné alors que la désignation paraît requise `[review]`.

---

## Synthèse — matrice thème × livrables DD

| # | Thème | Pointeur expertise dédiée | Red flag emblématique |
|---|---|---|---|
| 1 | Corporate / Gouvernance | `pacte-associes-review` (analyse de fond du pacte) | Chaîne de propriété des titres rompue |
| 2 | Contrats matériels | — | Clause de changement de contrôle sur un contrat clé |
| 3 | Social / RH | — | Contentieux prud'homal non provisionné |
| 4 | Propriété intellectuelle | Spécialiste PI (hors périmètre) | Actif PI exploité sans titularité établie |
| 5 | Fiscal / Financier | Spécialiste fiscal (hors périmètre) + expert-comptable | Contrôle fiscal en cours non provisionné |
| 6 | Contentieux / Passifs | — | Litige significatif non provisionné |
| 7 | RGPD / Conformité | Spécialiste RGPD (hors périmètre) | Registre des traitements absent / incomplet |
