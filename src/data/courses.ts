/**
 * Chủ đề giảng dạy. origin chỉ để quản trị nội bộ (không hiển thị):
 *  - owner_provided_syllabus: đề cương do chủ website cung cấp
 *  - external_reference: dàn ý tham khảo do BA biên soạn lại, chưa phải giáo án đã duyệt
 *  - owner_listed: chủ đề chủ website xác nhận, chưa có đề cương chi tiết
 * Không đưa giá, lịch, chứng chỉ, tên tổ chức hay link nguồn lên website.
 */
import type { Course } from './seed';

const common = { priceMode: 'contact', scheduleText: 'Liên hệ để trao đổi' } as const;
const adjust = 'Nội dung điều chỉnh theo công việc và nhu cầu người học.';

export const courseGroups = [
  { id: 'tu-dong-hoa', title: 'Tự động hóa & trợ lý AI', desc: 'Từ quy trình lặp lại đến trợ lý AI có nhiệm vụ rõ ràng.' },
  { id: 'ai-cong-viec', title: 'AI cho công việc hằng ngày', desc: 'Viết yêu cầu, xử lý tài liệu và chuẩn bị báo cáo với sự hỗ trợ của AI.' },
  { id: 'du-lieu', title: 'Dữ liệu, kế toán & báo cáo', desc: 'Làm sạch dữ liệu, đối chiếu số liệu và trình bày báo cáo.' },
] as const;

