/**
 * Nội dung chi tiết từng dự án (nguồn: BA_PORTFOLIO/14, 15).
 * Chỉ mô tả phạm vi chủ dự án xác nhận và hướng tiếp cận; không số liệu, khách hàng, kết quả chưa xác minh.
 */
import type { Project } from './seed';

type Detail = Partial<Pick<Project, 'summary' | 'problem' | 'role' | 'scope' | 'solutionBlocks' | 'solutionHeading' | 'value' | 'cta'>>;

export const details: Record<string, Detail> = {
  'p-tuyen-dung': {
    summary: 'Tôi phát triển giải pháp hỗ trợ doanh nghiệp quản lý tuyển dụng, từ hồ sơ ứng viên, đánh giá CV đến điều phối lịch phỏng vấn. AI hỗ trợ phân tích; quyết định cuối cùng thuộc về người phụ trách.',
    problem: 'Hồ sơ đến từ nhiều nguồn, tiêu chí tuyển dụng khác nhau và lịch phỏng vấn thay đổi khiến người phụ trách phải theo dõi nhiều đầu việc cùng lúc. Tôi hướng đến việc kết nối các bước này trong một quy trình rõ ràng hơn.',
    role: 'Tôi phát triển giải pháp kết hợp quản trị tuyển dụng và AI hỗ trợ đánh giá hồ sơ.',
    scope: 'Quản lý ứng viên, đánh giá CV và hẹn lịch phỏng vấn.',
    solutionBlocks: [
      'Quản lý tuyển dụng: tập trung thông tin hồ sơ để người phụ trách theo dõi quá trình tuyển dụng.',
      'Đánh giá CV: hỗ trợ phân tích mức độ phù hợp với yêu cầu công việc, làm cơ sở để người phụ trách xem xét tiếp.',
      'Hẹn lịch phỏng vấn: hỗ trợ điều phối bước gặp ứng viên trong quy trình tuyển dụng.',
    ],
    value: 'Giảm việc theo dõi rời rạc, giúp người làm tuyển dụng dành nhiều thời gian hơn cho việc hiểu ứng viên và trao đổi với các bên liên quan.',
    cta: 'Bạn muốn kết nối các bước trong quy trình tuyển dụng? Trao đổi với tôi về cách doanh nghiệp đang tiếp nhận hồ sơ, đánh giá CV và tổ chức phỏng vấn.',
  },
  'p-ban-hang': {
    summary: 'Tôi phát triển giải pháp AI hỗ trợ phân tích hiệu quả hoạt động bán hàng, để dữ liệu trở thành cơ sở xem xét tình hình kinh doanh và xác định điểm cần tìm hiểu sâu hơn.',
    problem: 'Một báo cáo có nhiều con số chưa chắc đã giúp người quản lý biết nên tập trung vào đâu. Bài toán tôi hướng đến là làm rõ diễn biến bán hàng và kết nối việc đọc dữ liệu với những câu hỏi kinh doanh cụ thể.',
    role: 'Tôi phát triển hướng giải pháp AI hỗ trợ phân tích bán hàng.',
    scope: 'Phạm vi dữ liệu, chỉ tiêu và cách trình bày được xác định theo bài toán của từng doanh nghiệp.',
    solutionHeading: 'Hướng tiếp cận',
    solutionBlocks: [
      'Tổng quan: đặt các chỉ tiêu bán hàng trong cùng một góc nhìn để thuận tiện theo dõi.',
      'Diễn biến và so sánh: trình bày dữ liệu theo thời gian hoặc theo nhóm để gợi mở những điểm cần phân tích.',
      'Xem xét cùng bối cảnh: dùng kết quả phân tích để đặt câu hỏi tiếp theo, thay vì coi một chỉ số đơn lẻ là kết luận về hoạt động kinh doanh.',
    ],
    value: 'Giúp người quản lý đọc báo cáo có trọng tâm và trao đổi với đội ngũ dựa trên dữ liệu rõ ràng hơn.',
    cta: 'Bạn có dữ liệu bán hàng nhưng chưa khai thác được nhiều? Trao đổi với tôi về nguồn dữ liệu hiện có và những câu hỏi kinh doanh bạn muốn làm rõ.',
  },
  'p-tu-van': {
    summary: 'Tôi phát triển giải pháp AI hỗ trợ tư vấn khách hàng qua mạng xã hội và các kênh thương mại điện tử, ở những nơi khách hàng đang tương tác.',
    problem: 'Khách hàng hỏi thông tin ở nhiều kênh, trong khi đội ngũ tư vấn cần trả lời nhất quán và bám sát sản phẩm, chính sách của doanh nghiệp. Tôi hướng đến cách ứng dụng AI phù hợp với luồng tư vấn thực tế đó.',
    role: 'Tôi phát triển hướng giải pháp AI hỗ trợ tư vấn khách hàng đa kênh, dựa trên nhu cầu trao đổi qua mạng xã hội và thương mại điện tử.',
    scope: 'AI tư vấn khách hàng qua mạng xã hội và các kênh thương mại điện tử.',
    solutionHeading: 'Hướng tiếp cận',
    solutionBlocks: [
      'Bắt đầu từ câu hỏi thực tế: xác định những nhu cầu khách thường hỏi và phần thông tin cần chuẩn bị.',
      'Bám sát nội dung doanh nghiệp: xây dựng cách tư vấn dựa trên thông tin sản phẩm và chính sách được cung cấp.',
      'Kết hợp AI với người phụ trách: xác định những tình huống AI có thể hỗ trợ và những trường hợp cần nhân sự xử lý.',
    ],
    value: 'Hỗ trợ đội ngũ tư vấn tiếp cận câu hỏi của khách có hệ thống hơn, đồng thời giữ vai trò kiểm soát nội dung và xử lý tình huống của con người.',
    cta: 'Khách của bạn đang hỏi nhiều nhất ở kênh nào? Trao đổi với tôi về nội dung tư vấn và cách đội ngũ đang phản hồi để xác định phạm vi ứng dụng AI phù hợp.',
  },
  'p-lms': {
    summary: 'Tôi phát triển hệ thống LMS giúp doanh nghiệp tổ chức đào tạo nội bộ trên một nền tảng: tập trung khóa học, xây dựng lộ trình và theo dõi quá trình học của nhân sự.',
    problem: 'Khi nội dung đào tạo nằm ở nhiều nơi, nhân sự khó biết nên bắt đầu từ đâu, còn người phụ trách mất thời gian tổng hợp tiến độ. Hệ thống hướng đến việc kết nối nội dung, người học và báo cáo để doanh nghiệp tổ chức đào tạo có hệ thống hơn.',
    role: 'Tôi tham gia phát triển hệ thống, tập trung vào trải nghiệm học tập và các màn hình phục vụ quản trị đào tạo.',
    scope: 'Quản lý nội dung, tổ chức lộ trình và theo dõi tiến độ học.',
    solutionHeading: 'Những phần chính',
    solutionBlocks: [
      'Không gian học tập cá nhân: tổng hợp khóa đang học, khóa đã hoàn thành, thời gian học và các việc cần theo dõi; người học tiếp tục nội dung đang học và xem lịch sắp tới ngay từ màn hình tổng quan.',
      'Thư viện khóa học: trình bày khóa học theo ảnh bìa, danh mục, thời lượng và trạng thái; có tìm kiếm và bộ lọc để tiếp cận nội dung phù hợp.',
      'Tổ chức lộ trình học: nhóm các khóa học thành lộ trình có thứ tự và mục tiêu rõ hơn, kèm trạng thái xuất bản.',
      'Tổng quan quản trị đào tạo: tập trung các chỉ số như người học hoạt động, khóa học triển khai, lượt hoàn thành và giờ học, xem theo kỳ báo cáo, đơn vị và hình thức học.',
    ],
    value: 'Người học biết mình đang học gì và cần tiếp tục ở đâu. Người phụ trách có một nơi để tổ chức nội dung và theo dõi hoạt động đào tạo, thay vì ghép thông tin từ nhiều nguồn.',
    cta: 'Bạn đang muốn tổ chức đào tạo nội bộ cho doanh nghiệp? Trao đổi với tôi về nhóm nhân sự, nội dung cần đào tạo và cách doanh nghiệp đang quản lý việc học.',
  },
  'p-xay-dung': {
    summary: 'Tôi đang phát triển hệ thống tập trung thông tin dự án, công việc và các quy trình phối hợp trong doanh nghiệp xây dựng. Các phân hệ tiếp tục được hoàn thiện và kiểm thử.',
    problem: 'Một dự án xây dựng có nhiều đầu việc và nhiều bên cùng tham gia. Tôi hướng đến việc kết nối thông tin dự án với những quy trình phối hợp liên quan, để người phụ trách thuận tiện theo dõi bối cảnh và trạng thái công việc.',
    role: 'Tôi đang phát triển hệ thống, từ cách tổ chức thông tin dự án đến giao diện phục vụ công việc và các bước phối hợp giữa những bộ phận liên quan.',
    value: 'Tôi tiếp tục hoàn thiện các luồng nghiệp vụ và kiểm thử cách các phân hệ phối hợp, ưu tiên sự rõ ràng của thông tin và khả năng sử dụng trong công việc thực tế.',
    cta: 'Doanh nghiệp của bạn đang cần kết nối thông tin dự án và quy trình phối hợp? Trao đổi với tôi về cách các bộ phận đang làm việc và những điểm cần cải thiện.',
  },
};
