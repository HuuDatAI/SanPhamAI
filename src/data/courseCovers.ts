/**
 * Bìa thiết kế cho từng chủ đề giảng dạy (artwork quảng bá nội dung, KHÔNG phải ảnh lớp học hay screenshot phần mềm).
 * Gắn theo slug thật; master PNG nằm ngoài repo, ở đây là bản WebP 1280×720 (16:9).
 */
import type { ImageMetadata } from 'astro';
import automation from '../assets/courses/ai-automation.webp';
import agent from '../assets/courses/ai-agent.webp';
import smax from '../assets/courses/smax-ai-chatbot.webp';
import vba from '../assets/courses/vba-excel.webp';
import coBan from '../assets/courses/ai-co-ban.webp';
import claude from '../assets/courses/claude-ai-cong-viec.webp';
import vanPhong from '../assets/courses/ai-cho-dan-van-phong.webp';
import chatgpt from '../assets/courses/chatgpt-hanh-chinh-ke-hoach-tai-chinh.webp';
import keToan from '../assets/courses/ai-cho-ke-toan.webp';
import excelBi from '../assets/courses/excel-power-query-power-bi.webp';

export const courseCovers: Record<string, { src: ImageMetadata; alt: string }> = {
  'ai-automation': { src: automation, alt: 'Bìa chủ đề AI Automation: chuỗi bước quy trình được kết nối và tự động hóa' },
  'ai-agent': { src: agent, alt: 'Bìa chủ đề AI Agent: trợ lý AI kết nối với tri thức và các công cụ' },
  'smax-ai-chatbot': { src: smax, alt: 'Bìa chủ đề chatbot Smax AI: các khung hội thoại và nhánh kịch bản trả lời' },
  'vba-excel': { src: vba, alt: 'Bìa chủ đề Excel VBA: bảng tính chuyển thành các khối tự động hóa và mã' },
  'ai-co-ban': { src: coBan, alt: 'Bìa chủ đề AI cơ bản: yêu cầu đi qua AI thành kết quả rõ ràng' },
  'claude-ai-cong-viec': { src: claude, alt: 'Bìa chủ đề Claude AI: tài liệu được tổng hợp thành bản tóm tắt và biểu đồ' },
  'ai-cho-dan-van-phong': { src: vanPhong, alt: 'Bìa chủ đề AI cho dân văn phòng: tài liệu, lịch và bài trình bày' },
  'chatgpt-hanh-chinh-ke-hoach-tai-chinh': { src: chatgpt, alt: 'Bìa chủ đề ChatGPT cho hành chính và kế hoạch–tài chính: hồ sơ và bảng kế hoạch' },
  'ai-cho-ke-toan': { src: keToan, alt: 'Bìa chủ đề AI kế toán và kiểm toán: đối chiếu chứng từ và số liệu' },
  'excel-power-query-power-bi': { src: excelBi, alt: 'Bìa chủ đề Excel, Power Query và Power BI: từ bảng dữ liệu đến biểu đồ báo cáo' },
};
