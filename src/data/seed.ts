/**
 * Dữ liệu seed — chế độ "mẫu". Sẽ được thay bằng backend thật qua src/lib/store.ts.
 * Quy tắc nội dung (BA-004/006/007): không tên công ty/trường, không link tổ chức, không số liệu/tính năng bịa.
 * - Trường chưa có nội dung thì để rỗng; giao diện ẩn mục đó (không điền thay).
 */

export type Kind = 'funnel' | 'people' | 'chat' | 'lms' | 'building' | 'sheet' | 'cards' | 'calendar' | 'flow' | 'prompt' | 'recon' | 'notes';

export interface Category { id: string; name: string; slug: string; }

/** owner_confirmed: phạm vi do chủ website xác nhận (chi tiết có thể còn thiếu). illustrative: dữ liệu minh họa. */
export type Verification = 'owner_confirmed' | 'illustrative';

/** Lược đồ dự án thống nhất (BA-011/tệp 08). Trường chưa biết để rỗng — giao diện hiện "đang bổ sung", không tự điền. */
export interface ProjectImage { key: string; alt: string; caption: string; sourceType: 'ai_illustration'; isIllustrative: true }

export interface Project {
  id: string; slug: string; title: string; summary: string;
  industryIds: string[]; solutionIds: string[];
  verification: Verification;
  problem: string;          // bài toán/bối cảnh do chủ dự án xác nhận
  role: string;             // vai trò chính xác của chủ website
  scope: string;            // phạm vi đã xác nhận
  solutionBlocks: string[]; // đoạn mô tả giải pháp đã biết
  features: string[];       // chỉ tính năng đã xác nhận
  technologies: string[];
  outcomes: string[];       // định tính hoặc số liệu có nguồn; để trống nếu chưa có
  videoUrl?: string; demoUrl?: string;   // chỉ http/https
  featured: boolean; sortOrder: number;
  isSample: boolean;        // true = minh họa (luôn hiện nhãn)
  art: Kind;                // hình minh họa vẽ tay, không phải ảnh hệ thống thật
  motionPreset: 'subtle' | 'narrative';
  /** Trạng thái dự án: in_progress hiện nhãn "Đang phát triển"; mặc định không hiện nhãn. */
  developmentStatus?: 'in_progress';
  /** Màn hình ĐÃ QUAN SÁT trên giao diện (chưa kiểm thử chức năng) — hiện kèm lời nói rõ mức xác minh. */
  observedScreens?: string[];
  /** Lưu ý công khai về giới hạn của nội dung/dự án. */
  caveats?: string[];
  /** Bộ ảnh (ảnh đầu tiên là ảnh bìa): chỉ tham chiếu khóa trong src/data/media.ts.
   *  sourceType = ai_illustration: ảnh do AI tạo, dữ liệu mẫu — luôn hiện nhãn ngoài ảnh; isIllustrative bắt buộc true. */
  images?: ProjectImage[];
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
    id: 'p-tuyen-dung', slug: 'he-thong-ho-tro-tuyen-dung', title: 'Hệ thống hỗ trợ tuyển dụng với AI & tự động hóa',
    summary: 'Tôi phát triển hệ thống hỗ trợ quản lý tuyển dụng, phân tích hồ sơ ứng viên và điều phối lịch phỏng vấn.',
    industryIds: ['ind-nhan-su'], solutionIds: ['sol-ai', 'sol-tu-dong'], technologies: [], features: [],
    verification: 'owner_confirmed', problem: '', role: '',
    scope: 'Hệ thống hỗ trợ quản lý tuyển dụng, phân tích hồ sơ ứng viên và điều phối lịch phỏng vấn.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 1, isSample: false, art: 'people', motionPreset: 'narrative',
    caveats: [
      'Hướng thiết kế: AI hỗ trợ tổng hợp và đối chiếu hồ sơ theo tiêu chí công việc có dẫn chứng; người làm nhân sự xem xét và quyết định. Không tự động loại hay tuyển ứng viên.',
    ],
  },
  {
    id: 'p-ban-hang', slug: 'ai-phan-tich-hieu-qua-ban-hang', title: 'AI phân tích hiệu quả bán hàng',
    summary: 'Giải pháp AI hỗ trợ phân tích hiệu quả hoạt động bán hàng.',
    industryIds: ['ind-ban-hang'], solutionIds: ['sol-ai', 'sol-du-lieu'], technologies: [], features: [],
    verification: 'owner_confirmed', problem: '', role: '', scope: 'Giải pháp AI hỗ trợ phân tích hiệu quả bán hàng.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 2, isSample: false, art: 'funnel', motionPreset: 'narrative',
  },
  {
    id: 'p-tu-van', slug: 'ai-tu-van-khach-hang-da-kenh', title: 'AI tư vấn khách hàng đa kênh',
    summary: 'AI tư vấn khách hàng qua mạng xã hội và các kênh thương mại điện tử.',
    industryIds: ['ind-tmdt', 'ind-ban-hang'], solutionIds: ['sol-ai', 'sol-tu-dong'], technologies: [], features: [],
    verification: 'owner_confirmed', problem: '', role: '', scope: 'AI tư vấn khách hàng qua mạng xã hội và các kênh thương mại điện tử.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 3, isSample: false, art: 'chat', motionPreset: 'narrative',
  },
  {
    id: 'p-lms', slug: 'lms-cho-doanh-nghiep', title: 'LMS cho doanh nghiệp',
    summary: 'Hệ thống phục vụ đào tạo nội bộ: quản lý học viên, quản lý nội dung và theo dõi tiến độ học.',
    industryIds: ['ind-dao-tao'], solutionIds: ['sol-he-thong'], technologies: [], features: [],
    verification: 'owner_confirmed', problem: '', role: '', scope: 'Phát triển hệ thống; quản lý học viên, quản lý nội dung và theo dõi tiến độ học.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 4, isSample: false, art: 'lms', motionPreset: 'narrative',
  },
  {
    id: 'p-xay-dung', slug: 'he-thong-quan-tri-du-an-xay-dung', title: 'Hệ thống quản trị dự án & quy trình doanh nghiệp xây dựng',
    summary: 'Tôi đang phát triển hệ thống tập trung thông tin dự án, công việc và các quy trình phối hợp trong doanh nghiệp xây dựng.',
    industryIds: ['ind-xay-dung'], solutionIds: ['sol-he-thong'], technologies: [], features: [],
    verification: 'owner_confirmed', problem: '', role: '', scope: 'Hệ thống tập trung thông tin dự án, công việc và quy trình phối hợp trong doanh nghiệp xây dựng; các phân hệ đang được hoàn thiện và kiểm thử.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 5, isSample: false, art: 'building', motionPreset: 'narrative',
    developmentStatus: 'in_progress',
    observedScreens: [
      'Tổng quan điều hành: chỉ số, công việc cá nhân, việc chờ duyệt, dự án gần đây, gói thầu sắp đến hạn',
      'Danh mục dự án dạng bảng: mã, giai đoạn, kết quả thầu, người thực hiện, tiến độ, hạn; có tìm kiếm, lọc và phân trang',
      'Chi tiết dự án: thông tin chung, trạng thái, mốc tiến độ, thông tin đấu thầu',
      'Phân hệ đấu thầu: bảng gói thầu và trạng thái',
      'Phân hệ hỏi giá nhà cung cấp: bảng yêu cầu báo giá và trạng thái',
    ],
  },
];

