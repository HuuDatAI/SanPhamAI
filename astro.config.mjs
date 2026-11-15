import { defineConfig } from 'astro/config';

// Site chạy ở /du-an/ trên GitHub Pages của repo này. Đổi host chỉ cần đổi 2 dòng dưới.
export default defineConfig({
  site: 'https://sonreus259-gif.github.io',
  base: '/du-an',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
});
