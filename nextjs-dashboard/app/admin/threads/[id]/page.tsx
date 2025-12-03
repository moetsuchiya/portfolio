// ===============================
// 管理者用：1件の Thread 詳細＋メッセージ一覧を表示するページ
// ===============================
// 役割：
// ・URL の /admin/threads/[id] に対応する「詳細チャット画面」
// ・params.id を使って、対象の Thread を API から取得する
// ・Thread の基本情報（名前・メール・ステータス・受付日時）と、
//  紐づくメッセージ一覧をチャット風に表示する
//  管理者のメッセージ送信フォーム付き
// ===============================

import Link from "next/link";
import { AdminReplyForm } from "./AdminReplyForm";
import { ThreadMessages } from "./ThreadMessages";
import { AdminThreadDetail } from "./types";

// ===============================
// ページコンポーネント本体
// ===============================
// ※ Next.js の app router では、ファイル名が app/admin/threads/[id]/page.tsx の場合、
//   /admin/threads/◯◯◯ にアクセスされると、◯◯◯ の部分が params.id に自動で入る。
//   例: /admin/threads/abc123 → params.id === "abc123"
export default async function AdminThreadDetailPage(
    // NOTE: 分割代入と型注釈を同時に書いている
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    // ============================
    // 1. API を叩いて Thread の詳細を取得
    // ============================
    // - /api/admin/threads/[id] の GET を呼び出す
    // - cache: "no-store" → 毎回最新の内容を取得（チャットなので必須）
    const res = await fetch(
        `http://localhost:3000/api/admin/threads/${id}`,
        {
            cache: "no-store",
        }
    );

    // ============================
    // 2. ステータスコードごとのエラーハンドリング
    // ============================

    // 404（該当 Thread なし）の場合
    if (res.status === 404) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Thread not found</h1>
                <p className="text-sm text-gray-600">
                    指定された問い合わせは存在しません。
                </p>
            </div>
        );
    }

    // その他のエラー（500 など）
    if (!res.ok) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Error</h1>
                <p className="text-sm text-red-600">
                    問い合わせの取得中にエラーが発生しました。
                </p>
            </div>
        );
    }

    // ============================
    // 3. JSON → JSオブジェクトに変換して型を付ける
    // ============================
    // res.json() の戻り値に AdminThreadDetail 型を付けることで、
    // thread.name / thread.messages[0].body などに型補完が効く。
    const thread: AdminThreadDetail = await res.json();

    // ============================
    // 4. 画面表示
    // ============================
    return (
        <section className="min-h-screen px-6 py-24 pt-32">
            <div className="max-w-4xl mx-auto">
                 {/* Header */}
                 <div className="text-center mb-16 space-y-3">
                    <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">Admin Console</p>
                    <h2 className="font-serif italic text-[#0A2C6A] text-5xl">
                        Thread Detail
                    </h2>
                    <p className="text-[#4A5C7A] mt-6 max-w-md mx-auto leading-relaxed">
                        <Link
                            href="/admin/threads"
                            className="text-sm text-[#8799BD] hover:text-[#0A2C6A] transition-colors duration-300"
                        >
                            ← 一覧に戻る
                        </Link>
                    </p>
                </div>

                {/* Chat Container */}
                <div
                    className="relative bg-white/50 backdrop-blur-md overflow-hidden"
                    style={{
                        boxShadow: 'inset 0 0 0 8px #0A2C6A, inset 0 0 0 12px rgba(135, 153, 189, 0.3), inset 0 0 0 13px #0A2C6A, 0 8px 32px rgba(10, 44, 106, 0.15)',
                        padding: '20px'
                    }}
                >
                    {/* Decorative frame corners */}
                    <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: '3px solid #8799BD', borderLeft: '3px solid #8799BD' }}></div>
                    <div className="absolute top-0 right-0 w-12 h-12" style={{ borderTop: '3px solid #8799BD', borderRight: '3px solid #8799BD' }}></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12" style={{ borderBottom: '3px solid #8799BD', borderLeft: '3px solid #8799BD' }}></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: '3px solid #8799BD', borderRight: '3px solid #8799BD' }}></div>

                    {/* Inner frame content */}
                    <div className="relative bg-white/30 backdrop-blur-sm" style={{ boxShadow: '0 0 0 1px rgba(135, 153, 189, 0.2)' }}>
                        {/* Chat Header */}
                        <div
                            className="relative px-12 py-6"
                            style={{ borderBottom: '0.5px solid rgba(135, 153, 189, 0.2)' }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h3 className="font-serif italic text-[#0A2C6A] text-2xl">
                                        Conversation with {thread.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-[#8799BD] flex-wrap">
                                        <span className="tracking-wide">{thread.email}</span>
                                        <span className="text-[#8b7d9e]">·</span>
                                        <span className="tracking-wider">Thread ID: {thread.slug}</span>
                                        {thread.status && (
                                            <>
                                                <span className="text-[#8b7d9e]">·</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                                    {thread.status}
                                                </span>
                                            </>
                                        )}
                                         {thread.createdAt && (
                                            <>
                                                <span className="text-[#8b7d9e]">·</span>
                                                <span>
                                                    受付: {new Date(thread.createdAt).toLocaleString('ja-JP')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-[#8b7d9e] opacity-40 text-2xl">✦</div>
                            </div>
                        </div>

                        {/* Subtle watercolor texture overlay */}
                        <div
                            className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(135, 153, 189, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 70%, rgba(139, 125, 158, 0.08) 0%, transparent 50%)`
                            }}
                        ></div>

                        {/* Messages Container */}
                        <ThreadMessages thread={thread} />

                        {/* 管理者返信フォーム（クライアントコンポーネント） */}
                        <div
                            className="relative px-12 py-8 bg-white/20 backdrop-blur-sm"
                            style={{ borderTop: '0.5px solid rgba(135, 153, 189, 0.25)' }}
                        >
                            <AdminReplyForm threadId={thread.id} />
                        </div>
                    </div>
                </div>
                 {/* Contact Info */}
                 <div className="mt-12 text-center space-y-4">
                    <p className="text-[#8799BD] text-sm tracking-wide">Portfolio Admin</p>
                </div>
            </div>
        </section>
    );
}
