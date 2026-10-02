'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const data = new FormData(event.currentTarget);
    try {
      const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), password: data.get('password') }) });
      const result = await r.json(); if (!r.ok) throw new Error(result.error);
      window.location.assign('/admin/projects');
    } catch (e) { setError(e instanceof Error ? e.message : 'ログインできませんでした。'); setBusy(false); }
  }
  return <main className="login-shell"><div className="login-card"><p className="eyebrow">Portfolio studio</p><h1>管理者ログイン</h1><p className="text-sm text-[#6b5d7a]">制作物とお問い合わせを管理します。</p>
    <form onSubmit={login} className="admin-form mt-8"><label>メールアドレス<input name="email" type="email" autoComplete="username" required maxLength={254} /></label><label>パスワード<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
      {error && <p role="alert" className="form-error">{error}</p>}<button className="primary-button" disabled={busy}>{busy ? '確認中…' : 'ログイン'}</button>
    </form><a href="/" className="mt-8 inline-block text-sm text-[#6b5d7a]">← サイトに戻る</a></div></main>;
}
