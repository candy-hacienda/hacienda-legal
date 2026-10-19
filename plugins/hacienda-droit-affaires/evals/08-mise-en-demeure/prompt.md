---
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
runs: 3
---

Nous représentons TEXTILIA, fournisseur de HÔTELLERIE DU LAC, qui ne paie plus ses factures. Rédige la mise en demeure de payer à partir des éléments ci-dessous.

Donne ta réponse dans la conversation ; ne crée pas de fichier.

## Posture cabinet (configurée)

- Cabinet d'avocats d'affaires ; utilisateur : avocat inscrit à un barreau français.
- Côté représenté : créancier (SAS TEXTILIA).
- Posture contrats commerciaux : équilibrée.
- Approbateur « Mise en demeure » : associé contentieux commercial.

## Faits fictifs

```
Parties (fictives) :

- TEXTILIA — SAS, SIREN-FICTIF-555555555, siège à Roubaix (59). Fabricant de
  linge hôtelier (draps, serviettes, peignoirs).
- HÔTELLERIE DU LAC — SAS, SIREN-FICTIF-666666666, siège à Annecy (74).
  Exploite trois hôtels. Aucune information sur une éventuelle procédure
  collective n'a été communiquée par le client.

Relation commerciale :

- Client de TEXTILIA depuis 2022. TEXTILIA souhaite être payée mais
  poursuivre la relation : il n'est pas question d'y mettre fin.
- Conditions générales de vente TEXTILIA (version 2025), acceptées par
  HÔTELLERIE DU LAC lors de sa première commande. Stipulations pertinentes :
  - Art. 6 « Paiement — Les factures sont payables à 30 jours date de
    facture. »
  - Art. 7 « Pénalités de retard — Tout retard de paiement entraîne de plein
    droit, dès le jour suivant la date de règlement figurant sur la facture,
    des pénalités au taux d'intérêt appliqué par la Banque centrale
    européenne à son opération de refinancement la plus récente majoré de
    10 points de pourcentage, ainsi qu'une indemnité forfaitaire pour frais
    de recouvrement de 40 €. »
  - Art. 9 « Clause pénale — Si le paiement n'est pas intervenu huit jours
    après une mise en demeure restée infructueuse, le client sera redevable
    d'une indemnité égale à 15 % des sommes restant dues. »

Factures émises et non réglées (date d'aujourd'hui : 14 octobre 2026) :

| Référence   | Date facture  | Échéance        | Montant HT  | Montant TTC |
|-------------|---------------|-----------------|-------------|-------------|
| F-2026-0611 | 30 juin 2026  | 30 juillet 2026 | 10 000,00 € | 12 000,00 € |
| F-2026-0702 | 31 juil 2026  | 30 août 2026    |  7 300,00 € |  8 760,00 € |
| F-2026-0815 | 16 août 2026  | 15 sept 2026    | 12 750,00 € | 15 300,00 € |
| F-2026-0930 | 1er oct 2026  | 31 oct 2026     |  6 000,00 € |  7 200,00 € |

Échanges :

- 10 septembre 2026 : relance amiable par courriel de TEXTILIA pour
  F-2026-0611 et F-2026-0702. Aucune réponse.
- 20 septembre 2026 : courriel de HÔTELLERIE DU LAC au sujet de F-2026-0815 :
  « Livraison incomplète : 2 palettes de serviettes sur 10 ne nous sont
  jamais parvenues. Nous ne réglerons cette facture qu'après correction. »
  Les 2 palettes représentent 2 550 € HT, soit 3 060 € TTC. Le bon de
  livraison a été signé par le réceptionnaire de l'hôtel avec la mention
  « sous réserve de comptage ». TEXTILIA n'a pas répondu et n'a émis aucun
  avoir.
- Aucun acompte, aucun paiement partiel, aucune créance réciproque.
- Aucune mise en demeure n'a encore été envoyée.
```
