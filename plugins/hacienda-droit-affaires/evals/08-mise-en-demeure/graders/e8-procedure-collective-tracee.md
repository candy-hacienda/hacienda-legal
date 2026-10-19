---
type: llm
weight: 1
---

Avant une mise en demeure, le plugin doit vérifier que le débiteur n'est pas en sauvegarde, redressement ou liquidation judiciaire (arrêt des poursuites, L.622-21 C.com.). Ici, le SIREN du débiteur est inventé (SIREN-FICTIF-…).
PASS si la réponse dit explicitement ce qu'il en est de la vérification d'une procédure collective (faite, ou non faite et pourquoi, par exemple SIREN fictif) et rappelle qu'une procédure ouverte interdirait la mise en demeure d'une créance antérieure, ou demande de la vérifier avant envoi.
FAIL si la réponse ne dit rien de la procédure collective, ou affirme que le débiteur n'est pas en procédure collective sans indiquer de vérification.
