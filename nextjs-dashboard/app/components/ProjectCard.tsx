'use client';
import { useState } from 'react';
import { ArrowUpRight, Code2, ImageIcon } from 'lucide-react';
import { projectImage, statusLabels, type ProjectView } from '@/app/lib/projects-shared';

export default function ProjectCard({ project }: { project: ProjectView }) {
  const src = projectImage(project);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return <article className="project-card" data-testid="project-card">
    <div className="project-cover">
      {src && src !== failedSrc ? <img src={src} alt={`${project.title}の画面`} loading="lazy" width={800} height={500} onError={() => setFailedSrc(src)} /> : <div className="project-placeholder"><ImageIcon size={32} strokeWidth={1} aria-hidden="true" /><span>画像準備中</span></div>}
      <span className="project-status">{statusLabels[project.status] ?? '制作中'}</span>
    </div>
    <div className="project-content">
      {project.period && <p className="project-period">{project.period}</p>}
      <h3>{project.title}</h3><p className="project-description">{project.description || '詳細は準備中です。'}</p>
      {!!project.technologies.length && <ul className="project-tags" aria-label="使用技術">{project.technologies.map((tech, i) => <li key={`${tech}-${i}`}>{tech}</li>)}</ul>}
      <div className="project-links">
        {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">作品を見る <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">（新しいタブ）</span></a>}
        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Code2 size={16} aria-hidden="true" /> GitHub<span className="sr-only">（新しいタブ）</span></a>}
        {!project.demoUrl && !project.githubUrl && <span className="text-sm text-[#6b5d7a]">リンク準備中</span>}
      </div>
    </div>
  </article>;
}