export const courses: Course[] = [
  { id: 'c-automation', slug: 'ai-automation', title: 'AI Automation',
    summary: 'AI và tự động hóa những quy trình công việc thường lặp lại.',
    audience: [], syllabus: [], priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi lịch học',
    featured: true, sortOrder: 1, art: 'flow' },
  { id: 'c-co-ban', slug: 'ai-co-ban', title: 'AI cơ bản',
    summary: 'Làm quen và thực hành cách viết prompt, mô tả yêu cầu hiệu quả.',
    audience: [], syllabus: [], priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi lịch học',
    featured: true, sortOrder: 2, art: 'prompt' },
  { id: 'c-ke-toan', slug: 'ai-cho-ke-toan', title: 'AI cho kế toán',
    summary: 'Ứng dụng AI trong các tác vụ kế toán thường gặp: chứng từ, bảng tính, đối chiếu.',
    audience: ['Người làm kế toán'], syllabus: [], priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi lịch học',
    featured: true, sortOrder: 3, art: 'recon' },
  { id: 'c-van-phong', slug: 'ai-cho-dan-van-phong', title: 'AI cho dân văn phòng',
    summary: 'Ứng dụng AI vào công việc văn phòng hằng ngày: ghi chú, tài liệu, báo cáo, trình bày.',
    audience: ['Nhân sự văn phòng'], syllabus: [], priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi lịch học',
    featured: true, sortOrder: 4, art: 'notes' },
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
  copyApproved: true, // chủ website đã duyệt nội dung profile (yêu cầu 16/11)
  /**
   * Zalo. QR là ảnh do chủ website cung cấp (public/contact/zalo-qr.png, giữ nguyên bytes, không nén/cắt).
   * zaloUrl: CHỈ điền sau khi chủ website xác nhận mở đúng hồ sơ. Giải mã cục bộ từ QR cho ra
   * https://zaloapp.com/qr/p/3v0plyu9tg37?src=qr (chưa xác nhận bằng quét thực tế → chưa cấu hình để không dẫn nhầm).
   * Khi zaloUrl rỗng, mọi nút liên hệ là "Quét mã Zalo" và mở hộp thoại QR.
   */
  zaloUrl: import.meta.env.PUBLIC_ZALO_URL ?? '',
  zaloQr: import.meta.env.PUBLIC_ZALO_QR ?? (import.meta.env.BASE_URL.replace(/\/$/, '') + '/contact/zalo-qr.png'),
  zaloQrCaption: 'Quét mã để kết nối Zalo với Đỗ Trường Sơn',
  zaloQrAlt: 'Mã QR Zalo của Đỗ Trường Sơn. Mở Zalo, bấm nút quét QR để kết bạn.',
  /** Link xem ảnh QR trên Drive (quyền "ai có link" đã kiểm qua Drive API); chỉ là phương án dự phòng, không phải link Zalo. */
  zaloQrDrive: 'https://drive.google.com/file/d/1IZeoAoyBm7L5fbgviynJ8Gw7xwcK2Zgu/view',
};
