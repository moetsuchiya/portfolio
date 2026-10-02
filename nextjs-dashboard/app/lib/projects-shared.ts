import type { ProjectView } from './projects';
export type { ProjectView } from './projects';
export const statusLabels: Record<string, string> = { IN_PROGRESS: '制作中', COMPLETED: '完成', ARCHIVED: '制作終了' };
export function projectImage(project: Pick<ProjectView, 'thumbnailId' | 'legacyImage'>) {
  return project.thumbnailId ? `/api/media/${project.thumbnailId}` : project.legacyImage;
}
