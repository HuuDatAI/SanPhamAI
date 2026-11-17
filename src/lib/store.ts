/** Service adapter: giao diện chỉ gọi các hàm này. Giai đoạn 2 sẽ thêm nguồn "google" cùng hợp đồng. */
import { industries, solutions, projects, courses, settings } from '../data/seed';
import type { Project, Course, Category } from '../data/seed';
import { projectImages } from '../data/media';

export type { Project, Course, Category };
export const mode: 'mau' | 'google' = 'mau';

const bySort = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

export const getSettings = () => settings;
export const getIndustries = () => industries;
export const getSolutions = () => solutions;
export const getProjects = () => [...projects].sort(bySort);
export const getFeaturedProjects = () => getProjects().filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getCourses = () => [...courses].sort(bySort);
export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);
export const nameOf = (list: Category[], id: string) => list.find((c) => c.id === id)?.name ?? '';

export const priceLabel = (c: Course) =>
  c.priceMode === 'fixed' && typeof c.priceAmount === 'number'
    ? new Intl.NumberFormat('vi-VN').format(c.priceAmount) + ' đ'
    : 'Liên hệ';

/** Chỉ chấp nhận http/https; còn lại bị loại (chặn javascript:, data:). */
export const safeUrl = (u?: string) => (u && /^https?:\/\//i.test(u.trim()) ? u.trim() : '');

/**
 * Kiểm lược đồ lúc build: dữ liệu sai thì build lỗi (không xuất bản nội dung hỏng).
 * Trường chưa biết được phép rỗng; chuỗi URL chỉ http/https; slug duy nhất; tham chiếu danh mục phải tồn tại.
 */
export function validateProjects(list: Project[]): string[] {
  const errs: string[] = [];
  const slugs = new Set<string>();
  const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const p of list) {
    const at = `[${p.id || '?'}]`;
    if (!p.id || !p.title.trim() || !p.summary.trim()) errs.push(`${at} thiếu id/title/summary`);
    if (!slugRe.test(p.slug)) errs.push(`${at} slug không hợp lệ: ${p.slug}`);
    if (slugs.has(p.slug)) errs.push(`${at} slug trùng: ${p.slug}`);
    slugs.add(p.slug);
    if (p.verification !== 'owner_confirmed' && p.verification !== 'illustrative') errs.push(`${at} verification không hợp lệ`);
    if (p.isSample !== (p.verification === 'illustrative')) errs.push(`${at} isSample không khớp verification`);
    if (!['subtle', 'narrative'].includes(p.motionPreset)) errs.push(`${at} motionPreset không hợp lệ`);
    for (const id of p.industryIds) if (!industries.some((c) => c.id === id)) errs.push(`${at} ngành không tồn tại: ${id}`);
    for (const id of p.solutionIds) if (!solutions.some((c) => c.id === id)) errs.push(`${at} loại giải pháp không tồn tại: ${id}`);
    for (const u of [p.videoUrl, p.demoUrl]) if (u && !/^https?:\/\//i.test(u)) errs.push(`${at} URL không phải http/https`);
    for (const im of p.images ?? []) {
      if (!projectImages[im.key]) errs.push(`${at} ảnh chưa đăng ký: ${im.key}`);
      if (im.sourceType !== 'screenshot_redacted') errs.push(`${at} chỉ nhận ảnh chụp thật đã che (screenshot_redacted): ${im.key}`);
      if (!im.alt.trim() || !im.caption.trim()) errs.push(`${at} ảnh thiếu alt/chú thích: ${im.key}`);
    }
    if (p.video && (!/^videos\/[a-z0-9-]+\.mp4$/.test(p.video.file) || (p.video.poster && !/^videos\/[a-z0-9-]+\.(webp|jpg|png)$/.test(p.video.poster)) || !p.video.caption.trim()))
      errs.push(`${at} video phải là tệp trong public/videos/ kèm chú thích`);
    if (p.developmentStatus && p.developmentStatus !== 'in_progress') errs.push(`${at} developmentStatus không hợp lệ`);
    const texts = [p.title, p.summary, p.problem, p.role, p.scope, ...p.solutionBlocks, ...p.features, ...p.technologies, ...p.outcomes, ...(p.observedScreens ?? []), ...(p.caveats ?? []), ...(p.images ?? []).flatMap((im) => [im.alt, im.caption]), p.video?.caption ?? ''];
    if (texts.some((t) => /<[a-z!\/]/i.test(t) || /javascript:/i.test(t))) errs.push(`${at} chứa HTML/script`);
  }
  return errs;
}
const schemaErrors = validateProjects(projects);
if (schemaErrors.length) throw new Error('Lược đồ dự án không hợp lệ:\n' + schemaErrors.join('\n'));

export const imagesOf = (p: Project) => (p.images ?? []).map((im) => ({ ...im, src: projectImages[im.key] }));
export const coverOf = (p: Project) => imagesOf(p)[0];
