/**
 * Ảnh dự án đã được phép dùng, đăng ký theo khóa; seed/details chỉ tham chiếu bằng khóa.
 * Chỉ ảnh chụp THẬT đã che nhận diện bằng hình chữ nhật trắng thuần (scripts/redact-screens.mjs; ảnh gốc nằm ngoài repo).
 * Không dùng ảnh do AI tạo. Dự án chưa có ảnh thật dùng đồ họa vector (Scene).
 */
import type { ImageMetadata } from 'astro';
import lms1 from '../assets/projects/lms-1.webp';
import lms2 from '../assets/projects/lms-2.webp';
import lms3 from '../assets/projects/lms-3.webp';
import lms4 from '../assets/projects/lms-4.webp';
import cons1 from '../assets/projects/cons-1.webp';
import cons2 from '../assets/projects/cons-2.webp';
import cons3 from '../assets/projects/cons-3.webp';
import cons4 from '../assets/projects/cons-4.webp';
import cons5 from '../assets/projects/cons-5.webp';

export const projectImages: Record<string, ImageMetadata> = {
  'lms-1': lms1, 'lms-2': lms2, 'lms-3': lms3, 'lms-4': lms4,
  'cons-1': cons1, 'cons-2': cons2, 'cons-3': cons3, 'cons-4': cons4, 'cons-5': cons5,
};
