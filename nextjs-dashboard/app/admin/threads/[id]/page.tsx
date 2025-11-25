// ===============================
// 管理者用：1件の Thread 詳細＋メッセージ一覧を表示するページ
// ===============================
// 役割：
// ・URL の /admin/threads/[id] に対応する「詳細チャット画面」
// ・params.id を使って、対象の Thread を API から取得する
// ・Thread の基本情報（名前・メール・ステータス・受付日時）と、
//   紐づくメッセージ一覧をチャット風に表示する
// ・この後に「管理者の送信フォーム（メッセージ投稿）」を足していく予定
// ===============================

// API（GET /api/admin/threads/[id]）から返ってくる Thread 詳細の型
type AdminThreadDetail = {
    id: string;
    name: string;
    email: string;
    status?: string;
    createdAt?: string;
    messages: {
        id: string;
        author?: "USER" | "OWNER"; // メッセージの送り手（ユーザー or 管理者）
        body: string;              // メッセージ本文
        createdAt?: string;
    }[];
};

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
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* 上部ヘッダー部分：戻るリンク＋タイトル */}
            <div className="flex items-center justify-between">
                {/* 一覧画面（/admin/threads）への戻りリンク */}
                <a
                    href="/admin/threads"
                    className="text-xs text-blue-600 hover:underline"
                >
                    ← 一覧に戻る
                </a>
                <h1 className="text-xl font-semibold">Thread Detail</h1>
            </div>

            {/* Thread の基本情報カード */}
            <section className="border rounded-lg bg-white shadow-sm p-4 space-y-2">
                {/* 問い合わせ者の名前・メールアドレス */}
                <p className="text-lg font-semibold">{thread.name}</p>
                <p className="text-sm text-gray-700">{thread.email}</p>

                {/* 受付日時（createdAt が存在する場合だけ表示） */}
                {thread.createdAt && (
                    <p className="text-xs text-gray-500">
                        受付日時: {new Date(thread.createdAt).toLocaleString()}
                    </p>
                )}

                {/* ステータス（APPROVED / PENDING / REJECTED） */}
                {thread.status && (
                    <p className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 mt-1">
                        Status: {thread.status}
                    </p>
                )}
            </section>

            {/* メッセージ一覧 */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700">
                    メッセージ一覧
                </h2>

                {/* メッセージが1件もないとき */}
                {thread.messages.length === 0 && (
                    <p className="text-xs text-gray-500">まだメッセージはありません。</p>
                )}

                {/* メッセージがある場合は、1件ずつチャット風に表示 */}
                <div className="space-y-2">
                    {thread.messages.map((m) => {
                        // author が "OWNER" の場合 → 管理者側の吹き出しとして右寄せ
                        // それ以外（"USER" or undefined）の場合 → ユーザー側として左寄せ
                        const isOwner = m.author === "OWNER";

                        return (
                            <div
                                key={m.id}
                                className={`flex ${
                                    isOwner ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                                        isOwner
                                            ? "bg-sky-600 text-white" // 管理者メッセージ：青背景＋白文字
                                            : "bg-gray-100 text-gray-900" // ユーザーメッセージ：グレー背景
                                    }`}
                                >
                                    {/* メッセージ本文 */}
                                    <p>{m.body}</p>

                                    {/* 送信日時（存在する場合のみ） */}
                                    {m.createdAt && (
                                        <p className="mt-1 text-[10px] opacity-70 text-right">
                                            {new Date(m.createdAt).toLocaleString()}
                                        </p>
                                    )}

                                    {/* 送り手のラベル（管理者 / ユーザー） */}
                                    {m.author && (
                                        <p className="mt-0.5 text-[10px] opacity-70">
                                            {m.author === "OWNER" ? "管理者" : "ユーザー"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* この下に、次のステップとして「管理者の送信フォーム」を付け足す */}
            {/* 例: <AdminMessageForm threadId={thread.id} /> */}
        </div>
    );
}
