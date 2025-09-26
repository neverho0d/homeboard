#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { ensureDirs, paths, readJson, writeFile } from './utils.mjs';
import { createCtx } from './ctx.mjs';
import { renderHtml } from './render.mjs';
import { makeCsp } from './csp.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadPlugins(dir, ctx) {
  const entries = await fs.readdir(dir).catch(()=>[]);
  const items = [];
  for (const f of entries.filter(f=>f.endsWith('.mjs'))) {
    const full = path.join(dir, f);
    try {
      const mod = await import(pathToFileURL(full).href);
      const meta = mod.meta || { id: f.replace(/\.mjs$/,''), order: 100, width: 1 };
      const run = mod.default;
      if (typeof run !== 'function') continue;
      items.push({ meta, run, file: f });
    } catch (e) {
      console.error('Failed to load plugin', f, e);
    }
  }
  return items.sort((a,b)=>(a.meta.order??100)-(b.meta.order??100));
}

async function main() {
  await ensureDirs();
  const config = await readJson(paths.config('config.json'), {
    siteTitle: 'HomeBoard', theme: 'auto', grid: { columns: 4, gap: 12 }, plugins: {}
  });

  const ctx = createCtx(config);
  const pluginsDir = path.join(__dirname, 'plugins.d');
  const plugins = await loadPlugins(pluginsDir, ctx);

  const cards = [];
  for (const p of plugins) {
    const width = config.plugins?.[p.meta.id]?.width ?? p.meta.width ?? 1;
    try {
      const res = await Promise.race([
        p.run(ctx),
        new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')), 5000))
      ]);
      for (const c of (Array.isArray(res) ? res : [res]).filter(Boolean)) {
        c.width = c.width || width;
        cards.push(c);
      }
    } catch (e) {
      cards.push({
        id: `err-${p.meta.id}`, title: `${p.meta.name||p.meta.id} (error)`,
        kind: 'html', content: `<pre>${String(e)}</pre>`, width: 1
      });
    }
  }

  const html = renderHtml({
    title: config.siteTitle,
    generatedAt: new Date().toLocaleString(),
    cards,
    csp: makeCsp({ allowInline: true }),
    theme: config.theme,
    grid: config.grid || { columns: 4, gap: 12 }
  });

  await writeFile('index.html', html);
  console.log('Generated:', paths.data('index.html'));
}

main().catch(err => { console.error(err); process.exit(1); });

