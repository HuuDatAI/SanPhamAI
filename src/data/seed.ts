/**
 * Dữ liệu seed — chế độ "mẫu". Sẽ được thay bằng backend thật qua src/lib/store.ts.
 * Quy tắc nội dung (BA-004/006/007): không tên công ty/trường, không link tổ chức, không số liệu/tính năng bịa.
 * - Mục có `isSample: true` là dữ liệu minh họa và luôn hiện nhãn "Minh họa".
 * - Mục thật chỉ có mô tả ở mức đã xác nhận; phần còn thiếu hiển thị "đang bổ sung".
 */

export type Kind = 'funnel' | 'people' | 'chat' | 'lms' | 'building' | 'sheet' | 'cards' | 'calendar';

export interface Category { id: string; name: string; slug: string; }

export interface Project {
  id: string; slug: string; title: string; summary: string;
  industryIds: string[]; solutionIds: string[];
  technologies: string[];
  features: string[];      // chỉ tính năng đã xác nhận; để trống nếu chưa có
  problem?: string;
  videoUrl?: string; demoUrl?: string;
  featured: boolean; sortOrder: number;
  isSample: boolean; art: Kind;
}

export interface Course {
  id: string; slug: string; title: string; summary: string;
  audience: string[]; syllabus: string[];
  priceMode: 'contact' | 'fixed'; priceAmount?: number;
  scheduleText: string; format?: string;
  featured: boolean; sortOrder: number; art: Kind;
}

export const industries: Category[] = [
  { id: 'ind-nhan-su', name: 'Nhân sự – Tuyển dụng', slug: 'nhan-su-tuyen-dung' },
  { id: 'ind-ban-hang', name: 'Bán hàng – Kinh doanh', slug: 'ban-hang-kinh-doanh' },
  { id: 'ind-tmdt', name: 'Thương mại điện tử', slug: 'thuong-mai-dien-tu' },
  { id: 'ind-dao-tao', name: 'Đào tạo', slug: 'dao-tao' },
  { id: 'ind-xay-dung', name: 'Xây dựng', slug: 'xay-dung' },
  { id: 'ind-ke-toan', name: 'Kế toán – Tài chính', slug: 'ke-toan-tai-chinh' },
  { id: 'ind-van-phong', name: 'Hành chính – Văn phòng', slug: 'hanh-chinh-van-phong' },
];

export const solutions: Category[] = [
  { id: 'sol-ai', name: 'Giải pháp AI', slug: 'giai-phap-ai' },
  { id: 'sol-du-lieu', name: 'Phân tích dữ liệu', slug: 'phan-tich-du-lieu' },
  { id: 'sol-he-thong', name: 'Hệ thống quản lý', slug: 'he-thong-quan-ly' },
  { id: 'sol-tu-dong', name: 'Tự động hóa', slug: 'tu-dong-hoa' },
];

