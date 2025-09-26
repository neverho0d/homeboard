import fs from 'fs/promises';
import path from 'path';
import { paths, readJson, writeFile, escapeHtml } from './utils.mjs';
import { execFile } from 'child_process';
import { promisify } from 'util';
const pexec = promisify(execFile);

export function createCtx(config) {
  const cachePath = (k) => paths.cache(`${k}.json`);
  return {
    now: new Date(),
    config,
    log: (...a) => console.log('[plugin]', ...a),
    cache: {
      async get(key, ttlSec) {
        try {
          const p = cachePath(key);
          const s = await fs.readFile(p, 'utf8');
          const o = JSON.parse(s);
          if (!ttlSec) return o.v;
          if ((Date.now() - o.t) / 1000 <= ttlSec) return o.v;
          return null;
        } catch { return null; }
      },
      async set(key, value) {
        const p = cachePath(key);
        await fs.mkdir(path.dirname(p), { recursive: true });
        await fs.writeFile(p, JSON.stringify({ t: Date.now(), v: value }), 'utf8');
      }
    },
    paths,
    async writeAsset(rel, data) {
      const out = `assets/${rel.replace(/^\/+/, '')}`;
      await writeFile(out, data);
      return out;
    },
    escapeHtml,
    async exec(cmd, args = [], timeoutMs = 4000) {
      const { stdout, stderr } = await pexec(cmd, args, { timeout: timeoutMs, encoding: 'utf8', maxBuffer: 1024*1024 });
      return { stdout, stderr, code: 0 };
    },
    async readJson(p) {
      return readJson(p, null);
    }
  };
}

