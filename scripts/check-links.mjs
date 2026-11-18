// Kiểm liên kết nội bộ sau build: mọi href/src bắt đầu bằng /SanPhamAI/ phải trỏ tới tệp có thật trong dist (URL trực tiếp không 404).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const BASE = '/SanPhamAI';
function walk(d) { return readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
if (!existsSync(dist)) { console.error('Chưa build.'); process.exit(2); }

const pages = walk(dist).filter((p) => p.endsWith('.html'));
const bad = []; let checked = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
    for (const raw of m[1].split(',').map((x) => x.trim().split(' ')[0])) {
      if (!raw.startsWith(BASE + '/') && raw !== BASE) continue;
      const [path] = raw.split('#')[0].split('?');
      const rel = path.slice(BASE.length) || '/';
      const target = join(dist, rel);
      const ok = extname(rel) ? existsSync(target) : existsSync(join(target, 'index.html'));
      checked++;
      if (!ok) bad.push(`${page.replace(dist, '')}: ${raw}`);
    }
  }
  // neo #fragment trong cùng trang
  for (const m of html.matchAll(/href="#([^"]+)"/g)) { checked++; if (!html.includes(`id="${m[1]}"`)) bad.push(`${page.replace(dist, '')}: #${m[1]} không có id`); }
}
console.log(`Đã kiểm ${pages.length} trang, ${checked} liên kết, hỏng: ${bad.length}`);
bad.slice(0, 20).forEach((b) => console.error('  ' + b));
process.exit(bad.length ? 1 : 0);
