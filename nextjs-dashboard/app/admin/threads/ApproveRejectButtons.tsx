// ===============================
// 管理画面でのステータス更新 UI
// -------------------------------
// ・管理者が問い合わせを「承認（APPROVED）」または「却下（REJECTED）」に更新するボタン
// ・API(PATCH /api/admin/threads/[id]) を叩いて Thread.status を変更する
// ・サーバーコンポーネントとの連携のため、"use client" が必要
// ===============================

"use client";
// このコンポーネントはブラウザ側で動かす（ボタンイベントなどを使うため）

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        <div className="mt-3 space-y-1">
            <div className="flex gap-2">

                {/* 承認ボタン */}
                <button
                    className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => handleClick("APPROVED")}
                    disabled={submitting || !!resultStatus}
                    // submitting = true ならクリック不可
                    // resultStatus が設定済みならクリック不可（2回押し防止）
                >
                    {submitting ? "更新中..." : "承認"}
                </button>

                {/* 却下ボタン */}
                <button
                    className="px-3 py-1 text-xs rounded bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => handleClick("REJECTED")}
                    disabled={submitting || !!resultStatus}
                >
                    却下
                </button>
            </div>

            {/* ステータス更新後の確認メッセージ */}
            {resultStatus && (
                <p className="text-xs text-green-700">
                    {resultStatus === "APPROVED"
                        ? "承認済みに更新しました。"
                        : "対応しないに更新しました。"}
                </p>
            )}

            {/* APIエラー表示 */}
            {error && (
                <p className="text-xs text-red-600">{error}</p>
            )}
        </div>
    );
}
