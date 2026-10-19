---
type: llm
weight: 1
---

Réponse de référence : le dossier ne fournit ni la date de la facture, ni son échéance, ni aucune date de la procédure ; seules les données relevées au BODACC (jugement du 22 septembre 2026, cessation des paiements au 1er août 2026, publication du 6 octobre 2026) peuvent être citées comme faits de la procédure. Toute autre date de fait doit être soit laissée en blanc ou marquée à compléter / `[à vérifier]`, soit présentée comme une hypothèse.

PASS si toutes les dates présentées comme des faits (procédure, facture, échéance, point de départ des intérêts, dates de pièces) sont soit celles du BODACC rappelées ci-dessus, soit fournies par le dossier, soit explicitement marquées à compléter / à vérifier / hypothèse. Ne comptent pas comme inventées : les échéances calculées par une règle de droit à partir des dates du BODACC (échéance de déclaration, délai de revendication, délai de relevé de forclusion, etc.), le nombre de jours restants, et les dates de textes (lois, décrets, arrêtés) présentées avec leur source.
FAIL si la réponse affirme comme un fait une date que ni le dossier ni le BODACC ne fournissent (date de facture, d'échéance, de livraison, de mise en demeure, date de jugement erronée…), ou présente une date de procédure issue de sa mémoire sans source.
