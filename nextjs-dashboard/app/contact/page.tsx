// ===============================
// お問合せ画面ページ
// ===============================
// お問い合わせ内容を入力して
// API(`/api/threads`)へ送信する画面
// ===============================

// クライアントコンポーネント(ブラウザ側で動くコンポーネント)だよ宣言
// useState等を使うために必要な宣言
"use client"

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
    // ----------------------------------------------------
    // 入力値の状態（リアルタイムでformに反映される）
    // ----------------------------------------------------
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // APIに送信後の状態管理
    const [sent, setSent] = useState(false);      // 送信完了画面用
    const [loading, setLoading] = useState(false); //送信中ボタンの制御
    const [error, setError] = useState<string | null>(null);
    const [threadSlug, setThreadSlug] = useState<string | null>(null); // 完了画面でリンクを出す用
    //NOTE <string | null>: TypeScriptの型注釈。状態変数が「文字列型 (string)」または「null型」

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
                body: JSON.stringify({ name, email, body: message }),
                //フロントでの変数名はmessageにしてるけど、バックエンド側ではbodyなので名前を合わせる
                // "APIが欲しいキー名": フロントの変数
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
            setThreadSlug(data.slug);

            // -------------------------------------------
            // EmailJSでメールを送信する。envファイルに入れる！
            // -------------------------------------------
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
            
            if (!serviceId || !templateId || !publicKey) {
                console.error("EmailJS environment variables are not set correctly.");
                throw new Error("メール送信設定が不完全なようです...管理者にお問い合わせください。");
            }
            
            const chatUrl = `${window.location.origin}/t/${data.slug}`;

            const templateParams = {
                customer_name: name,
                to_email: email,
                chat_url: chatUrl, // この変数をemailJSで使う
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            
            console.log("Email sent successfully!");
            // ここでは遷移せず「送信完了画面」を見せる
            setSent(true);

        } catch (err: any) {
            console.error("Email sending failed:", err);
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
            <section className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-xl mx-auto text-center">
                    <h1 className="text-4xl font-serif italic text-[#0A2C6A] mb-4">Thank You!</h1>
                    <p className="text-[#4A5C7A] mb-8">お問い合わせありがとうございます。内容を確認いたしました。ご入力いただいたメールアドレス宛に、お問い合わせチャットのリンクをお送りしましたのでご確認ください。</p>
                    {threadSlug && (
                        <Link
                            href={`/t/${threadSlug}`}
                            className="inline-block text-white px-6 py-3 rounded-full"
                            style={{
                                background: 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)',
                                boxShadow: '0 4px 16px rgba(135, 153, 189, 0.3)'
                            }}
                        >
                            チャット画面へ移動
                        </Link>
                    )}
                </div>
            </section>
        );
    }


    // ===============================
    // 初期表示：Contact フォーム
    // ===============================
    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-24 relative">
            <div className="max-w-2xl w-full text-center relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-3">
                    <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">Get In Touch</p>
                    <h2 className="font-serif italic text-[#0A2C6A] text-5xl">Contact Me</h2>
                    <p className="text-[#4A5C7A] max-w-md mx-auto leading-relaxed">
                        プロジェクトのご相談やご質問など、お気軽にお問い合わせください。
                    </p>
                </div>
                
                <div className="max-w-xl mx-auto">
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <input
                            type="text"
                            placeholder="お名前"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 bg-white/50 border border-[#8799BD]/30 rounded-xl text-[#0A2C6A] placeholder:text-[#8799BD]/80 focus:outline-none focus:ring-2 focus:ring-[#8799BD] transition-all"
                            required
                        />
                        <input
                            type="email"
                            placeholder="メールアドレス"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-white/50 border border-[#8799BD]/30 rounded-xl text-[#0A2C6A] placeholder:text-[#8799BD]/80 focus:outline-none focus:ring-2 focus:ring-[#8799BD] transition-all"
                            required
                        />
                        <textarea
                            placeholder="メッセージ"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-4 bg-white/50 border border-[#8799BD]/30 rounded-xl text-[#0A2C6A] placeholder:text-[#8799BD]/80 focus:outline-none focus:ring-2 focus:ring-[#8799BD] transition-all h-40"
                            required
                        />
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 text-white font-bold rounded-full transition-all duration-500 disabled:opacity-60"
                            style={{
                                background: 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)',
                                boxShadow: '0 4px 16px rgba(135, 153, 189, 0.3)'
                            }}
                            whileHover={{ 
                                scale: loading ? 1 : 1.05,
                                boxShadow: loading ? '0 4px 16px rgba(135, 153, 189, 0.3)' : '0 6px 24px rgba(135, 153, 189, 0.4)',
                                transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                        >
                            {loading ? "送信中..." : "メッセージを送信"}
                        </motion.button>
                    </form>
                </div>
            </div>
        </section>
    );
}