export const projects: Project[] = [
  {
    id: 'p-tuyen-dung', slug: 'ai-ho-tro-tuyen-dung', title: 'AI hỗ trợ tuyển dụng',
    summary: 'Giải pháp AI hỗ trợ công việc tuyển dụng.',
    industryIds: ['ind-nhan-su'], solutionIds: ['sol-ai'], technologies: [], features: [],
    featured: true, sortOrder: 1, isSample: false, art: 'people',
  },
  {
    id: 'p-ban-hang', slug: 'ai-phan-tich-hieu-qua-ban-hang', title: 'AI phân tích hiệu quả bán hàng',
    summary: 'Giải pháp AI hỗ trợ phân tích hiệu quả hoạt động bán hàng.',
    industryIds: ['ind-ban-hang'], solutionIds: ['sol-ai', 'sol-du-lieu'], technologies: [], features: [],
    featured: true, sortOrder: 2, isSample: false, art: 'funnel',
  },
  {
    id: 'p-tu-van', slug: 'ai-tu-van-khach-hang-da-kenh', title: 'AI tư vấn khách hàng đa kênh',
    summary: 'AI tư vấn khách hàng qua mạng xã hội và các kênh thương mại điện tử.',
    industryIds: ['ind-tmdt', 'ind-ban-hang'], solutionIds: ['sol-ai', 'sol-tu-dong'], technologies: [], features: [],
    featured: true, sortOrder: 3, isSample: false, art: 'chat',
  },
  {
    id: 'p-lms', slug: 'lms-cho-doanh-nghiep', title: 'LMS cho doanh nghiệp',
    summary: 'Hệ thống phục vụ đào tạo nội bộ: quản lý học viên, quản lý nội dung và theo dõi tiến độ học.',
    industryIds: ['ind-dao-tao'], solutionIds: ['sol-he-thong'], technologies: [], features: [],
    featured: true, sortOrder: 4, isSample: false, art: 'lms',
  },
  {
    id: 'p-xay-dung', slug: 'giai-phap-ai-cho-doanh-nghiep-xay-dung', title: 'Giải pháp AI cho doanh nghiệp xây dựng',
    summary: 'Giải pháp AI áp dụng trong lĩnh vực xây dựng.',
    industryIds: ['ind-xay-dung'], solutionIds: ['sol-ai'], technologies: [], features: [],
    featured: true, sortOrder: 5, isSample: false, art: 'building',
  },
  // ---- Dữ liệu minh họa (không phải dự án đã thực hiện) ----
  {
    id: 's-quy', slug: 'mau-so-quy-thu-chi', title: 'Sổ quỹ thu chi nội bộ',
    summary: 'Ví dụ minh họa: nhập phiếu thu, phiếu chi và tự tính tồn quỹ.',
    industryIds: ['ind-ke-toan'], solutionIds: ['sol-du-lieu'], technologies: ['Google Sheets'], features: [],
    featured: false, sortOrder: 6, isSample: true, art: 'sheet',
  },
  {
    id: 's-noi-dung', slug: 'mau-lich-noi-dung', title: 'Lịch nội dung mạng xã hội',
    summary: 'Ví dụ minh họa: lên lịch bài đăng theo kênh và theo trạng thái duyệt.',
    industryIds: ['ind-tmdt'], solutionIds: ['sol-tu-dong'], technologies: ['Google Sheets'], features: [],
    featured: false, sortOrder: 7, isSample: true, art: 'calendar',
  },
  {
    id: 's-van-ban', slug: 'mau-theo-doi-van-ban', title: 'Sổ theo dõi văn bản đến – đi',
    summary: 'Ví dụ minh họa: vào sổ văn bản và theo dõi hạn xử lý.',
    industryIds: ['ind-van-phong'], solutionIds: ['sol-he-thong'], technologies: ['Google Sheets'], features: [],
    featured: false, sortOrder: 8, isSample: true, art: 'cards',
  },
];

const dangBoSung = 'Nội dung chương trình chi tiết đang được bổ sung.';
export const courses: Course[] = [
  { id: 'c-automation', slug: 'ai-automation', title: 'AI Automation',
    summary: 'Ứng dụng AI và tự động hóa vào quy trình công việc.',
    audience: [], syllabus: [dangBoSung], priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi lịch học',
    featured: true, sortOrder: 1, art: 'cards' },
  { id: 'c-co-ban', slug: 'ai-co-ban', title: 'AI cơ bản',
    summary: 'Làm quen và thực hành sử dụng AI trong công việc.',
    audience: [], syllabus: [dangBoSung], priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi lịch học',
    featured: true, sortOrder: 2, art: 'chat' },
  { id: 'c-ke-toan', slug: 'ai-cho-ke-toan', title: 'AI cho kế toán',
    summary: 'Ứng dụng AI vào các tác vụ kế toán.',
    audience: ['Người làm kế toán'], syllabus: [dangBoSung], priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi lịch học',
    featured: true, sortOrder: 3, art: 'sheet' },
  { id: 'c-van-phong', slug: 'ai-cho-dan-van-phong', title: 'AI cho dân văn phòng',
    summary: 'Ứng dụng AI vào các tác vụ văn phòng.',
    audience: ['Nhân sự văn phòng'], syllabus: [dangBoSung], priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi lịch học',
    featured: true, sortOrder: 4, art: 'calendar' },
];

/**
 * Cấu hình hiển thị. Zalo/QR để trống cho tới khi chủ website cung cấp:
 * PUBLIC_ZALO_URL (link https), PUBLIC_ZALO_QR (đường dẫn ảnh QR đã tải lên).
 * Thiếu cả hai -> giao diện báo "chưa cấu hình", không dẫn tới địa chỉ giả.
 */
export const settings = {
  brand: 'STECH',
  personName: 'Đỗ Trường Sơn',
  positioning: 'Tư vấn giải pháp AI & chuyển đổi số · Giảng viên AI ứng dụng',
  headline: 'Từ bài toán vận hành đến hệ thống AI ứng dụng.',
  intro: 'Bạn đang có việc lặp lại mỗi ngày, báo cáo làm tay, dữ liệu nằm rải rác? Tôi cùng bạn chọn bài toán, thử giải pháp AI phù hợp và hướng dẫn đội ngũ dùng được trong công việc thật.',
  copyApproved: false, // BA-008: bản copy profile chờ chủ website duyệt
  zaloUrl: import.meta.env.PUBLIC_ZALO_URL ?? '',
  zaloQr: import.meta.env.PUBLIC_ZALO_QR ?? '',
};
