// Kiểm tra nội dung công khai sau build: không tên tổ chức, không link ngoài ngoài whitelist, không nút tải.
// Danh sách từ cấm đọc từ scripts/forbidden.local.txt (KHÔNG commit, để bản thân tên không lộ trong repo).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const localList = join(root, 'scripts', 'forbidden.local.txt');
const forbidden = existsSync(localList) ? readFileSync(localList, 'utf8').split('\n').map((s) => s.trim().toLowerCase()).filter(Boolean) : [];
const allowedHosts = new Set(['fonts.googleapis.com', 'fonts.gstatic.com', 'sonreus259-gif.github.io']);

function walk(dir) { return readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
if (!existsSync(dist)) { console.error('Chưa build: chạy npm run build trước.'); process.exit(2); }

let bad = 0; let files = 0;
for (const f of walk(dist).filter((p) => /\.(html|xml|txt|json|js|css|svg)$/.test(p))) {
  files++;
  const text = readFileSync(f, 'utf8'); const low = text.toLowerCase();
  for (const w of forbidden) if (low.includes(w)) { console.error(`CẤM  ${f}: chứa từ trong danh sách cục bộ`); bad++; }
  for (const m of text.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
    const h = m[1].toLowerCase();
    if (!allowedHosts.has(h) && !['www.w3.org'].includes(h)) { console.error(`LINK  ${f}: host ngoài whitelist: ${h}`); bad++; }
  }
  if (/\bdownload\b\s*[=>]/i.test(text) && f.endsWith('.html')) { console.error(`TẢI  ${f}: có thuộc tính download`); bad++; }
}
console.log(`Đã quét ${files} tệp, từ cấm cục bộ: ${forbidden.length}, vi phạm: ${bad}`);
process.exit(bad ? 1 : 0);
