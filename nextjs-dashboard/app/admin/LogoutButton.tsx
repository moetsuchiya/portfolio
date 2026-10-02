'use client';
import { useState } from 'react';
export default function LogoutButton() {
  const [error, setError] = useState('');
  return <span><button type="button" onClick={async () => { try { const r = await fetch('/api/auth/logout', { method: 'POST' }); if (!r.ok) throw new Error(); window.location.assign('/login'); } catch { setError('ログアウトに失敗しました。'); } }}>ログアウト</button>{error && <span role="alert">{error}</span>}</span>;
}