export const courseList: Course[] = [
  { id: 'c-automation', slug: 'ai-automation', title: 'AI Automation', group: 'tu-dong-hoa', origin: 'owner_listed',
    summary: 'AI và tự động hóa những quy trình công việc thường lặp lại.',
    intro: 'Tôi hướng dẫn xác định công việc lặp lại, chọn bước nào nên giao cho AI hoặc tự động hóa và bước nào cần người xem xét. Phần xây dựng trợ lý có nhiệm vụ rõ ràng được tách thành chủ đề AI Agent.',
    audience: ['Người làm vận hành, báo cáo, hành chính hoặc kinh doanh có nhiều việc lặp lại'], syllabus: [],
    practice: adjust, ...common, featured: true, sortOrder: 1, art: 'flow' },
  { id: 'c-ai-agent', slug: 'ai-agent', title: 'AI Agent — Xây dựng trợ lý theo nghiệp vụ', group: 'tu-dong-hoa', origin: 'external_reference', parentSlug: 'ai-automation',
    summary: 'Thiết kế trợ lý AI có nhiệm vụ rõ ràng, dùng tri thức và công cụ trong phạm vi được phép.',
    intro: 'Tìm hiểu cách xây trợ lý AI có nhiệm vụ rõ ràng, sử dụng tri thức và công cụ trong phạm vi được phép. Đây là nhánh nâng cao của AI Automation.',
    audience: ['Người muốn thiết kế trợ lý AI cho công việc hoặc doanh nghiệp'],
    syllabus: ['Kiến trúc Agent, vai trò và mục tiêu.', 'Chuẩn bị tài liệu; nền tảng RAG và tìm kiếm ngữ nghĩa.', 'Luồng xử lý, rẽ nhánh và ghi nhớ.', 'Gọi công cụ, kết nối API và giới hạn quyền.', 'Phối hợp nhiều Agent; đánh giá và cải tiến.'],
    practice: 'Bài thực hành đề xuất: trợ lý hỏi đáp từ tài liệu mẫu, có bước kiểm tra câu trả lời và chuyển cho người phụ trách.',
    ...common, featured: false, sortOrder: 2, art: 'flow' },
  { id: 'c-smax', slug: 'smax-ai-chatbot', title: 'Xây dựng chatbot với Smax AI', group: 'tu-dong-hoa', origin: 'external_reference',
    summary: 'Thiết kế chatbot tư vấn khách hàng: từ kịch bản hỏi đáp đến cách phối hợp AI và nhân sự.',
    intro: 'Thực hành thiết kế chatbot trên nền tảng Smax AI, từ kịch bản hỏi đáp đến cách phối hợp giữa AI và nhân sự tư vấn. Khả năng của từng kênh và tính năng phụ thuộc gói và cấu hình, sẽ được kiểm tra lại khi chốt nội dung học.',
    audience: ['Nhân sự bán hàng, chăm sóc khách hàng, marketing', 'Người quản lý muốn ứng dụng chatbot vào công việc'],
    syllabus: ['Làm quen nền tảng, xác định mục tiêu chatbot và kênh triển khai phù hợp.', 'Xây kịch bản chào hỏi, câu hỏi thường gặp và các nhánh hội thoại.', 'Tổ chức thông tin sản phẩm, chính sách và nội dung trả lời.', 'Tìm hiểu cấu hình AI, hướng dẫn phản hồi và cách kiểm tra câu trả lời.', 'Chuyển tình huống cần xử lý cho người phụ trách; kết nối thông tin khách với bảng theo dõi.', 'Kiểm thử bằng tình huống mẫu, rà soát và cải thiện chatbot.'],
    practice: 'Bài thực hành đề xuất: chatbot tư vấn một nhóm sản phẩm mẫu, trả lời câu hỏi thường gặp và chuyển yêu cầu cần hỗ trợ cho nhân viên.',
    ...common, featured: false, sortOrder: 3, art: 'chat' },
  { id: 'c-vba', slug: 'vba-excel', title: 'VBA — Tự động hóa công việc với Excel', group: 'tu-dong-hoa', origin: 'external_reference',
    summary: 'Dùng VBA để xử lý thao tác lặp lại và xây dựng công cụ Excel phục vụ công việc.',
    intro: 'Học cách dùng VBA để xử lý những thao tác lặp lại và xây dựng công cụ Excel phục vụ công việc.',
    audience: ['Người làm báo cáo, kế toán, nhân sự và kinh doanh'],
    syllabus: ['Nền tảng VBA và tư duy lập trình.', 'Xử lý dữ liệu, điều kiện và vòng lặp.', 'Tổng hợp nhiều tệp, định dạng và xuất báo cáo.', 'Thống kê, PivotTable và hàm tự xây dựng.', 'UserForm hỗ trợ nhập liệu.', 'Kết nối Office, làm quen SQL Server; dùng AI hỗ trợ đọc và rà soát mã.'],
    practice: 'Bài thực hành đề xuất: công cụ tổng hợp và xuất báo cáo từ các tệp Excel mẫu.',
    ...common, featured: false, sortOrder: 4, art: 'sheet' },

  { id: 'c-co-ban', slug: 'ai-co-ban', title: 'AI cơ bản', group: 'ai-cong-viec', origin: 'owner_listed',
    summary: 'Làm quen và thực hành cách viết prompt, mô tả yêu cầu hiệu quả.',
    intro: 'Làm quen với AI, cách mô tả yêu cầu rõ ràng và nhận biết giới hạn của kết quả trước khi dùng vào công việc.',
    audience: ['Người mới bắt đầu dùng AI trong công việc'], syllabus: [],
    practice: adjust, ...common, featured: true, sortOrder: 5, art: 'prompt' },
  { id: 'c-claude', slug: 'claude-ai-cong-viec', title: 'Claude AI — Ứng dụng vào công việc', group: 'ai-cong-viec', origin: 'external_reference',
    summary: 'Giao việc cho Claude với bối cảnh rõ ràng, từ tài liệu đến dữ liệu và quy trình.',
    intro: 'Thực hành giao việc cho Claude với bối cảnh rõ ràng, từ tài liệu đến dữ liệu và quy trình. Tính năng cụ thể phụ thuộc tài khoản và gói, sẽ được kiểm tra khi chốt nội dung học.',
    audience: ['Nhân sự văn phòng, người quản lý và người làm báo cáo'],
    syllabus: ['Viết yêu cầu và nhận diện giới hạn AI.', 'Tổ chức Projects, trình bày đầu ra với Artifacts.', 'Tóm tắt và đối chiếu tài liệu.', 'Khám phá dữ liệu bảng tính, kiểm tra kết quả.', 'Chuẩn hóa tác vụ với Skills và kết nối công cụ phù hợp.', 'Thiết kế trợ lý theo nghiệp vụ; bảo vệ thông tin nhạy cảm.'],
    practice: 'Bài thực hành đề xuất: bộ hướng dẫn tái sử dụng để tổng hợp tài liệu và lập báo cáo công việc.',
    ...common, featured: false, sortOrder: 6, art: 'prompt' },
  { id: 'c-van-phong', slug: 'ai-cho-dan-van-phong', title: 'AI cho dân văn phòng', group: 'ai-cong-viec', origin: 'owner_listed',
    summary: 'Ứng dụng AI vào công việc văn phòng hằng ngày: ghi chú, tài liệu, báo cáo, trình bày.',
    intro: 'Ứng dụng AI vào công việc văn phòng hằng ngày: ghi chú, soạn tài liệu, báo cáo và trình bày. Có các nhánh theo nhóm công việc, ví dụ ChatGPT cho hành chính và kế hoạch–tài chính.',
    audience: ['Nhân sự văn phòng'], syllabus: [],
    practice: adjust, ...common, featured: true, sortOrder: 7, art: 'notes' },
  { id: 'c-chatgpt-hc', slug: 'chatgpt-hanh-chinh-ke-hoach-tai-chinh', title: 'ChatGPT cho hành chính & kế hoạch–tài chính', group: 'ai-cong-viec', origin: 'owner_provided_syllabus', parentSlug: 'ai-cho-dan-van-phong',
    summary: 'Soạn thảo, đọc tài liệu và hỗ trợ xử lý dữ liệu công việc, chú trọng kiểm chứng thông tin và an toàn dữ liệu.',
    intro: 'Tôi hướng dẫn sử dụng ChatGPT để soạn thảo, đọc tài liệu và hỗ trợ xử lý dữ liệu công việc, chú trọng cách kiểm chứng thông tin và giữ an toàn dữ liệu. Đây là nhánh của chủ đề AI cho dân văn phòng.',
    audience: ['Nhân sự hành chính, kế hoạch–tài chính', 'Người thường xuyên chuẩn bị văn bản, hồ sơ, báo cáo'],
    syllabus: ['Hiểu giới hạn AI, xây nguyên tắc bảo vệ dữ liệu và bộ yêu cầu cá nhân.', 'Soạn thảo văn bản, tờ trình và báo cáo theo mẫu.', 'Đọc, tóm tắt và so sánh tài liệu; đối chiếu với bản gốc.', 'Tra cứu có dẫn nguồn, kiểm chứng quy định và rà soát hồ sơ.', 'Phân tích dữ liệu giả lập, giải thích công thức và chênh lệch.', 'Tổ chức thư viện tài liệu, prompt và trợ lý theo nhiệm vụ; lập kế hoạch áp dụng.'],
    practice: 'Thực hành: hoàn thiện một bộ văn bản mẫu, quy trình kiểm chứng, báo cáo từ dữ liệu giả lập và thư viện prompt dùng lại.',
    structure: 'Chương trình tham khảo: 6 buổi, 3 nhóm (nền tảng và soạn thảo; đọc và tra cứu; dữ liệu và trợ lý); điều chỉnh theo nhu cầu.',
    ...common, featured: false, sortOrder: 8, art: 'notes' },

  { id: 'c-ke-toan', slug: 'ai-cho-ke-toan', title: 'AI hỗ trợ kế toán, kiểm toán & báo cáo', group: 'du-lieu', origin: 'owner_provided_syllabus',
    summary: 'Ứng dụng AI vào đọc tài liệu, đối chiếu dữ liệu và chuẩn bị báo cáo, luôn kiểm tra lại nguồn và kết quả.',
    intro: 'Tôi hướng dẫn ứng dụng AI vào đọc tài liệu, đối chiếu dữ liệu và chuẩn bị báo cáo, với thói quen kiểm tra lại nguồn và kết quả trước khi sử dụng. AI hỗ trợ công việc, không thay thế kết luận nghiệp vụ hay tư vấn pháp luật.',
    audience: ['Người làm kế toán, kiểm toán', 'Người thường xuyên xử lý số liệu và văn bản nghiệp vụ'],
    syllabus: ['Nền tảng AI và cách viết yêu cầu theo bối cảnh công việc.', 'Tóm tắt, so sánh tài liệu và tra cứu nội dung theo điều khoản.', 'Đối chiếu bảng dữ liệu, nhận diện chênh lệch và giải thích công thức.', 'Dùng AI hỗ trợ công thức Excel và VBA cơ bản.', 'Chuyển số liệu thành bản thảo báo cáo, email và giải trình.', 'Làm quen Power BI và cách AI hỗ trợ công thức DAX.', 'Nhập môn Agent và minh họa một quy trình tự động hóa.', 'Kết hợp thành quy trình cá nhân; bảo vệ dữ liệu và kiểm tra đầu ra.'],
    practice: 'Thực hành: đối chiếu dữ liệu đã ẩn danh, xây báo cáo mẫu và bộ câu lệnh phù hợp với công việc.',
    structure: 'Chương trình tham khảo: 8 buổi; điều chỉnh theo nhu cầu.',
    ...common, featured: true, sortOrder: 9, art: 'recon' },
  { id: 'c-excel-pbi', slug: 'excel-power-query-power-bi', title: 'Excel, Power Query & Power BI — Từ dữ liệu đến báo cáo', group: 'du-lieu', origin: 'owner_provided_syllabus',
    summary: 'Xây quy trình báo cáo từ dữ liệu ban đầu: chuẩn hóa trong Excel, tổng hợp bằng Power Query, trình bày bằng dashboard.',
    intro: 'Tôi hướng dẫn người học xây dựng quy trình báo cáo từ những tệp dữ liệu ban đầu: chuẩn hóa trong Excel, tổng hợp với Power Query và trình bày kết quả bằng dashboard.',
    audience: ['Người làm báo cáo, vận hành, kiểm soát chất lượng', 'Người quản lý dữ liệu công việc'],
    syllabus: ['Nền tảng Excel: thao tác chuẩn, tham chiếu và định dạng dữ liệu.', 'Hàm tra cứu, điều kiện và thống kê; kiểm tra lỗi công thức.', 'Mảng động, kiểm soát nhập liệu, định dạng cảnh báo và Excel Table.', 'Power Query: gộp nhiều file, làm sạch, biến đổi và kết nối bảng.', 'Tạo quy trình có thể cập nhật khi bổ sung dữ liệu mới.', 'PivotTable, phân tích theo nhóm và biểu đồ.', 'Dashboard Excel có bộ lọc tương tác.', 'Chuyển sang Power BI, hoàn thiện bố cục và trình bày báo cáo.'],
    practice: 'Thực hành: tạo bộ báo cáo từ dữ liệu mẫu, từ bước làm sạch đến dashboard và cập nhật kỳ mới.',
    structure: 'Chương trình tham khảo: 11 buổi, 3 nhóm (Excel nền; xử lý và phân tích; dashboard và trình bày); điều chỉnh theo nhu cầu.',
    ...common, featured: false, sortOrder: 10, art: 'sheet' },
  { id: 'c-looker', slug: 'looker-studio-dashboard', title: 'Looker Studio — Dashboard báo cáo', group: 'du-lieu', origin: 'owner_listed',
    summary: 'Xây dựng dashboard báo cáo trên Looker Studio: kết nối dữ liệu, thiết kế biểu đồ, bộ lọc và trình bày cho người quản lý.',
    intro: 'Tôi hướng dẫn xây dựng dashboard báo cáo trên Looker Studio: từ dữ liệu nguồn như Google Sheets đến các thẻ chỉ số, biểu đồ và bộ lọc để người quản lý theo dõi tình hình theo thời gian, đơn vị và nhóm. Hình bên là ví dụ giao diện một dashboard.',
    audience: ['Người làm báo cáo, vận hành, nhân sự, kinh doanh và kế toán cần trình bày số liệu cho người quản lý'], syllabus: [],
    practice: 'Nội dung điều chỉnh theo công việc và nhu cầu người học.',
    ...common, featured: false, sortOrder: 11, art: 'sheet' },
];
