/**
 * Ảnh dự án đã được phép dùng, đăng ký theo khóa. seed.ts chỉ tham chiếu bằng khóa (không import ảnh) để dữ liệu
 * vẫn là JSON thuần khi chuyển sang backend Google.
 * Mọi ảnh ở đây hiện là ảnh do AI tạo (sourceType = ai_illustration) với dữ liệu mẫu; KHÔNG phải ảnh chụp hệ thống thật.
 * Ảnh chụp thật chỉ thêm khi đã được che chính xác và cho phép công khai (sourceType = screenshot_original).
 */
import type { ImageMetadata } from 'astro';
import recruitment1 from '../assets/projects/recruitment-1.webp';
import recruitment2 from '../assets/projects/recruitment-2.webp';
import recruitment3 from '../assets/projects/recruitment-3.webp';
import sales1 from '../assets/projects/sales-1.webp';
import sales2 from '../assets/projects/sales-2.webp';
import support1 from '../assets/projects/support-1.webp';
import support2 from '../assets/projects/support-2.webp';

export const projectImages: Record<string, ImageMetadata> = {
  'recruitment-1': recruitment1, 'recruitment-2': recruitment2, 'recruitment-3': recruitment3,
  'sales-1': sales1, 'sales-2': sales2,
  'support-1': support1, 'support-2': support2,
};
