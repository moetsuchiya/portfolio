
// ===============================
// 管理者用：問い合わせ一覧ページ
// ===============================
// 役割：
// ・URL の /admin/threads に対応する「問い合わせ一覧画面」
// ・PENDING, APPROVED, REJECTED のステータスで問い合わせを絞り込むタブ機能
// ・各問い合わせの概要（名前、メール、最初のメッセージ）を表示
// ・PENDING状態の問い合わせには「承認」「拒否」ボタンを表示
// ・APPROVED状態の問い合わせには「チャットを開く」リンクを表示
// ===============================
"use client";

import Link from "next/link";
import ApproveRejectButtons from "./ApproveRejectButtons"; //子コンポーネントをインポート
import { ThreadStatus } from "@/generated/prisma";
import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// --- このページで扱う Thread の型 ---
// Prisma の Thread + messages をそのまま使うイメージ
type AdminThread = {
    id: string;
    slug: string;
    name: string;
    email: string;
    createdAt: string;
    status: ThreadStatus;
    messages: {
        id: string;
        body: string;
        createdAt: string;
    }[];
};

// status 表示用の日本語ラベル
const STATUS_LABEL: Record<AdminThread["status"], string> = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
};

// タブの表示順
const STATUS_ORDER: AdminThread["status"][] = [
    "PENDING",
    "APPROVED",
    "REJECTED",
];

// ===============================
// メインのコンテンツ部分
// ===============================
function ThreadsPageContent() {
    const searchParams = useSearchParams();

    // NOTE: URL の ?status= から現在のステータスを取得
    const currentStatus: AdminThread["status"] = useMemo(() => {
        const rawStatus = (searchParams.get("status") ?? "PENDING").toUpperCase();
        return rawStatus === "APPROVED" || rawStatus === "REJECTED"
            ? (rawStatus as AdminThread["status"])
            : "PENDING";
    }, [searchParams]);

    const [threads, setThreads] = useState<AdminThread[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [flashMessage, setFlashMessage] = useState<string | null>(null);

    // ステータス更新完了の一時的なメッセージ。数秒で消す
    useEffect(() => {
        if (!flashMessage) return;
        const timer = setTimeout(() => setFlashMessage(null), 3000);
        return () => clearTimeout(timer);
    }, [flashMessage]);

    // -------------------------------
    // API経由で現在のステータスのThread一覧を取得
    // -------------------------------
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/admin/threads?status=${currentStatus}`, {
                    cache: "no-store",
                });
                if (!res.ok) {
                    throw new Error("fetch failed");
                }
                const data = await res.json();
                if (!cancelled) {
                    setThreads(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError("データ取得に失敗しました");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [currentStatus]);

    // ボタンからのコールバックでローカル状態を更新
    const handleStatusChange = (
        threadId: string,
        newStatus: AdminThread["status"]
    ) => {
        setThreads((prev) =>
            prev.filter((t) => t.id !== threadId)
        );
        setFlashMessage(`ステータスを${newStatus}に更新しました。`);
    };

    // ===============================
    // 画面表示
    // ===============================
    return (
        <section className="min-h-screen px-6 py-24 pt-32">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-3">
                    <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">Admin</p>
                    <h2 className="font-serif italic text-[#0A2C6A] text-5xl">Inquiry List</h2>
                    <p className="text-[#4A5C7A] max-w-md mx-auto leading-relaxed">
                        ステータスごとにお問い合わせを確認・管理します。
                    </p>
                </div>

                {/* Status Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    {STATUS_ORDER.map((status) => {
                        const isActive = status === currentStatus;
                        return (
                            <Link
                                key={status}
                                href={`/admin/threads?status=${status}`}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    isActive
                                        ? 'bg-[#0A2C6A] text-white shadow-lg'
                                        : 'bg-white/70 text-[#4A5C7A] border border-transparent hover:bg-white hover:border-[#8799BD]/50'
                                }`}
                            >
                                {STATUS_LABEL[status]}
                            </Link>
                        );
                    })}
                </div>
                
                {/* Container for messages and list */}
                <div className="max-w-4xl mx-auto">
                    {/* Flash Message */}
                    {flashMessage && (
                        <div className="mb-6 bg-green-100/50 border border-green-200/60 text-green-800 px-4 py-3 rounded-xl text-center text-sm">
                            {flashMessage}
                        </div>
                    )}

                    {/* Loading / Error / Empty States */}
                    {loading && <p className="text-center text-[#8799BD]">読み込み中...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && threads.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-[#8799BD]">このステータスの問い合わせはありません。</p>
                        </div>
                    )}
                    
                    {/* Threads List */}
                    <div className="space-y-6">
                        {threads.map((t) => (
                            <div
                                key={t.id}
                                className="bg-white/60 backdrop-blur-sm border border-[#8799BD]/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:border-[#8799BD]/40"
                            >
                                {/* Top part: Name, email, date, status */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <p className="font-semibold text-lg text-[#0A2C6A]">{t.name}</p>
                                        <p className="text-sm text-[#4A5C7A]">{t.email}</p>
                                        <p className="text-xs text-[#8799BD] mt-1">
                                            {new Date(t.createdAt).toLocaleString('ja-JP')}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                                            t.status === "PENDING" ? "bg-yellow-400/20 text-yellow-800" :
                                            t.status === "APPROVED" ? "bg-green-400/20 text-green-800" :
                                            "bg-gray-400/20 text-gray-700"
                                        }`}
                                    >
                                        {t.status}
                                    </span>
                                </div>
                                
                                {/* Message body */}
                                <p className="text-sm text-[#0A2C6A] bg-black/5 p-4 rounded-lg mb-4">
                                    {t.messages[0]?.body ?? "（メッセージなし）"}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-4 items-center">
                                    {currentStatus === "PENDING" && (
                                        <ApproveRejectButtons
                                            threadId={t.id}
                                            onStatusChange={(newStatus) =>
                                                handleStatusChange(t.id, newStatus)
                                            }
                                        />
                                    )}
                                    {currentStatus === "APPROVED" && (
                                        <Link
                                            href={`/admin/threads/${t.id}`}
                                            className="inline-block px-5 py-2 text-sm text-white rounded-full transition-all duration-500"
                                            style={{
                                                background: 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)',
                                                boxShadow: '0 2px 12px rgba(135, 153, 189, 0.3)'
                                            }}
                                        >
                                            チャットを開く
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
        </section>
    );
}

// ===============================
// ページコンポーネント本体
// Suspense でラップして useSearchParams を安全に使う
// ===============================
export default function AdminThreadsPage() {
    return (
        <Suspense fallback={<div className="text-center p-24">読み込み中...</div>}>
            <ThreadsPageContent />
        </Suspense>
    )
}
