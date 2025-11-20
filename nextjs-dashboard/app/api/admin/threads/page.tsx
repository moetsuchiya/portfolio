// ===============================
// 管理者用画面 (/admin/threads)サーバーサイドコンポーネントです
// ===============================
// 目的：
// ・ユーザーから来た問い合わせ（Thread）一覧を表示する
// ・今回は PENDING のものだけを対象
// ・この画面が管理作業の“入り口”になる
// ・1ページ内で全て完結させる想定（詳細ページは作らない）
// ===============================

// --- Prisma の返却データの型をざっくり定義 ---
// ※ PrismaClient を使わず fetch で JSON を取るので、
//   必要なフィールドだけ TypeScript 型を作っている。
type AdminThread = {
    id: string; // Thread のユニークID（cuid）
    name: string; // 問い合わせ者の名前
    email: string; // メールアドレス
    createdAt: string; // いつ作られたか（日時）
    messages: {
        id: string;
        body: string; // メッセージ本文
    }[];
};

// ===============================
// メインコンポーネント（サーバーコンポーネント）
// ===============================
export default async function AdminThreadsPage() {
    // ---------------------------------------------
    // NOTE API（/api/admin/threads）を叩いてデータを取得
    // ---------------------------------------------
    // ・サーバーコンポーネントから fetch する場合、
    //   完全な URL が必要（localhost を入れる）
    // ・cache: "no-store" → 毎回最新のデータを取りたい
    //   管理画面なのでキャッシュすると困る
    // ---------------------------------------------
    const res = await fetch("http://localhost:3000/api/admin/threads", {
        cache: "no-store",
    });

    // API が成功しなかった場合の早期 return
    if (!res.ok) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">
                    お問い合わせ（PENDING）
                </h1>
                <p className="text-red-600">
                    データの取得に失敗しました。（APIがエラーを返しました）
                </p>
            </div>
        );
    }

    // JSON → JS配列へ変換
    // threads: AdminThread[] という型で扱える
    const threads: AdminThread[] = await res.json();

    // ===============================
    // 画面の描画
    // ===============================
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            {/* ページタイトル */}
            <h1 className="text-2xl font-semibold mb-4">
                お問い合わせ（PENDING）
            </h1>

            {/* 問い合わせが0件のとき */}
            {threads.length === 0 && (
                <p className="text-gray-600 text-sm">
                    現在、新しい問い合わせはありません。
                </p>
            )}

            {/* -------------------------------
                問い合わせカードの一覧描画
                threads.map(...) で1件ずつカードを作る
              ------------------------------- */}
            {threads.map((t) => (
                <div
                    key={t.id}
                    className="border rounded p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                    {/* ------------------------------
                        上段：名前・メール・受付日時・ステータス
                       ------------------------------ */}
                    <div className="flex items-start justify-between gap-4">
                        {/* 左側：問い合わせ者情報 */}
                        <div>
                            <p className="font-semibold text-lg">{t.name}</p>
                            <p className="text-sm text-gray-600">{t.email}</p>

                            {/* createdAt は ISO文字列なので、ここでローカル形式に変換 */}
                            <p className="text-xs text-gray-500 mt-1">
                                受付日時: {new Date(t.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {/* 右側：ステータスバッジ（今は全部PENDING） */}
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            PENDING
                        </span>
                    </div>

                    {/* ------------------------------
                        下段：メッセージの抜粋（最初の1件だけ表示）
                       ------------------------------ */}
                    <p className="mt-3 text-sm text-gray-800">
                        {t.messages[0]?.body ?? "（メッセージなし）"}
                    </p>

                    {/* あとで追加するスペース（承認/却下ボタンなど） */}
                    {/* <div className="mt-3 flex gap-2">
                        <button>承認</button>
                        <button>拒否</button>
                        </div>
                      */}
                </div>
            ))}
        </div>
    );
}
