// ===============================
// ContactPage
// お問い合わせ内容を入力して
// API(`/api/threads`)へ送信する画面
// ===============================

// クライアントコンポーネント(ブラウザ側で動くコンポーネント)だよ宣言
// useStateを使うために必要な宣言
"use client"

import { useState } from "react";

export default function ContactPage() {
    // ----------------------------------------------------
    // 入力値の状態（リアルタイムでformに反映される）
    // ----------------------------------------------------
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // API送信後の状態管理
    const [sent, setSent] = useState(false);      // 送信完了画面用
    const [loading, setLoading] = useState(false); //送信中ボタンの制御
    const [error, setError] = useState<string | null>(null);
    //<string | null>: TypeScriptの型注釈。状態変数が「文字列型 (string)」または「null型」

    // ===============================
    // フォーム送信時の処理
    // ユーザーが「送信」→ API へ POST
    // ===============================
    async function handleSubmit(e: React.FormEvent) { // eventの種類
        e.preventDefault();               // フォーム送信のデフォルト動作（画面リロード）を無効化
        setError(null);                   // エラー状態リセット
        setLoading(true);                 // ローディング開始（ボタンをdisableに）

        try {
            // -------------------------------------------
            // API `/api/threads` を呼び出す
            // → POST /api/threads
            // → JSONとして name, email, body を送信
            // -------------------------------------------
            const res = await fetch("/api/threads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", //NOTE: HTTPリクエストにつけるヘッダー
                },
                //フロントでの変数名はmessageにしてるけど、バックエンド側ではbodyなので名前を合わせる
                // "APIが欲しいキー名": フロントの変数
                body: JSON.stringify({ name, email, body: message }),
            });

            // API の戻り値slugを JSON として"取得"
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "送信に失敗しました");
            }

            // -------------------------------------------
            // 成功時：APIが返してきた slug を閲覧できる
            // この slug がチャットページのURLになる
            // -------------------------------------------
            console.log("slug:", data.slug);
            alert(`slug: ${data.slug}`);


            // ここで router.push(`/t/${data.slug}`) すると
            // pendingのチェックなしでチャット画面に飛んでしまうので、
            // 一旦ここでは遷移せず「送信完了画面」を見せている
            setSent(true);

        } catch (err: any) {
            setError(err.message ?? "エラーが発生しました");
        } finally {
            // 成功・失敗に関わらずローディング終了
            setLoading(false);
        }
    }

    // ===============================
    // 送信後の完了画面
    // ===============================
    if (sent) {
    return (
    <div className="max-w-xl mx-auto p-6">
    <h1 className="text-2xl font-semibold mb-4">Contact</h1>
    <p className="text-green-600">送信ありがとうございました！（今は仮処理）</p>
    </div>
);
}


// ===============================
// 初期表示：Contact フォーム
// ===============================
return (
<div className="max-w-xl mx-auto p-6">
    <h1 className="text-2xl font-semibold mb-4">Contact</h1>

    {error && <p className="text-red-600 mb-2">{error}</p>}

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <input
        type="text"
        placeholder="お名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
    />
    <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
    />
    <textarea
        placeholder="メッセージ"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 rounded h-32"
    />
    <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
    >
        {loading ? "送信中..." : "送信する（仮）"}
        </button>
    </form>
</div>
);
    }
