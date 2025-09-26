import fs from 'fs/promises';
import path from 'path';

export const paths = {
  data: (...p) => path.join(process.env.XDG_DATA_HOME || `${process.env.HOME}/.local/share`, 'homeboard', ...p),
  config: (...p) => path.join(process.env.XDG_CONFIG_HOME || `${process.env.HOME}/.config`, 'homeboard', ...p),
  cache: (...p) => path.join(process.env.XDG_CACHE_HOME || `${process.env.HOME}/.cache`, 'homeboard', ...p)
};

export async function ensureDirs() {
  for (const maker of [paths.data(), paths.data('assets'), paths.cache()]) {
    await fs.mkdir(maker, { recursive: true });
  }
}

export async function readJson(p, fallback = null) {
  try {
    const s = await fs.readFile(p, 'utf8');
    return JSON.parse(s);
  } catch { return fallback; }
}

export async function writeFile(relPath, data) {
  const full = path.isAbsolute(relPath) ? relPath : paths.data(relPath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
  return full;
}

export function escapeHtml(s='') {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

