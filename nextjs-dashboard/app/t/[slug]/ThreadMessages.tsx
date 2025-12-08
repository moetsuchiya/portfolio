// ===============================
// ユーザー用：メッセージ一覧コンポーネント
// ===============================
// 役割：
// ・特定の Thread に紐づくメッセージを時系列順にチャット風に表示する
// ・メッセージの投稿者がユーザーか管理者（OWNER）かで表示を左右に分ける
// ・各メッセージの投稿者名（あなた/管理者）、本文、投稿日時を表示する
// ・framer-motion を使って、メッセージがアニメーションしながら表示される
// ===============================

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { UserThreadDetail } from "./types";

type Props = {
    thread: UserThreadDetail;
};

export function ThreadMessages({ thread }: Props) {
    return (
        <div className="relative h-[560px] overflow-y-auto px-12 py-12 space-y-8">
            {/* Decorative elements */}
            <div className="absolute top-8 right-12 text-[#8799BD] opacity-25 text-xl">✦</div>
            <div className="absolute top-32 left-16 text-[#8b7d9e] opacity-20 text-sm">✧</div>
            <div className="absolute bottom-24 right-20 text-[#8799BD] opacity-25 text-lg">☽</div>

            {/* メッセージが1件もないとき */}
            {thread.messages.length === 0 && (
                <p className="text-center text-sm text-[#8799BD]">まだメッセージはありません。</p>
            )}

            <AnimatePresence>
                {thread.messages.map((m, index) => {
                    const isUser = m.author === "USER";
                    return (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.1 }}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                                <p className="text-xs text-[#8799BD] px-3 tracking-wide">
                                    {isUser ? "あなた" : "管理者"}
                                </p>

                                <motion.div
                                    className={`relative px-7 py-5 rounded-[28px] ${isUser ? 'bg-[#8b7d9e]/15' : 'bg-white/70'}`}
                                    style={{
                                        border: isUser ? '0.5px solid rgba(139, 125, 158, 0.35)' : '0.5px solid rgba(135, 153, 189, 0.3)',
                                        boxShadow: '0 2px 16px rgba(10, 44, 106, 0.04)'
                                    }}
                                >
                                    <p className="leading-relaxed text-[#0A2C6A]">{m.body}</p>
                                </motion.div>

                                {m.createdAt && (
                                    <div className="flex items-center gap-3 px-3">
                                        <p className="font-serif italic text-xs text-[#8799BD]">
                                            {new Date(m.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <span className="text-[#8b7d9e] text-xs">·</span>
                                        <p className="font-serif italic text-xs text-[#8799BD]">
                                            {new Date(m.createdAt).toLocaleTimeString('ja-JP', { hour: 'numeric', minute: '2-digit', hour12: false })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
