// ===============================
// ユーザー用：返信フォームコンポーネント
// ===============================
// 役割：
// ・ユーザーが管理者への返信メッセージを送信するためのUI
// ・入力されたメッセージを API (POST /api/threads/[slug]/messages) に送信する
// ・送信処理中のローディング状態やエラーメッセージを表示する
// ・送信後は入力フォームをクリアし、`router.refresh()` でチャット履歴を更新する
// ===============================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function UserReplyForm({ threadSlug }: { threadSlug: string }) {
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!body.trim()) {
            setError("メッセージを入力してください。");
            return;
        }
        setLoading(true);

        try {
            const res = await fetch(`/api/threads/${threadSlug}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body }),
            });

            if (!res.ok) {
                let message = "送信に失敗しました。";
                try {
                    const data = await res.json();
                    if (data?.error && typeof data.error === "string") {
                        message = data.error;
                    }
                } catch {}
                throw new Error(message);
            }

            setBody("");
            router.refresh();

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("予期せぬエラーが発生しました。");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="メッセージを入力..."
                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm rounded-[24px] focus:outline-none resize-none text-[#0A2C6A] placeholder-[#8799BD]/50 transition-all duration-500 focus:bg-white/70"
                        style={{
                            border: '0.5px solid rgba(135, 153, 189, 0.3)',
                            boxShadow: '0 2px 12px rgba(10, 44, 106, 0.03)',
                            maxHeight: '120px'
                        }}
                        rows={1}
                        disabled={loading}
                    />
                </div>
                
                <motion.button
                    type="submit"
                    disabled={!body.trim() || loading}
                    className="relative w-14 h-14 flex items-center justify-center rounded-full text-white disabled:opacity-30 transition-all duration-500"
                    style={{
                        background: 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)',
                        border: '0.5px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 4px 16px rgba(135, 153, 189, 0.3)'
                    }}
                    whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 6px 24px rgba(135, 153, 189, 0.4)',
                        transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </motion.button>
            </div>
            {error && (
                <p className="text-sm text-red-500 mt-2">
                    {error}
                </p>
            )}
        </form>
    );
}
