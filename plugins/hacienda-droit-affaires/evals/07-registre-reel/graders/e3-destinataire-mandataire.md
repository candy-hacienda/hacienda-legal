---
type: llm
weight: 1
---

Réponse de référence (relevée au BODACC) : le mandataire judiciaire désigné est la **SELARL Philae**, 23 rue de Margaux, 33000 Bordeaux. L'annonce précise que les déclarations sont à adresser au mandataire judiciaire ou sur le portail électronique prévu aux articles L.814-2 et L.814-13 du code de commerce. Les deux voies de dépôt sont valables ; ce critère vérifie que le mandataire désigné a été identifié.

PASS si la réponse identifie la SELARL Philae (Bordeaux) comme mandataire judiciaire destinataire de la déclaration, que le dépôt soit prévu par courrier ou par le portail électronique.
FAIL si elle est adressée à un autre destinataire principal (débiteur, tribunal, administrateur judiciaire), à un mandataire autre que la SELARL Philae, ou si la réponse nomme une personne physique ou une adresse qui ne figurent pas à l'annonce, ou si aucun mandataire n'est identifié (une réponse qui renvoie seulement au portail électronique sans nommer le mandataire désigné échoue).
