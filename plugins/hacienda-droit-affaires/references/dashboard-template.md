# Référence — Dashboard HTML standardisé

Guide d'utilisation du module `@hacienda/core/dashboard/` pour produire des sorties data-heavy interactives. Pattern réutilisé cross-plugins Hacienda — adaptation droit-affaires pour les findings M&A, registres de surveillance BODACC, échéances sociétaires et listes de points de revue contractuelle.

---

## Quand utiliser le dashboard HTML

Génération automatique recommandée quand un output dépasse **10 lignes tabulaires** ou contient des données structurées avec sévérité / statut / dates :

- Listes de points consolidées (`liste-de-points`, `reviser-contrat`, `gap-review`) au-delà de 10 clauses
- Findings DD confrontés au GAP (`gap-review` axe 5)
- Digest agent `bodacc-watcher` ou `bodacc-procedures-watcher` au-delà de 10 alertes hebdo
- Tableau de bord échéances sociétaires (`echeances-societaires`) au-delà de 10 clients
- Tableau multi-documents (`revue-tabulaire`) avec colonnes calculées

En deçà de 10 lignes ou pour une réponse narrative, rester en Markdown seul.

---

## Comment depuis un skill

```ts
import { renderDashboard, type DashboardData } from "@hacienda/core";
import * as fs from "node:fs/promises";

const data: DashboardData = {
  title: "Liste de points — SPA Cession Cible X",
  generatedAt: new Date().toISOString().slice(0, 10),
  summary: [
    { label: "Total clauses analysées", value: 23 },
    { label: "🔴 Bloquant", value: 2 },
    { label: "🟠 À négocier", value: 5 },
    { label: "🟡 À discuter", value: 8 },
    { label: "🟢 OK", value: 8 },
  ],
  columns: [
    { key: "id", label: "#", width: "60px" },
    { key: "clause", label: "Clause" },
    { key: "statut", label: "Statut" },
    { key: "risque", label: "Risque" },
    { key: "position", label: "Position souhaitée" },
  ],
  rows: [
    { id: "1", clause: "Plafond GAP 12% prix", statut: "🟠 À négocier", risque: "Sous fourchette acquéreur 20-25%", position: "Négocier hausse vers 20%" },
    // ... autres lignes, valeurs déjà sous forme de strings simples
  ],
  severityLegend: {
    "🔴": "Bloquant",
    "🟠": "Élevé / à négocier",
    "🟡": "Moyen / à discuter",
    "🟢": "Faible / OK",
  },
  reviewerNote: "⚠️ Note du relecteur\n- **Sources :** Légifrance ✓ / Judilibre ✓\n- **Avant de t'appuyer dessus :** 2 clauses 🔴 escaladées vers approbateur SPA",
};

const html = renderDashboard(data);
await fs.writeFile(outputPath, html, "utf8");
```

---

## Standardisation visuelle

- **Couleurs sévérité** (canoniques cross-plugin) : 🔴 `#d33` / 🟠 `#f80` / 🟡 `#fc0` / 🟢 `#3a3`. Détection automatique sur le contenu des cellules — ne pas réimplémenter.
- **Summary cards** en grid responsive en haut du dashboard.
- **Légende sévérité** sous le résumé, format inline avec séparateurs `·`.
- **Note du relecteur** : `<details open>` repliable, Markdown basique supporté (`**bold**`, `> blockquote`, `\n`).
- **Table** : sticky header, tri par colonne au clic, filtre texte live, boutons de filtre sévérité.

---

## Sécurité XSS

`renderDashboard` escape automatiquement toutes les valeurs via `escapeHtml`. **Mais** :

- NE JAMAIS passer du HTML brut dans `reviewerNote`, dans les valeurs de `rows`, ou dans les labels.
- Le skill construit des **strings simples** ; le module les escape.
- Pour les URLs (futur), utiliser `escapeUrl` qui valide le scheme (`http:`, `https:`, `mailto:` seulement).
- Aucune dépendance externe, aucun CDN, aucun `eval` côté JS inline.

---

## Localisation des fichiers

À côté du Markdown de sortie, suffixe `.html` :

```
~/.claude/plugins/config/hacienda-juridique/hacienda-droit-affaires/outputs/
  revue-spa-cible-X-2026-05-19.md         ← rapport Markdown (note du relecteur + livrable)
  revue-spa-cible-X-2026-05-19.html       ← dashboard interactif
```

Toujours surfacer le chemin du `.html` dans la sortie Markdown : `Dashboard généré : [chemin]`.

---

## Pas de dépendance externe

Le fichier HTML est **standalone** :

- Ouvrable hors-ligne (zéro CDN, zéro requête réseau).
- Imprimable A4 (CSS `@media print` avec marges, pas de fond, table sans hover).
- Compatible Chrome, Firefox, Safari récents.
- Aucune télémétrie.

---

## Cibles d'usage par skill

- `reviser-contrat`, `reviser-nda`, `gap-review` : liste de points consolidée (colonnes # / Clause / Statut / Risque / Position / Reformulation) — invocation via `liste-de-points` en mode composant.
- `gap-review` axe 5 : tableau gap analysis findings DD ↔ garantie applicable.
- `revue-tabulaire` : extraction multi-documents avec colonnes ad hoc (parties, dates, montants, clauses sensibles).
- `declaration-creance` : peu utile (un dossier = une déclaration), sauf si batch sur portefeuille de débiteurs (rare).
- Agent `bodacc-watcher` : digest hebdo > 10 alertes (Date / Label / SIREN / Événement / Sévérité / Action).
- Agent `bodacc-procedures-watcher` : dossiers actifs avec déclaration en cours (Label / SIREN / Date forclusion / Jours restants / Sévérité / Statut) + nouvelles procédures détectées.
- Agent `echeances-societaires` : tableau hebdo (Client / SIREN / Obligation / Date butoir / Jours restants / Notes) groupé par sévérité.

Toute extension passe par le même `DashboardData` — pas de fork du module, pas de variante.

---

## Test rapide en local

```bash
node -e "import('./packages/core/dist/dashboard/index.js').then(m => { const html = m.renderDashboard({title: 'Test', generatedAt: '2026-05-19', summary: [], columns: [{key: 'id', label: 'ID'}], rows: [{id: 'A1'}]}); require('fs').writeFileSync('/tmp/test-dashboard.html', html); console.log('OK ' + html.length + ' chars'); });"
```

Ouvrir le fichier généré dans un navigateur pour vérifier le rendu visuel.
