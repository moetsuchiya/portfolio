'use client';
import Link from 'next/link';
import { useState } from 'react';
import { projectImage, type ProjectView } from '@/app/lib/projects-shared';
export default function ProjectList({ initialProjects }: { initialProjects: ProjectView[] }) {
  const [projects, setProjects] = useState(initialProjects); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function mutate(url: string, method: string, body?: unknown) {
    setBusy(true); setError(''); setMessage('');
    try {
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      const result = await r.json(); if (!r.ok) throw new Error(result.error);
      const list = await fetch('/api/admin/projects', { cache: 'no-store' }); if (!list.ok) throw new Error('再読み込みしてください。');
      setProjects(await list.json()); setMessage('保存しました。公開一覧にも反映されます。');
    } catch (e) { setError(e instanceof Error ? e.message : '保存できませんでした。'); } finally { setBusy(false); }
  }
  function move(index: number, delta: number) { const ids = projects.map(p => p.id); [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]]; void mutate('/api/admin/projects/reorder', 'POST', { ids }); }
  return <main className="admin-main"><header className="admin-heading"><div><p className="eyebrow">Your works</p><h1>制作物を管理</h1><p>追加して、整えて、公開。サイトの更新はここから。</p></div><Link href="/admin/projects/new" className="primary-button">＋ 制作物を追加</Link></header>
    <p role="status" className="form-success">{message}</p>{error && <p role="alert" className="form-error">{error}</p>}<p className="mb-4 text-sm">全 {projects.length} 件 · 公開中 {projects.filter(p => p.published).length} 件</p>
    {!projects.length && <div className="empty-state">まだ制作物がありません。「制作物を追加」から登録できます。</div>}
    <div className="admin-project-list">{projects.map((p, i) => <article className="admin-project-row" key={p.id}>
      <div className="admin-row-cover">{projectImage(p) ? <img src={projectImage(p)!} alt="" width={160} height={100} /> : <span>画像なし</span>}</div>
      <div className="admin-row-info"><span className={p.published ? 'publication published' : 'publication'}>{p.published ? '公開中' : '下書き・非公開'}</span><h2>{p.title}</h2><p>{p.technologies.join(' / ') || '使用技術は未登録'}</p></div>
      <div className="admin-row-actions"><Link href={`/admin/projects/${p.id}`} className="secondary-button">編集</Link><button disabled={busy} onClick={() => mutate(`/api/admin/projects/${p.id}`, 'PATCH', { published: !p.published })}>{p.published ? '非公開にする' : '公開する'}</button><button disabled={busy || i === 0} onClick={() => move(i, -1)} aria-label={`${p.title}を上へ`}>↑</button><button disabled={busy || i === projects.length - 1} onClick={() => move(i, 1)} aria-label={`${p.title}を下へ`}>↓</button><button className="delete-button" disabled={busy} onClick={() => { if (confirm(`「${p.title}」を削除しますか？この操作は元に戻せません。`)) void mutate(`/api/admin/projects/${p.id}`, 'DELETE'); }}>削除</button></div>
    </article>)}</div></main>;
}
