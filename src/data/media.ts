/**
 * Ảnh dự án đã được phép dùng, đăng ký theo khóa; seed.ts chỉ tham chiếu bằng khóa.
 * HIỆN RỖNG: chủ website yêu cầu bỏ toàn bộ ảnh do AI tạo (16/11). Chỉ thêm ảnh chụp THẬT đã che chính xác
 * và được phép công khai (sourceType = screenshot_original) khi có.
 */
import type { ImageMetadata } from 'astro';

export const projectImages: Record<string, ImageMetadata> = {};
