// ===============================
// ユーザー用：チャット返信フォーム（クライアント側）
// ===============================
// 役割：
// ・ユーザーが Thread（/t/[slug]）に対してメッセージ返信するためのフォーム。
// ・props で渡された threadSlug（Thread.slug）を使って、
//   POST /api/threads/[slug]/messages にメッセージを送信する。
// ・送信成功後は router.refresh() で /t/[slug] ページのメッセージ一覧を再取得する。
// ===============================


"use client";
// このコンポーネントはブラウザ側（クライアント）で動く必要がある。
// 理由：useState・onSubmit など「インタラクション」が含まれるから。

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserReplyForm({ threadSlug }: { threadSlug: string }) {
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
    //    "ユーザー"がメッセージを送ると呼ばれる
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
            // ■ ユーザー用返信APIへリクエスト送信
            //    POST /api/threads/[slug]/messages
            // -------------------------------
            const res = await fetch(`/api/threads/${threadSlug}/messages`, {
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
                    // JSONでない場合は無視
                }
                throw new Error(message);
            }

            // -------------------------------
            // ■ 成功時の処理
            // -------------------------------

            // 成功したら入力欄をリセット
            setBody("");

            // 最新メッセージ一覧を再取得
            // 最新メッセージを再取得（/t/[slug] のサーバーコンポーネントが再実行される）
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
    // ▼ フォーム UI
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
                placeholder="ユーザーとして返信を書く…"
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
