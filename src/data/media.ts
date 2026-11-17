/**
 * Ảnh dự án đã được phép dùng, đăng ký theo khóa; seed/details chỉ tham chiếu bằng khóa.
 * Chỉ ảnh chụp THẬT đã che nhận diện bằng hình chữ nhật trắng thuần (scripts/redact-screens.mjs; ảnh gốc nằm ngoài repo).
 * Không dùng ảnh do AI tạo. Dự án chưa có ảnh thật dùng đồ họa vector (Scene).
 * td-*: chụp trực tiếp hệ thống tuyển dụng n8n ở 1440x900; logo, tên công ty, tên tài khoản và mọi thông tin
 * ứng viên/HR (họ tên, email, SĐT, file CV, ngày sinh, địa chỉ) được che trắng ngay trong trang trước khi chụp.
 * tv-*, zl-*: chụp cấu hình kịch bản Smax.ai; tên kênh/tổ chức, tên tài khoản, ảnh đại diện và số liệu gửi được che trắng;
 * không chụp hội thoại, danh sách khách hàng hay phần cấu hình chứa địa chỉ webhook/token.
 * lms-hv/gv/ad-*: chụp LMS theo 3 vai trò; họ tên, email, tên đăng nhập, ảnh đại diện, tên công ty/đơn vị nhận diện
 * được thay bằng nhãn "Bảo mật thông tin cá nhân"; không chụp tài liệu nội bộ có logo hay địa chỉ văn phòng.
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
import td1 from '../assets/projects/td-1.webp';
import td2 from '../assets/projects/td-2.webp';
import td3 from '../assets/projects/td-3.webp';
import td4 from '../assets/projects/td-4.webp';
import td5 from '../assets/projects/td-5.webp';
import td6 from '../assets/projects/td-6.webp';
import td7 from '../assets/projects/td-7.webp';
import td8 from '../assets/projects/td-8.webp';
import td9 from '../assets/projects/td-9.webp';
import lmsHv1 from '../assets/projects/lms-hv-1.webp';
import lmsHv2 from '../assets/projects/lms-hv-2.webp';
import lmsHv3 from '../assets/projects/lms-hv-3.webp';
import lmsHv4 from '../assets/projects/lms-hv-4.webp';
import lmsGv1 from '../assets/projects/lms-gv-1.webp';
import lmsGv2 from '../assets/projects/lms-gv-2.webp';
import lmsGv3 from '../assets/projects/lms-gv-3.webp';
import lmsGv4 from '../assets/projects/lms-gv-4.webp';
import lmsAd1 from '../assets/projects/lms-ad-1.webp';
import lmsAd2 from '../assets/projects/lms-ad-2.webp';
import lmsAd3 from '../assets/projects/lms-ad-3.webp';
import lmsAd4 from '../assets/projects/lms-ad-4.webp';
import lmsAd5 from '../assets/projects/lms-ad-5.webp';
import tv1 from '../assets/projects/tv-1.webp';
import tv2 from '../assets/projects/tv-2.webp';
import tv3 from '../assets/projects/tv-3.webp';
import tv4 from '../assets/projects/tv-4.webp';
import tv5 from '../assets/projects/tv-5.webp';
import tv6 from '../assets/projects/tv-6.webp';
import zl1 from '../assets/projects/zl-1.webp';
import zl2 from '../assets/projects/zl-2.webp';
import zl3 from '../assets/projects/zl-3.webp';

export const projectImages: Record<string, ImageMetadata> = {
  'lms-hv-1': lmsHv1, 'lms-hv-2': lmsHv2, 'lms-hv-3': lmsHv3, 'lms-hv-4': lmsHv4,
  'lms-gv-1': lmsGv1, 'lms-gv-2': lmsGv2, 'lms-gv-3': lmsGv3, 'lms-gv-4': lmsGv4,
  'lms-ad-1': lmsAd1, 'lms-ad-2': lmsAd2, 'lms-ad-3': lmsAd3, 'lms-ad-4': lmsAd4, 'lms-ad-5': lmsAd5,
  'tv-1': tv1, 'tv-2': tv2, 'tv-3': tv3, 'tv-4': tv4, 'tv-5': tv5, 'tv-6': tv6, 'zl-1': zl1, 'zl-2': zl2, 'zl-3': zl3,
  'td-1': td1, 'td-2': td2, 'td-3': td3, 'td-4': td4, 'td-5': td5, 'td-6': td6, 'td-7': td7, 'td-8': td8, 'td-9': td9,
  'lms-1': lms1, 'lms-2': lms2, 'lms-3': lms3, 'lms-4': lms4,
  'cons-1': cons1, 'cons-2': cons2, 'cons-3': cons3, 'cons-4': cons4, 'cons-5': cons5,
};
