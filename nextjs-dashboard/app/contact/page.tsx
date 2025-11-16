"use client" //クライアントコンポーネントだよ宣言
import { useState } from "react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); //<string | null>: TypeScriptの型注釈。状態変数が「文字列型 (string)」または「null型」

    async function handleSubmit(e: React.FormEvent) {// event: eventの種類
        e.preventDefault(); //ブラウザのデフォルト挙動を止める
        setError(null);
        setLoading(true);

        try {
            //route.tsのexport async function POST(request: Request) を呼ぶ
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.error || "送信に失敗しました");
            }
            setSent(true);
        } catch (err: any) {
            setError(err.message ?? "エラーが発生しました");
        } finally {
            setLoading(false);
        }
    }
    if (sent) {
    return (
    <div className="max-w-xl mx-auto p-6">
    <h1 className="text-2xl font-semibold mb-4">Contact</h1>
    <p className="text-green-600">送信ありがとうございました！（今は仮処理）</p>
    </div>
);
}

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
