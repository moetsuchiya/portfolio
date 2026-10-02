'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { statusLabels, type ProjectView } from '@/app/lib/projects-shared';
import ProjectCard from '@/app/components/ProjectCard';

const empty: ProjectView = { id: '', title: '', description: '', technologies: [], githubUrl: '', demoUrl: '', period: '', status: 'IN_PROGRESS', published: false, sortOrder: 0, legacyImage: null, thumbnailId: null };

export default function ProjectEditor({ project }: { project?: ProjectView }) {
  const [draft, setDraft] = useState(project ?? empty);
  const [tech, setTech] = useState(draft.technologies.join(', '));
  const [imageChanged, setImageChanged] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function update(key: keyof ProjectView, value: string | null) { setDraft(p => ({ ...p, [key]: value })); setDirty(true); }
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); setError(''); setNotice('画像を登録しています…');
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('画像は5MB以下にしてください。');
      const r = await fetch('/api/admin/media', { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      const result = await r.json(); if (!r.ok) throw new Error(result.error);
      setDraft(p => ({ ...p, thumbnailId: result.id, legacyImage: null })); setImageChanged(true); setDirty(true); setNotice('画像を登録しました。保存すると制作物に反映されます。');
    } catch (e) { setError(e instanceof Error ? e.message : '画像を登録できませんでした。'); setNotice(''); } finally { setBusy(false); }
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const published = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'publish';
    const { title, description, githubUrl, demoUrl, period, status } = draft;
    try {
      const r = await fetch(project ? `/api/admin/projects/${project.id}` : '/api/admin/projects', { method: project ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description, technologies: tech.split(/[,、\n]/).map(t => t.trim()).filter(Boolean), githubUrl, demoUrl, period, status, published, ...(imageChanged || !project ? { thumbnailId: draft.thumbnailId } : {}) }) });
      const result = await r.json(); if (!r.ok) throw new Error(result.error);
      setDirty(false); setNotice(published ? '公開しました。' : '下書きを保存しました。');
      window.setTimeout(() => window.location.assign('/admin/projects'), 100);
    } catch (e) { setError(e instanceof Error ? e.message : '保存できませんでした。'); setBusy(false); }
  }
  return <main className="admin-main"><Link href="/admin/projects" className="text-sm" onClick={e => { if (dirty && !confirm('保存していない変更があります。一覧に戻りますか？')) e.preventDefault(); }}>← 制作物一覧へ</Link>
    <header className="admin-heading mt-8"><div><p className="eyebrow">Edit your story</p><h1>{project ? '制作物を編集' : '新しい制作物'}</h1><p>タイトルだけでも下書きを保存できます。</p></div></header>
    <div className="editor-grid"><form className="admin-form editor-form" onSubmit={save}>
      <fieldset disabled={busy} className="contents">
        <label>タイトル <span className="required-label">必須</span><input value={draft.title} onChange={e => update('title', e.target.value)} required maxLength={120} /></label>
        <label>概要<textarea value={draft.description} onChange={e => update('description', e.target.value)} rows={5} maxLength={3000} placeholder="どんなものを、何のために作りましたか？" /></label>
        <label>サムネイル<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }} /><span className="field-help">JPEG・PNG・WebP、5MB以下。画像は自動で縮小します。</span></label>
        {(draft.thumbnailId || draft.legacyImage) && <button type="button" className="secondary-button self-start" onClick={() => { setDraft(p => ({ ...p, thumbnailId: null, legacyImage: null })); setImageChanged(true); setDirty(true); }}>画像を外す</button>}
        <label>使用技術<input value={tech} onChange={e => { setTech(e.target.value); setDirty(true); }} maxLength={800} placeholder="Next.js, TypeScript, PostgreSQL" /><span className="field-help">カンマで区切って入力してください。</span></label>
        <div className="form-two-columns"><label>GitHub URL<input type="url" value={draft.githubUrl} onChange={e => update('githubUrl', e.target.value)} placeholder="https://github.com/…" maxLength={2048} /></label><label>デモURL<input type="url" value={draft.demoUrl} onChange={e => update('demoUrl', e.target.value)} placeholder="https://…" maxLength={2048} /></label></div>
        <div className="form-two-columns"><label>制作時期<input value={draft.period} onChange={e => update('period', e.target.value)} maxLength={80} placeholder="例：2026年9月〜" /></label><label>制作状況<select value={draft.status} onChange={e => update('status', e.target.value)}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div>
        <p className="field-help">下書きは一般の方には表示されません。公開後も編集・非公開にできます。</p>
        <div className="editor-actions"><button type="submit" value="draft" className="secondary-button">下書きとして保存</button><button type="submit" value="publish" className="primary-button">{draft.published ? '公開して保存' : '公開する'}</button></div>
      </fieldset>
      <p role="status" className="form-success">{notice}</p>{error && <p role="alert" className="form-error">{error}</p>}
    </form><aside className="editor-preview"><p className="eyebrow mb-4">表示プレビュー</p><ProjectCard project={{ ...draft, title: draft.title || '制作物のタイトル', technologies: tech.split(/[,、\n]/).map(t => t.trim()).filter(Boolean) }} /></aside></div>
  </main>;
}
