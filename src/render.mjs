import { escapeHtml } from './utils.mjs';

try {
  const css = await fs.readFile(path.join(__dirname, 'theme.css'));
  await writeFile('assets/homeboard.css', css);
} catch {}

export function renderHtml({ title, generatedAt, cards, csp, theme='auto', grid }) {
  const css = /* css */'<link rel="stylesheet" href="assets/homeboard.css">';
  const cspMeta = `<meta http-equiv="Content-Security-Policy" content="${escapeHtml(csp)}">`;

  const cardHtml = cards.map(card => {
    const width = Math.min(Math.max(card.width||1,1), grid.columns);
    let body = '';
    if (card.kind === 'bookmark-list') {
      body = `<div class="list">` + card.content.map(it =>
        `<div class="card"><a href="${escapeHtml(it.url)}">${escapeHtml(it.title)}</a></div>`
      ).join('') + `</div>`;
    } else if (card.kind === 'svg') {
      body = `<div class="card">${card.content}</div>`;
    } else if (card.kind === 'image') {
      body = `<div class="card"><img src="${escapeHtml(card.content)}" alt="${escapeHtml(card.title||'')}" style="max-width:100%;border-radius:8px"/></div>`;
    } else if (card.kind === 'html' && card.trusted === true) {
      body = `<div class="card">${card.content}</div>`;
    } else if (card.kind === 'html') {
      body = `<div class="card"><pre>${escapeHtml(card.content)}</pre></div>`;
    } else {
      body = `<div class="card"><pre>${escapeHtml(JSON.stringify(card.content, null, 2))}</pre></div>`;
    }
    return `<section style="grid-column: span ${width}"><h3>${escapeHtml(card.title||'')}</h3>${body}</section>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${cspMeta}
<title>${escapeHtml(title)}</title>
<style>${css}</style>
</head>
<body>
<header class="header">
  <div class="title">${escapeHtml(title)}</div>
  <div class="meta badge">Generated ${escapeHtml(generatedAt)}</div>
</header>
<main class="grid">
${cardHtml}
</main>
</body>
</html>`;
}

