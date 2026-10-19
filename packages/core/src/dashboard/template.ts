export const DASHBOARD_TEMPLATE = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{TITLE}} — Hacienda Juridique</title>
<style>
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 16px;
  color: #222;
  background: #fff;
  line-height: 1.5;
}
h1 { margin: 0 0 4px; font-size: 1.6rem; }
.generated { color: #57606a; font-size: 0.85rem; margin-bottom: 16px; }

header { margin-bottom: 16px; }

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 16px 0;
}
.stat-card {
  padding: 16px;
  background: #f6f8fa;
  border-radius: 8px;
  border: 1px solid #d0d7de;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-card .emoji { font-size: 1.4rem; }
.stat-card .value { font-size: 1.6rem; font-weight: 600; color: #111; }
.stat-card .label { font-size: 0.85rem; color: #57606a; text-transform: uppercase; letter-spacing: 0.03em; }

.severity-legend {
  margin: 8px 0 16px;
  font-size: 0.85rem;
  color: #57606a;
}
.severity-legend .legend-item { margin-right: 8px; }

.reviewer-note {
  margin: 16px 0;
  padding: 12px 16px;
  background: #fffbea;
  border-left: 4px solid #fc0;
  border-radius: 4px;
}
.reviewer-note summary { cursor: pointer; font-weight: 600; }
.reviewer-note .reviewer-line { margin: 4px 0; padding-left: 8px; border-left: 2px solid #d0d7de; color: #444; }

.filter-bar {
  display: flex;
  gap: 8px;
  margin: 16px 0 8px;
  flex-wrap: wrap;
  align-items: center;
}
.filter-bar input#search {
  flex: 1;
  min-width: 220px;
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font: inherit;
}
#severity-filters { display: flex; gap: 4px; flex-wrap: wrap; }
#severity-filters button {
  padding: 6px 10px;
  border: 1px solid #d0d7de;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
}
#severity-filters button.active { background: #0969da; color: #fff; border-color: #0969da; }

table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.92rem;
  margin-top: 8px;
}
thead th {
  position: sticky;
  top: 0;
  background: #f6f8fa;
  text-align: left;
  padding: 10px 12px;
  border-bottom: 2px solid #d0d7de;
  user-select: none;
}
thead th.sortable { cursor: pointer; }
thead th.sortable::after { content: " ⇅"; color: #999; font-size: 0.8em; }
thead th.sort-asc::after { content: " ▲"; color: #0969da; }
thead th.sort-desc::after { content: " ▼"; color: #0969da; }
tbody td { padding: 8px 12px; border-bottom: 1px solid #eaeef2; vertical-align: top; }
tbody tr:hover td { background: #f6f8fa; }

.severity-red td { background: #fee; }
.severity-orange td { background: #fef7e6; }
.severity-yellow td { background: #fffbea; }
.severity-green td { background: #e6f6e6; }
.severity-red:hover td { background: #fdd; }
.severity-orange:hover td { background: #fdecc8; }
.severity-yellow:hover td { background: #fff3c4; }
.severity-green:hover td { background: #d1ecd1; }

footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #d0d7de;
  font-size: 0.8rem;
  color: #57606a;
  text-align: center;
}

@media print {
  body { margin: 0; max-width: none; padding: 8mm; font-size: 10pt; }
  .filter-bar { display: none; }
  thead th { position: static; background: transparent !important; }
  tbody tr:hover td { background: transparent; }
  .severity-red td, .severity-orange td, .severity-yellow td, .severity-green td { background: transparent !important; }
  .severity-red td { border-left: 4px solid #d33; }
  .severity-orange td { border-left: 4px solid #f80; }
  .severity-yellow td { border-left: 4px solid #fc0; }
  .severity-green td { border-left: 4px solid #3a3; }
  .reviewer-note { break-inside: avoid; }
  table { page-break-inside: auto; }
  tr { page-break-inside: avoid; page-break-after: auto; }
}
</style>
</head>
<body>
<header>
  <h1>{{TITLE}}</h1>
  <div class="generated">Généré le {{GENERATED_AT}}</div>
</header>

{{REVIEWER_NOTE_HTML}}

<div class="summary">{{SUMMARY_HTML}}</div>

{{SEVERITY_LEGEND_HTML}}

<div class="filter-bar">
  <input id="search" type="search" placeholder="Rechercher...">
  <div id="severity-filters">
    <button data-sev="" class="active">Toutes</button>
    <button data-sev="severity-red">🔴</button>
    <button data-sev="severity-orange">🟠</button>
    <button data-sev="severity-yellow">🟡</button>
    <button data-sev="severity-green">🟢</button>
  </div>
</div>

<table id="main-table">
  <thead><tr>{{TABLE_HEADERS_HTML}}</tr></thead>
  <tbody>{{TABLE_ROWS_HTML}}</tbody>
</table>

<footer>Généré par Hacienda Juridique v{{FOOTER_VERSION}}</footer>

<script>
(function () {
  var table = document.getElementById("main-table");
  if (!table) return;
  var tbody = table.querySelector("tbody");
  var headers = table.querySelectorAll("thead th");
  var searchInput = document.getElementById("search");
  var sevButtons = document.querySelectorAll("#severity-filters button");

  var state = { query: "", severity: "", sortIndex: -1, sortDir: 1 };

  function applyFilters() {
    var q = state.query.toLowerCase();
    var sev = state.severity;
    var rows = tbody.querySelectorAll("tr");
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var matchesSev = !sev || row.classList.contains(sev);
      var matchesQ = true;
      if (q) {
        matchesQ = false;
        var cells = row.querySelectorAll("td");
        for (var j = 0; j < cells.length; j++) {
          if (cells[j].textContent.toLowerCase().indexOf(q) !== -1) {
            matchesQ = true;
            break;
          }
        }
      }
      row.style.display = matchesSev && matchesQ ? "" : "none";
    }
  }

  function sortBy(index) {
    if (state.sortIndex === index) {
      state.sortDir = -state.sortDir;
    } else {
      state.sortIndex = index;
      state.sortDir = 1;
    }
    var rows = Array.prototype.slice.call(tbody.querySelectorAll("tr"));
    rows.sort(function (a, b) {
      var ca = a.children[index] ? a.children[index].textContent.trim() : "";
      var cb = b.children[index] ? b.children[index].textContent.trim() : "";
      var na = parseFloat(ca);
      var nb = parseFloat(cb);
      var cmp;
      if (!isNaN(na) && !isNaN(nb)) {
        cmp = na - nb;
      } else {
        cmp = ca.localeCompare(cb, "fr");
      }
      return cmp * state.sortDir;
    });
    for (var i = 0; i < rows.length; i++) tbody.appendChild(rows[i]);
    for (var k = 0; k < headers.length; k++) {
      headers[k].classList.remove("sort-asc", "sort-desc");
    }
    headers[index].classList.add(state.sortDir === 1 ? "sort-asc" : "sort-desc");
  }

  for (var i = 0; i < headers.length; i++) {
    (function (idx, th) {
      if (th.classList.contains("sortable")) {
        th.addEventListener("click", function () { sortBy(idx); });
      }
    })(i, headers[i]);
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value || "";
      applyFilters();
    });
  }

  for (var b = 0; b < sevButtons.length; b++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        state.severity = btn.getAttribute("data-sev") || "";
        for (var x = 0; x < sevButtons.length; x++) sevButtons[x].classList.remove("active");
        btn.classList.add("active");
        applyFilters();
      });
    })(sevButtons[b]);
  }
})();
</script>
</body>
</html>`;
