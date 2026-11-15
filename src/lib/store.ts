/** Service adapter: giao diện chỉ gọi các hàm này. Giai đoạn 2 sẽ thêm nguồn "google" cùng hợp đồng. */
import { industries, solutions, projects, courses, settings } from '../data/seed';
import type { Project, Course, Category } from '../data/seed';

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
