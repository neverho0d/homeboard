export const meta = { id: 'loadavg', name: 'System Load', order: 5, width: 1 };

export default async function run(ctx) {
  let val = 'n/a';
  try {
    const { stdout } = await ctx.exec('cat', ['/proc/loadavg']);
    val = stdout.trim().split(/\s+/)[0];
  } catch {}
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="42">
    <rect x="0" y="0" width="200" height="42" rx="8" fill="none" stroke="currentColor" opacity="0.2"/>
    <text x="12" y="28" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="18">
      load ${ctx.escapeHtml(String(val))}
    </text>
  </svg>`;
  return [{
    id: 'sys-load',
    title: 'System Load',
    kind: 'svg',
    content: svg,
    updatedAt: new Date().toISOString(),
    width: 1
  }];
}

