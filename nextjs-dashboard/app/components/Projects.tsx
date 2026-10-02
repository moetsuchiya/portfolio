'use client';
import { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import type { ProjectView } from '@/app/lib/projects-shared';

export default function Projects({ initialProjects }: { initialProjects: ProjectView[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState('');
  useEffect(() => { setProjects(initialProjects); }, [initialProjects]);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      if (document.hidden) return;
      try { const r = await fetch('/api/projects', { cache: 'no-store', signal: controller.signal }); if (r.ok) setProjects(await r.json()); }
      catch { /* Keep the last successful list while offline. */ }
    };
    window.addEventListener('focus', refresh); document.addEventListener('visibilitychange', refresh);
    const interval = setInterval(refresh, 30_000);
    return () => { controller.abort(); clearInterval(interval); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  const visible = projects.filter(p => `${p.title} ${p.description} ${p.technologies.join(' ')}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()));
  return <div className="projects-section">
    <header className="projects-header"><div><p className="eyebrow">Selected works</p><h2>Projects</h2><p className="mt-4 text-[#4A5C7A]">学びながら、ひとつずつ形にした制作物。</p></div>
      {!!projects.length && <label className="project-search">制作物を探す<input type="search" placeholder="タイトル・使用技術で検索" value={query} onChange={e => setQuery(e.target.value)} /></label>}
    </header>
    <p className="mb-6 text-sm text-[#6b5d7a]" role="status">{visible.length} 件の制作物</p>
    {visible.length ? <div className="projects-grid">{visible.map(p => <ProjectCard project={p} key={p.id} />)}</div> : <div className="empty-state">{projects.length ? '一致する制作物がありません。検索条件を変えてお試しください。' : '制作物はただいま準備中です。'}</div>}
    <a className="projects-contact" href="/contact">ご相談・お問い合わせ ↗</a>
  </div>;
}
