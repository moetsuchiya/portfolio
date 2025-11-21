"use client"

import { useRouter } from "next/navigation";

type Props = {
    threadId: string;
};

export default function ApproveRejectButtons({ threadId }: Props) {
    const router = useRouter();
    async function handleClick(newStatus: "APPROVED" | "REJECTED") {
        console.log("ステータス変更します", threadId, newStatus);

        try {
            const res = await fetch(`/api/admin/threads/${threadId}`, {
                method: "PATCH",//メソッド。post,getの仲間。データの一部だけ変更する（部分更新）
                headers: {
                    "Content-Type": "application/json", //NOTE: HTTPリクエストにつけるヘッダー
                },
                body: JSON.stringify({ newStatus }),
                // stringigy: HTTPのボディにするため、JSON形式の文字列に変換
            });
            if (!res.ok) {
                throw new Error("ステータス更新失敗");
            }
            console.log("ステータス更新成功");

            router.refresh(); //NOTE: ボタンを押した後サーバーコンポーネント"のみ"を再レンダリングできる

        } catch (error) {
            console.log("ステータス更新error:", error);
            // TODO エラーメッセージを表示
        }
    }

    return (
        <div className="mt-3 flex gap-2">
            <button
                // 承認ボタンの見た目用クラス（Tailwind）
                className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                // クリック時に "APPROVED" を渡して handleClick を呼ぶ
                onClick={() => handleClick("APPROVED")}
            >
                承認
            </button>
            <button
                // 却下ボタンの見た目用クラス（Tailwind）
                className="px-3 py-1 text-xs rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                // クリック時に "REJECTED" を渡して handleClick を呼ぶ
                onClick={() => handleClick("REJECTED")}
            >
                却下
            </button>
        </div>
    );
}
