# Sources officielles — droit des affaires français

Catalogue de référence des sources mobilisables par les skills du plugin
`hacienda-droit-affaires`, avec distinction entre ce qui est accessible via
`@hacienda/core`, ce qui relève d'un spécialiste (hors périmètre de ce plugin), et ce qui doit rester
tagué comme recherche externe ou connaissance modèle.

---

## Légende

- `✓ Intégré core` — accessible via outils MCP `@hacienda/core`
- `🔌 Companion` — disponible si un autre plugin Hacienda est installé
- `🌐 Web` — accessible par recherche externe, à taguer `[recherche web — à vérifier]`
- `🧠 Modèle` — connaissance modèle uniquement, à taguer `[connaissance modèle — à vérifier]`

---

## Sources accessibles

| Source | Statut | Outil core / accès | Usage principal |
|---|---|---|---|
| Légifrance (PISTE) | ✓ Intégré core | `legifranceCheckArticle`, `legifranceGetArticle` [a verifier selon export exact] | Articles C.civ, C.com., CPI, consolidation des codes, vérification de citations |
| JORF (lois, décrets, ordonnances) | ✓ Intégré core | via Légifrance | Vérification des textes promulgués, réformes, entrée en vigueur |
| Judilibre (Cour de cassation Open Data) | ✓ Intégré core | `judilibre_recherche`, `judilibre_get_decision` | Arrêts ch. com., ch. soc., ch. civ., contrôle des jurisprudences citées |
| Pappers | ✓ Intégré core | `pappersCompanyProfile` si clé configurée | Fiche société enrichie : dirigeants, actionnariat, comptes, événements |
| BODACC OpenDataSoft | ✓ Intégré core | `bodacc_by_siren`, `bodacc_procedures` | Immatriculations, modifications, radiations, procédures collectives |
| Annuaire entreprises DINUM / API Entreprise publique | ✓ Intégré core | via `company_full_profile` | Recherche société par nom, SIREN, statut de base sans auth payante |
| Eurlex | ✓ Intégré core | modules Eurlex core | Rome I, Bruxelles I bis, règlements UE, textes européens business |
| BOFiP | ✗ Non intégré | `bofip_rechercher` interroge le fonds CIRC de Légifrance (circulaires ministérielles), pas la base BOFiP-Impôts | Doctrine fiscale en due diligence M&A : à vérifier sur bofip.impots.gouv.fr |
| BOSS | ✓ Intégré core | `bossQuery` [a verifier selon export exact] | Doctrine sociale utile pour non-concurrence, rémunération, protection sociale |
| Pappers MCP externe | 🌐 Web | connecteur externe optionnel | Découverte outillée si besoin hors wrappers core |
| AMF Décisions / Doctrine | 🌐 Web | amf-france.org | Cibles cotées, abus de marché, gouvernance financière, hors v1 |
| CJUE / CURIA | 🌐 Web | curia.europa.eu | Jurisprudence UE quand Eurlex ne suffit pas |
| JOUE | 🌐 Web | eur-lex.europa.eu | Publication officielle UE, utile pour textes consolidés |
| INPI Data marques / brevets | 🔌 Companion | spécialiste PI (hors périmètre) | Orienter si le sujet bascule en PI, titres, portefeuille, oppositions |
| OMPI Madrid / Patentscope | 🔌 Companion | spécialiste PI (hors périmètre) ou web | Dossiers internationaux marques / brevets |
| Doctrine et commentaires privés | 🧠 Modèle | aucune source primaire | Utilisables seulement comme orientation, jamais comme citation finale |

---

## Usages par workflow

| Workflow | Sources prioritaires | Commentaire |
|---|---|---|
| `reviser-contrat` | Légifrance, Judilibre, Eurlex, BOSS selon sujet | Base pour clauses contractuelles, concurrence, droit social incident |
| `reviser-nda` | Légifrance, Judilibre | Secret des affaires, obligation de confidentialité, durée |
| `gap-review` | Légifrance, Judilibre, Pappers, BOFiP | Corporate, fiscal, contentieux, signaux d'alerte société |
| `declaration-creance` | BODACC, Pappers, Légifrance | Procédure collective, délais, identification débiteur |
| `verifier-citations` | Légifrance, Judilibre | Post-flight automatique des références textuelles et jurisprudentielles |

---

## Configuration credentials

Tous les secrets restent dans `~/.config/Hacienda/credentials.json`.

- `PISTE_CLIENT_ID` + `PISTE_CLIENT_SECRET`
  - usage : Légifrance / PISTE
  - statut : recommandé
  - sans ces clés, `verifier-citations` reste en mode dégradé

- `PAPPERS_API_KEY`
  - usage : Pappers
  - statut : optionnel mais utile pour enrichissement corporate
  - sans cette clé, fallback BODACC + Annuaire entreprises

Exemple de posture attendue :

```json
{
  "PISTE_CLIENT_ID": "...",
  "PISTE_CLIENT_SECRET": "...",
  "PAPPERS_API_KEY": "..."
}
```

---

## Modes dégradés

| Source indisponible | Effet | Comportement attendu |
|---|---|---|
| PISTE absent | pas de vérification live Légifrance | taguer `[à vérifier]`, expliciter le mode dégradé |
| Pappers absent | données corporate moins riches | fallback BODACC + Annuaire entreprises |
| Judilibre indisponible | validation jurisprudentielle partielle | signaler l'absence de contrôle et ne pas sur-affirmer |
| Eurlex non consulté | angle UE fragile | marquer la référence `[à vérifier]` |

---

## Règles d'usage

1. Ne pas annoncer une source comme "connectée" sur la seule base d'un fichier de config.
2. Préférer toujours la source primaire officielle quand elle est disponible.
3. Toute citation non consultée en session doit être marquée `[à vérifier]`.
4. Si le sujet devient PI-centric, orienter vers un spécialiste PI (hors périmètre de ce plugin) plutôt que dupliquer la logique.
