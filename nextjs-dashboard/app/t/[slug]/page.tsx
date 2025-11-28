// ===============================
// ユーザー用：1件の Thread を slug で表示するページ
// ===============================
// 役割：
// ・URL の /t/[slug] に対応する「ユーザー向けチャット画面」
// ・params.slug を使って、対象の Thread を API から取得する
// ・Thread の基本情報（名前・受付日時 など）と、
//   紐づくメッセージ一覧をチャット風に表示する
// ・まずは「読むだけ」の画面として実装し、
//   後でユーザー用の送信フォームを別コンポーネントとして足していく想定
// ===============================

type UserThreadDetail = {
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
// ページコンポーネント本体（サーバーコンポーネント）
// ===============================
// app/t/[slug]/page.tsx にいるので、
// /t/abc123 にアクセスされると params.slug === "abc123" になる。
export default async function UserThreadPage(
    // 分割代入と型注釈を同時に書いている
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // ============================
    // 1. API を叩いて Thread の詳細を取得
    // ============================
    // NOTE:
    //   - API のパスはあなたの実装に合わせて変更してください。
    //   - 例: /api/threads/[slug] や /api/user/threads/[slug] など。
    const res = await fetch(
        `http://localhost:3000/api/threads/${slug}`,
        {
            cache: "no-store", // チャットなので毎回最新を取りに行く
        }
    );

    // ============================
    // 2. ステータスコードごとのエラーハンドリング
    // ============================

    // 404（該当 Thread なし）の場合
    if (res.status === 404) {
        return (
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">ページが見つかりません</h1>
                <p className="text-sm text-gray-600">
                    このURLに対応するお問い合わせは存在しないか、削除された可能性があります。
                </p>
            </div>
        );
    }

    // その他のエラー（500 など）
    if (!res.ok) {
        return (
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">エラーが発生しました</h1>
                <p className="text-sm text-red-600">
                    チャットの取得中にエラーが発生しました。時間をおいて再度アクセスしてください。
                </p>
            </div>
        );
    }

    // ============================
    // 3. JSON → JSオブジェクトに変換して型を付ける
    // ============================
    const thread: UserThreadDetail = await res.json();

    // ============================
    // 4. 画面表示
    // ============================
    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            {/* 上部ヘッダー部分 */}
            <header className="space-y-1">
                <h1 className="text-xl font-semibold">お問い合わせチャット</h1>
                <p className="text-xs text-gray-600">
                    こちらのページから、過去のお問い合わせと管理者からの返信を確認できます。
                </p>
            </header>

            {/* Thread の基本情報カード */}
            <section className="border rounded-lg bg-white shadow-sm p-4 space-y-2">
                {/* お問い合わせ者の名前 */}
                <p className="text-lg font-semibold">{thread.name} 様</p>

                {/* 受付日時（createdAt が存在する場合だけ表示） */}
                {thread.createdAt && (
                    <p className="text-xs text-gray-500">
                        お問い合わせ日時: {new Date(thread.createdAt).toLocaleString()}
                    </p>
                )}

                {/* ステータス（任意） */}
                {thread.status && (
                    <p className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 mt-1">
                        現在のステータス: {thread.status}
                    </p>
                )}
            </section>

            {/* メッセージ一覧 */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700">
                    メッセージ履歴
                </h2>

                {/* メッセージが1件もないとき */}
                {thread.messages.length === 0 && (
                    <p className="text-xs text-gray-500">
                        まだメッセージはありません。
                    </p>
                )}

                {/* メッセージがある場合はチャット風に表示 */}
                <div className="space-y-2">
                    {thread.messages.map((m) => {
                        const isUser = m.author === "USER";
                        // ユーザーのメッセージ：右寄せ
                        // 管理者のメッセージ：左寄せ

                        return (
                            <div
                                key={m.id}
                                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                                        isUser
                                            ? "bg-sky-600 text-white" // ユーザー側
                                            : "bg-gray-100 text-gray-900" // 管理者側
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

                                    {/* 送り手ラベル（任意） */}
                                    {m.author && (
                                        <p className="mt-0.5 text-[10px] opacity-70">
                                            {m.author === "USER" ? "あなた" : "管理者"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ★ ここに後で「ユーザー用送信フォーム」を足す予定
                例:
                <UserReplyForm threadId={thread.id} />
            */}
        </div>
    );
}
