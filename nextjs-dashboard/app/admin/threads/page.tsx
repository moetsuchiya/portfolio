// このページはクライアントでクエリパラメータを見ながら API を叩いて描画する
"use client";
// ===============================
// 管理画面ページ (一覧表示)
// ===============================
// 役割：
// ・status（PENDING / APPROVED / REJECTED）ごとに問い合わせ一覧を表示
// ・PENDING → 承認/却下ボタンを表示
// ・APPROVED → チャット画面へのリンクを表示
// ・REJECTED → 表示のみ
// ===============================

import Link from "next/link";
import ApproveRejectButtons from "./ApproveRejectButtons";
import { ThreadStatus } from "@/generated/prisma";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// --- このページで扱う Thread の型 ---
// Prisma の Thread + messages をそのまま使うイメージ
type AdminThread = {
    id: string;
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
    PENDING: "PENDING（未承認）",
    APPROVED: "APPROVED（承認済み）",
    REJECTED: "REJECTED（対応しない）",
};

// タブの表示順
const STATUS_ORDER: AdminThread["status"][] = [
    "PENDING",
    "APPROVED",
    "REJECTED",
];

// ===============================
// メインコンポーネント
// ===============================
export default function AdminThreadsPage() {
    const searchParams = useSearchParams();

    // NOTE: URL の ?status= から現在のステータスを取得
    // 例 /admin/threads?status=APPROVED
    const currentStatus: AdminThread["status"] = useMemo(() => {
        const rawStatus = (searchParams.get("status") ?? "PENDING").toUpperCase();
        return rawStatus === "APPROVED" || rawStatus === "REJECTED"
            ? (rawStatus as AdminThread["status"])
            : "PENDING";
    }, [searchParams]);

    const [threads, setThreads] = useState<AdminThread[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // -------------------------------
    // API 経由で現在のステータスの Thread 一覧を取得
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

    // ===============================
    // 画面表示
    // ===============================
    return (
        // status が変わったら必ずコンポーネントを作り直すための key
        <div key={currentStatus} className="max-w-3xl mx-auto p-6 space-y-6">
            {/* デバッグ用：現在のステータスを表示 */}
            <p className="text-xs text-gray-500">
                現在のステータス: {currentStatus}
            </p>
            {/* タイトル */}
            <h1 className="text-2xl font-semibold">お問い合わせ一覧</h1>

            {/* ===============================
                ステータス切り替えタブ
            =============================== */}
            <div className="flex gap-3 text-sm">
                {STATUS_ORDER.map((status) => {
                    const isActive = status === currentStatus;
                    return (
                        <Link
                            key={status}
                            href={`/admin/threads?status=${status}`}
                            className={
                                "px-3 py-1 rounded-full border text-xs " +
                                (isActive
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
                            }
                        >
                            {STATUS_LABEL[status]}
                        </Link>
                    );
                })}
            </div>

            {/* ===============================
                空状態の文言やエラー/ローディング
            =============================== */}
            {loading && (
                <p className="text-gray-600 text-sm">読み込み中...</p>
            )}
            {error && (
                <p className="text-red-600 text-sm">{error}</p>
            )}
            {!loading && !error && threads.length === 0 && (
                <p className="text-gray-600 text-sm">
                    現在、このステータスの問い合わせはありません。
                </p>
            )}

            {/* ===============================
                一覧（カード表示）
            =============================== */}
            {threads.map((t) => (
                <div
                    key={t.id}
                    className="border rounded p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                    {/* --- 上段：名前・メール・受付日時・ステータス --- */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-semibold text-lg">{t.name}</p>
                            <p className="text-sm text-gray-600">{t.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                受付日時: {new Date(t.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {/* ステータスバッジ */}
                        <span
                            className={
                                "text-xs px-2 py-1 rounded-full " +
                                (t.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : t.status === "APPROVED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-200 text-gray-700")
                            }
                        >
                            {t.status}
                        </span>
                    </div>

                    {/* --- 中段：メッセージの抜粋（最初の1件） --- */}
                    <p className="mt-3 text-sm text-gray-800">
                        {t.messages[0]?.body ?? "（メッセージなし）"}
                    </p>

                    {/* --- 下段：操作ボタン or チャットリンク --- */}
                    <div className="mt-3 flex gap-2 items-center">
                        {currentStatus === "PENDING" && (
                            <ApproveRejectButtons threadId={t.id} />
                        )}

                        {/* APPROVED のときだけチャットを開ける */}
                        {currentStatus === "APPROVED" && (
                            <Link
                                href={`/admin/threads/${t.id}`}
                                className="text-xs text-blue-600 underline hover:text-blue-800"
                            >
                                チャットを開く
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
