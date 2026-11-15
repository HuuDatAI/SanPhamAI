/**
 * Ảnh dự án đã được phép dùng, đăng ký theo khóa. seed.ts chỉ tham chiếu bằng khóa (không import ảnh) để dữ liệu
 * vẫn là JSON thuần khi chuyển sang backend Google. Mọi ảnh ở đây hiện là ảnh MINH HỌA (isIllustrative = true);
 * ảnh chụp hệ thống thật chỉ thêm khi đã được che/cho phép công khai.
 */
import type { ImageMetadata } from 'astro';
import recruitmentConcept from '../assets/projects/recruitment-concept.webp';

export const projectImages: Record<string, ImageMetadata> = {
  'recruitment-concept': recruitmentConcept,
};
