// ===============================
// 管理者用：返信フォームコンポーネント（クライアント側）
// ===============================
// 役割：
// ・管理者が Thread（/admin/threads/[id]） へ返信するためのフォーム部分
// ・入力テキストを useState で管理し、POST API に送信する
// ・送信成功後は router.refresh() を使って、サーバーコンポーネント側の
//   メッセージ一覧を自動再取得して最新状態に更新する
// ・page.tsx（サーバーコンポーネント）とは分離し、ここだけ "use client"
//   でイベント処理と状態管理を担当する
// ===============================

"use client";
// このコンポーネントはブラウザ側（クライアント）で動く必要がある。
// 理由：useState・onSubmit など「インタラクション」が含まれるから。

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminReplyForm({ threadId }: { threadId: string }) {
    // -------------------------------------
    // ▼ フォームの状態管理（クライアント側で保持）
    // -------------------------------------

    const [body, setBody] = useState("");
    // 入力されたテキストエリアの内容がここに保存される。

    const [loading, setLoading] = useState(false);
    // 「送信中…」の状態を管理するフラグ。

    const [error, setError] = useState<string | null>(null);
    // エラーメッセージ表示用（null = エラーなし）。

    const router = useRouter();
    // router.refresh() を使用して、サーバーコンポーネント部分だけ再読み込みする。


    // ===============================
    // ▼ フォーム送信ハンドラ
    //    管理者がメッセージを送ると呼ばれる
    // ===============================
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); 
        // ブラウザのデフォルト送信（ページリロード）を止める。

        setError(null); // 前回のエラーを消す

        // -------------------------------
        // ■ バリデーション：空文字は NG
        // -------------------------------
        if (!body.trim()) {
            setError("メッセージを入力してください。");
            return;
        }

        setLoading(true);

        try {
            // -------------------------------
            // ■ 管理者返信APIへリクエスト送信
            //    POST /api/admin/threads/[id]/messages
            // -------------------------------
            const res = await fetch(`/api/admin/threads/${threadId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // fetch で JSON を送るための定番ヘッダー
                },
                body: JSON.stringify({ body }),
                // 入力したメッセージ本文を API に JSON として送る
            });

            // -------------------------------
            // ■ API側エラー処理
            // -------------------------------
            if (!res.ok) {
                let message = "送信に失敗しました。";
                try {
                    const data = await res.json();
                    if (data?.error && typeof data.error === "string") {
                        message = data.error; // APIからのエラー文を採用
                    }
                } catch {
                    // JSONで返ってこなかった場合は無視
                }
                throw new Error(message);
            }

            // -------------------------------
            // ■ 成功時の処理
            // -------------------------------

            setBody(""); 
            // フォームを初期化

            // 最新メッセージ一覧を再取得
            // → サーバー側の page.tsx がもう一度実行され最新状態に
            router.refresh(); 

        } catch (err) {
            // -------------------------------
            // ■ 失敗時
            // -------------------------------
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("予期せぬエラーが発生しました。");
            }
        } finally {
            setLoading(false); // 成否に関係なく「送信中」を解除
        }
    }


    // ===============================
    // ▼ フォーム UI（ユーザーに見える部分）
    // ===============================
    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-2"
        >
            {/* メッセージ入力欄 */}
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full border rounded p-2"
                rows={3}
                placeholder="管理者として返信を書く…"
            />

            <div className="flex items-center gap-2">

                {/* 送信ボタン */}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "送信中..." : "送信"}
                </button>

                {/* エラー表示スペース */}
                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}
            </div>
        </form>
    );
}
