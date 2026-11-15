// Giải mã QR CỤC BỘ (không gửi ảnh ra ngoài): node scripts/decode-qr.mjs public/contact/zalo-qr.png
import sharp from 'sharp';
import jsQR from 'jsqr';
const file = process.argv[2];
const img = sharp(file).ensureAlpha();
const meta = await img.metadata();
for (const scale of [1, 0.75, 0.5, 1.25]) {
  const w = Math.round(meta.width * scale);
  const { data, info } = await sharp(file).resize({ width: w }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const r = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength), info.width, info.height, { inversionAttempts: 'attemptBoth' });
  if (r) { console.log(JSON.stringify({ scale, data: r.data, version: r.version })); process.exit(0); }
}
console.log('KHÔNG giải mã được'); process.exit(1);
