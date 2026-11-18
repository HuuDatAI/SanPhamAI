import { details } from './details';
import { courseList } from './courses';
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
/** Chỉ ảnh chụp THẬT đã che nhận diện bằng hình chữ nhật trắng (scripts/redact-screens.mjs). Không dùng ảnh do AI tạo. */
export interface ProjectImage { key: string; alt: string; caption: string; sourceType: 'screenshot_redacted' }

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
   *  sourceType = screenshot_redacted: ảnh chụp thật đã che nhận diện. */
  images?: ProjectImage[];
  /** Video quay màn hình thật đã che nhận diện, lưu trong public/ (đường dẫn tương đối, không link ngoài). */
  video?: { file: string; poster?: string; caption: string };
  /** Tiêu đề khối giải pháp (mặc định "Giải pháp"); "Hướng tiếp cận" khi chưa xác minh tính năng. */
  solutionHeading?: string;
  /** Giá trị hướng đến (định tính, không số liệu). */
  value?: string;
  /** Câu mời trao đổi riêng của dự án. */
  cta?: string;
}

export interface Course {
  id: string; slug: string; title: string; summary: string;
  audience: string[]; syllabus: string[];
  priceMode: 'contact' | 'fixed'; priceAmount?: number;
  scheduleText: string; format?: string;
  featured: boolean; sortOrder: number; art: Kind;
  group: string;            // id nhóm trong courses.ts
  intro?: string;           // giới thiệu dài
  practice?: string;        // bài thực hành
  structure?: string;       // cấu trúc tham khảo (không phải lịch)
  parentSlug?: string;      // nhánh của chủ đề khác
  origin: 'owner_provided_syllabus' | 'external_reference' | 'owner_listed'; // chỉ nội bộ, không hiển thị
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

const baseProjects: Project[] = [
  {
    id: 'p-tuyen-dung', slug: 'he-thong-ho-tro-tuyen-dung', title: 'Hệ thống hỗ trợ tuyển dụng với AI & tự động hóa',
    summary: 'Tôi phát triển hệ thống hỗ trợ quản lý tuyển dụng, phân tích hồ sơ ứng viên và điều phối lịch phỏng vấn.',
    industryIds: ['ind-nhan-su'], solutionIds: ['sol-ai', 'sol-tu-dong'], technologies: ['n8n', 'AI chấm CV theo JD', 'Google Calendar', 'Xuất Excel'], features: [],
    verification: 'owner_confirmed', problem: '', role: '',
    scope: 'Hệ thống hỗ trợ quản lý tuyển dụng, phân tích hồ sơ ứng viên và điều phối lịch phỏng vấn.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 1, isSample: false, art: 'people', motionPreset: 'narrative',
    observedScreens: [
      'Portal xử lý CV: trạng thái phiên theo thời gian thực, chọn nguồn CV (tải lên Portal hoặc lấy từ email), chạy/dừng xử lý theo lượt từng HR, danh sách CV chờ và chạy lại CV đã xử lý để đối soát trùng',
      'Kết quả chạy CV: hàng chờ HR review, lịch sử chạy, CV đã review, Top 10 theo vị trí, tổng quan theo trạng thái, vị trí và người chạy; lọc nhiều tiêu chí và xuất Excel',
      'Theo dõi chi phí AI: tổng chi phí, số token, chi phí trung bình mỗi CV, chi phí theo vị trí, theo tháng, theo ngày và theo từng CV',
      'Bàn làm việc tuyển dụng: chỉ số tuyển dụng, lịch phỏng vấn hôm nay và sắp tới, công việc tự sinh theo giai đoạn, tiến độ ứng viên theo từng giai đoạn từ lên kế hoạch phỏng vấn đến offer và tuyển',
      'Ứng viên trong quy trình và lịch phỏng vấn: vòng, hình thức trực tiếp/trực tuyến, trạng thái lịch, gửi lời mời qua Google Calendar; có thêm phần Onboarding',
      'AdminCP và HRCP: quản lý vị trí và tiêu chí JD dùng cho AI chấm CV, nhãn ứng viên, người dùng và phân quyền theo vai trò, email nhận diện HR, cấu hình AI, email, Google và tích hợp',
    ],
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
    industryIds: ['ind-tmdt', 'ind-ban-hang'], solutionIds: ['sol-ai', 'sol-tu-dong'], technologies: ['Smax.ai', 'Zalo cá nhân', 'Webhook AI', 'Chăm sóc tự động'], features: [],
    verification: 'owner_confirmed', problem: '', role: '', scope: 'AI tư vấn khách hàng qua mạng xã hội và các kênh thương mại điện tử.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 3, isSample: false, art: 'chat', motionPreset: 'narrative',
    observedScreens: [
      'Kịch bản trên kênh Zalo cá nhân gồm các trigger Default Reply, Welcome và từ khóa; mỗi trigger chuyển tới một block xử lý riêng',
      'Welcome: khi khách nhắn tin, gửi hoặc chấp nhận lời mời kết bạn, hệ thống gửi lời chào kèm tên khách và hỏi khóa học khách cần tư vấn',
      'Kết bạn chủ động: gửi lời mời kết bạn kèm tin nhắn mời khách đồng ý để được tư vấn',
      'Default Reply: tin nhắn còn lại được chuyển qua JSON API (webhook) tới hệ thống AI để xử lý câu trả lời',
      'Từ khóa: khi khách nhắn đúng mã, hệ thống hiện trạng thái đang soạn tin, lưu thuộc tính khách và gửi mã QR',
      'Thư viện block dùng chung cho nhiều kịch bản',
    ],
    caveats: ['Ảnh chụp phần cấu hình kịch bản; không hiển thị hội thoại hay thông tin khách hàng.'],
  },
  {
    id: 'p-zalo-hang-loat', slug: 'gui-tin-nhan-ket-ban-zalo-hang-loat', title: 'Tự động gửi tin nhắn & kết bạn Zalo hàng loạt',
    summary: 'Tôi xây dựng luồng tự động lấy danh sách từ Google Sheet, tìm tài khoản Zalo theo số điện thoại, gửi lời mời kết bạn và nhắn tin từ nick Zalo nhân viên, rồi ghi kết quả trở lại bảng tính.',
    industryIds: ['ind-dao-tao', 'ind-ban-hang'], solutionIds: ['sol-tu-dong'], technologies: ['Smax.ai', 'Zalo cá nhân', 'Google Sheet', 'Broadcast'], features: [],
    verification: 'owner_confirmed', problem: '', role: '',
    scope: 'Gửi tin nhắn và kết bạn Zalo hàng loạt theo danh sách trong Google Sheet; ghi nhận kết quả từng người nhận.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 4, isSample: false, art: 'flow', motionPreset: 'narrative',
    caveats: ['Tin nhắn từ Zalo cá nhân được đưa vào hàng chờ và gửi lần lượt để giữ an toàn cho tài khoản.'],
  },
  {
    id: 'p-lms', slug: 'lms-cho-doanh-nghiep', title: 'LMS cho doanh nghiệp',
    summary: 'Hệ thống phục vụ đào tạo nội bộ: quản lý học viên, quản lý nội dung và theo dõi tiến độ học.',
    industryIds: ['ind-dao-tao'], solutionIds: ['sol-he-thong'], technologies: [], features: [],
    verification: 'owner_confirmed', problem: '', role: '', scope: 'Phát triển hệ thống; quản lý học viên, quản lý nội dung và theo dõi tiến độ học.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 5, isSample: false, art: 'lms', motionPreset: 'narrative',
  },
  {
    id: 'p-xay-dung', slug: 'he-thong-quan-tri-du-an-xay-dung', title: 'Hệ thống quản trị dự án & quy trình doanh nghiệp xây dựng',
    summary: 'Tôi đang phát triển hệ thống tập trung thông tin dự án, công việc và các quy trình phối hợp trong doanh nghiệp xây dựng.',
    industryIds: ['ind-xay-dung'], solutionIds: ['sol-he-thong'], technologies: [], features: [],
    verification: 'owner_confirmed', problem: '', role: '', scope: 'Hệ thống tập trung thông tin dự án, công việc và quy trình phối hợp trong doanh nghiệp xây dựng; các phân hệ đang được hoàn thiện và kiểm thử.', solutionBlocks: [], outcomes: [],
    featured: true, sortOrder: 6, isSample: false, art: 'building', motionPreset: 'narrative',
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

export const projects: Project[] = baseProjects.map((p) => ({ ...p, ...(details[p.id] ?? {}) }));

export const courses: Course[] = courseList;

/**
 * Cấu hình hiển thị. Zalo/QR để trống cho tới khi chủ website cung cấp:
 * PUBLIC_ZALO_URL (link https), PUBLIC_ZALO_QR (đường dẫn ảnh QR đã tải lên).
 * Thiếu cả hai -> giao diện báo "chưa cấu hình", không dẫn tới địa chỉ giả.
 */
export const settings = {
  brand: 'HUUDAT AI',
  personName: 'ThS. Nguyễn Hữu Đạt',
  positioning: 'Chuyên gia đào tạo về AI & Dữ liệu · Tư vấn chiến lược dữ liệu cho doanh nghiệp',
  /** Số điện thoại / Zalo hiển thị công khai trên trang Liên hệ. */
  phone: '0913038346',
  phoneDisplay: '0913 038 346',
  headline: 'Từ bài toán vận hành đến hệ thống AI ứng dụng.',
  intro: 'Bạn đang có việc lặp lại mỗi ngày, báo cáo làm tay, dữ liệu nằm rải rác? Tôi cùng bạn chọn bài toán, thử giải pháp AI phù hợp và hướng dẫn đội ngũ dùng được trong công việc thật.',
  copyApproved: true, // chủ website đã duyệt nội dung profile (yêu cầu 16/11)
  /**
   * Zalo. QR là ảnh do chủ website cung cấp (public/contact/zalo-qr.png, giữ nguyên bytes, không nén/cắt).
   * zaloUrl: CHỈ điền sau khi chủ website xác nhận mở đúng hồ sơ. Giải mã cục bộ từ QR cho ra
   * https://zaloapp.com/qr/p/3v0plyu9tg37?src=qr (chưa xác nhận bằng quét thực tế → chưa cấu hình để không dẫn nhầm).
   * Khi zaloUrl rỗng, mọi nút liên hệ là "Quét mã Zalo" và mở hộp thoại QR.
   */
  zaloUrl: import.meta.env.PUBLIC_ZALO_URL ?? 'https://zalo.me/0913038346',
  // QR sinh từ đường dẫn zalo.me ở trên (scripts không cần; ảnh nằm ở public/contact/zalo-qr.png, 840x840).
  zaloQr: import.meta.env.PUBLIC_ZALO_QR ?? (import.meta.env.BASE_URL.replace(/\/$/, '') + '/contact/zalo-qr.png'),
  zaloQrCaption: 'Quét mã để kết nối Zalo với ThS. Nguyễn Hữu Đạt',
  zaloQrAlt: 'Mã QR Zalo của ThS. Nguyễn Hữu Đạt (0913 038 346). Mở Zalo, bấm nút quét QR để kết bạn.',
  zaloQrDrive: '',
};
