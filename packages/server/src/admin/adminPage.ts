/**
 * Self-contained HTML/CSS/JS — no external chart library or CDN, just hand-rolled
 * bar charts (fixed-width div with a percentage-width fill). Fetches its own data
 * from /api/admin/stats, which sits behind the same Basic Auth as this page.
 */
export function getAdminPageHtml(): string {
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Угадай персонажа — админка</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 24px;
    font-family: -apple-system, Segoe UI, Roboto, sans-serif;
    background: #0f172a;
    color: #e2e8f0;
  }
  h1 { font-size: 20px; margin: 0 0 24px; }
  h2 { font-size: 15px; margin: 0 0 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .card { background: #1e293b; border-radius: 10px; padding: 16px 20px; }
  .totals { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .total-value { font-size: 28px; font-weight: 700; }
  .total-label { font-size: 13px; color: #94a3b8; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #334155; }
  th { color: #94a3b8; font-weight: 500; }
  .bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .bar-label { flex: 0 0 160px; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bar-track { flex: 1; background: #334155; border-radius: 4px; height: 16px; overflow: hidden; }
  .bar-fill { background: #6366f1; height: 100%; }
  .bar-count { flex: 0 0 40px; text-align: right; font-size: 13px; color: #94a3b8; }
  .empty { color: #94a3b8; font-size: 13px; }
  .error { color: #f87171; }
</style>
</head>
<body>
<h1>Угадай персонажа — статистика</h1>
<div id="root"><p class="empty">Загрузка…</p></div>
<script>
async function main() {
  const root = document.getElementById('root');
  let stats;
  try {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    stats = await res.json();
  } catch (e) {
    root.innerHTML = '<p class="error">Не удалось загрузить данные: ' + escapeHtml(String(e)) + '</p>';
    return;
  }
  if (!stats) {
    root.innerHTML = '<p class="empty">База данных не настроена (DATABASE_URL не задан) — аналитика отключена.</p>';
    return;
  }
  root.innerHTML = render(stats);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatDuration(seconds) {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m + ' мин ' + s + ' с';
}

function barChart(rows, labelKey, countKey, labelFormatter) {
  if (!rows.length) return '<p class="empty">Пока нет данных.</p>';
  const max = Math.max(...rows.map((r) => r[countKey]), 1);
  return rows
    .map((r) => {
      const pct = Math.max(4, Math.round((r[countKey] / max) * 100));
      const label = labelFormatter ? labelFormatter(r) : r[labelKey];
      return (
        '<div class="bar-row">' +
        '<div class="bar-label" title="' + escapeHtml(label) + '">' + escapeHtml(label) + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="bar-count">' + r[countKey] + '</div>' +
        '</div>'
      );
    })
    .join('');
}

function render(stats) {
  const totals = [
    ['Партий создано', stats.totals.games],
    ['Партий завершено', stats.totals.finishedGames],
    ['Вопросов задано', stats.totals.questions],
    ['Уникальных игроков', stats.totals.players],
  ];

  return (
    '<div class="totals">' +
    totals.map(([label, value]) =>
      '<div class="card"><div class="total-value">' + value + '</div><div class="total-label">' + escapeHtml(label) + '</div></div>'
    ).join('') +
    '</div>' +
    '<div class="grid">' +
    '<div class="card"><h2>Самые активные игроки</h2>' +
    barChart(stats.topPlayers, 'playerName', 'gamesPlayed', (r) => r.playerName + ' (побед: ' + r.wins + ')') +
    '</div>' +
    '<div class="card"><h2>Популярные наборы карточек</h2>' +
    barChart(stats.decks, 'deckId', 'count') +
    '</div>' +
    '<div class="card"><h2>Частые вопросы</h2>' +
    barChart(stats.topQuestions, 'text', 'count', (r) => r.text) +
    '</div>' +
    '<div class="card"><h2>Длительность партий</h2>' +
    '<table><tbody>' +
    '<tr><th>Завершённых партий (с таймингом)</th><td>' + stats.duration.finishedCount + '</td></tr>' +
    '<tr><th>Средняя длительность</th><td>' + formatDuration(stats.duration.avgSeconds) + '</td></tr>' +
    '<tr><th>Медианная длительность</th><td>' + formatDuration(stats.duration.medianSeconds) + '</td></tr>' +
    '</tbody></table>' +
    '</div>' +
    '</div>'
  );
}

main();
</script>
</body>
</html>
`;
}
