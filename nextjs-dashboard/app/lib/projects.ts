import { z } from 'zod';
import { prisma } from './prisma';

const optionalUrl = z.string().trim().max(2048).refine(value => {
  if (!value) return true;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}, 'リンクは https:// または http:// で始まるURLを入力してください。');

export const projectInput = z.object({
  title: z.string().trim().min(1, 'タイトルを入力してください。').max(120),
  description: z.string().trim().max(3000).default(''),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  githubUrl: optionalUrl.default(''),
  demoUrl: optionalUrl.default(''),
  period: z.string().trim().max(80).default(''),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).default('IN_PROGRESS'),
  published: z.boolean().default(false),
  thumbnailId: z.string().cuid().nullable().default(null),
}).strict();

export const projectSelect = {
  id: true, title: true, description: true, technologies: true,
  githubUrl: true, demoUrl: true, period: true, status: true,
  published: true, sortOrder: true, legacyImage: true, thumbnailId: true,
} as const;

export type ProjectView = Awaited<ReturnType<typeof listProjects>>[number];

export function listProjects(publishedOnly = true) {
  return prisma.project.findMany({ where: publishedOnly ? { published: true } : {}, select: projectSelect, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }] });
}
