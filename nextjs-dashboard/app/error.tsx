'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="login-shell"><div className="login-card"><h1>ページを読み込めませんでした</h1><p className="my-6">時間をおいてもう一度お試しください。</p><button className="primary-button" onClick={reset}>再読み込み</button></div></main>;
}
