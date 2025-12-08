// ===============================
// 管理者用：「承認」「拒否」ボタンコンポーネント
// ===============================
// 役割：
// ・「承認」「拒否」ボタンを表示する
// ・ボタンクリックで、対象の Thread のステータスを API 経由で更新する (PATCH /api/admin/threads/[id])
// ・処理中や完了、エラーの状態をUIに表示する
// ・親コンポーネントにステータス変更を通知するコールバック機能を持つ
// ===============================

"use client";
// このコンポーネントはブラウザ側で動かす（ボタンイベントなどを使うため）

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
    threadId: string;
    // どの Thread のステータスを変更するかを識別するID

    onStatusChange?: (newStatus: "APPROVED" | "REJECTED") => void;
    // 親コンポーネント（一覧画面）が渡してくれる「ステータス更新時のコールバック」
    // ・一覧画面側の状態も即時更新したい場合に使う
};

// AdminThreadsPage が親コンポーネント
export default function ApproveRejectButtons({ threadId, onStatusChange }: Props) {
    const router = useRouter();
    // router.refresh() を使って、サーバーコンポーネントの再読み込みを行う

    const [submitting, setSubmitting] = useState(false);
    // 「送信中…」などの UI 表示のためのフラグ

    const [resultStatus, setResultStatus] =
        useState<"APPROVED" | "REJECTED" | null>(null);
    // ステータス更新後に「承認済み」「対応しないに更新しました」を表示するための状態

    const [error, setError] = useState<string | null>(null);
    // APIエラー発生時のエラーメッセージ表示用


    // ======================================
    // ▼ ボタンがクリックされたときの処理
    //    newStatus = "APPROVED" or "REJECTED"
    // ======================================
    async function handleClick(newStatus: "APPROVED" | "REJECTED") {
        console.log("ステータス変更します", threadId, newStatus);

        try {
            setSubmitting(true);     // ボタンを無効化して連打防止
            setError(null);          // エラーを初期化

            // -------------------------------
            // ■ PATCH リクエストを送る
            //    /api/admin/threads/[id]
            // -------------------------------
            const res = await fetch(`/api/admin/threads/${threadId}`, {
                method: "PATCH",  // Thread の一部（status）だけ変更
                headers: {
                    "Content-Type": "application/json",
                    // JSON を送るために必須のヘッダー
                },
                body: JSON.stringify({ newStatus }),
                // API に送るデータを JSON 文字列に変換して送信
            });

            if (!res.ok) {
                // API が 200 系以外を返した場合はエラー扱い
                throw new Error("ステータス更新失敗");
            }

            console.log("ステータス更新成功");

            // -------------------------------
            // ■ UI 側の更新
            // -------------------------------
            setResultStatus(newStatus);
            // → 「承認済みに更新しました」などを表示するために保持

            onStatusChange?.(newStatus);
            // onStatusChange が渡されていれば呼ぶ
            // ?. は「undefined の場合は何もしない」というオプショナルチェーン

            // -------------------------------
            // ■ サーバーコンポーネントの再レンダリング
            // -------------------------------
            router.refresh();
            // → 一覧や詳細画面のデータ取得をもう一度実行して最新を反映する

        } catch (error) {
            console.log("ステータス更新error:", error);

            // ユーザー向けのエラーメッセージ
            setError("ステータスの更新に失敗しました。時間を置いて再度お試しください。");

        } finally {
            setSubmitting(false);
            // 成功・失敗に関わらずボタンを再び押せるようにする
        }
    }


    // ======================================
    // ▼ 画面（JSX）
    // ======================================
    return (
        <div className="space-y-3">
            <div className="flex gap-4">
                {/* Approve Button (Primary Style) */}
                <motion.button
                    className="px-5 py-2 text-xs font-semibold text-white rounded-full transition-all duration-500 disabled:opacity-60"
                    style={{
                        background: 'linear-gradient(135deg, #5a8b5a 0%, #3a7a3a 100%)', // Greenish gradient
                        boxShadow: '0 4px 16px rgba(90, 139, 90, 0.3)'
                    }}
                    onClick={() => handleClick("APPROVED")}
                    disabled={submitting || !!resultStatus}
                    whileHover={{
                        scale: (submitting || !!resultStatus) ? 1 : 1.05,
                        boxShadow: (submitting || !!resultStatus) ? '0 4px 16px rgba(90, 139, 90, 0.3)' : '0 6px 24px rgba(90, 139, 90, 0.4)',
                    }}
                    whileTap={{ scale: (submitting || !!resultStatus) ? 1 : 0.95 }}
                >
                    {submitting ? "更新中..." : "承認"}
                </motion.button>

                {/* Reject Button (Secondary Style) */}
                <motion.button
                    className="px-5 py-2 text-xs font-semibold text-[#4A5C7A] rounded-full transition-all duration-500 disabled:opacity-60"
                    style={{
                        border: '2px solid #aeb8d0',
                        background: 'transparent'
                    }}
                    onClick={() => handleClick("REJECTED")}
                    disabled={submitting || !!resultStatus}
                    whileHover={{
                        scale: (submitting || !!resultStatus) ? 1 : 1.05,
                        background: '#e8eaf0',
                    }}
                    whileTap={{ scale: (submitting || !!resultStatus) ? 1 : 0.95 }}
                >
                    却下
                </motion.button>
            </div>

            {/* Status/Error Messages */}
            <div className="h-4"> {/* Placeholder to prevent layout shift */}
                {resultStatus && (
                    <p className="text-xs text-green-700">
                        {resultStatus === "APPROVED"
                            ? "承認済みに更新しました。"
                            : "対応しないに更新しました。"}
                    </p>
                )}
                {error && (
                    <p className="text-xs text-red-600">{error}</p>
                )}
            </div>
        </div>
    );
}
