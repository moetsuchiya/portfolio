// ===============================
// ユーザー用：1件の Thread を slug で表示するページ
// ===============================
// 役割：
// ・URL の /t/[slug] に対応する「ユーザー向けチャット画面」
// ・params.slug を使って、対象の Thread を API から取得する
// ・Thread の基本情報（名前・受付日時 など）と、
//   紐づくメッセージ一覧をチャット風に表示する
// ===============================
import { UserReplyForm } from "./UserReplyForm";
import { ThreadMessages } from "./ThreadMessages";
import { UserThreadDetail } from "./types";

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
    //TODO 3. API の戻り値　JSON → JSオブジェクトに変換して型を付ける
    // ============================
    const thread: UserThreadDetail = await res.json();

    // ============================
    // 4. ステータスに応じた画面表示
    // ============================
    // 承認済（APPROVED）でない場合は、ステータスに応じた案内を表示して終了
    if (thread.status !== "APPROVED") {
        if (thread.status === "PENDING") {
            return (
                <div className="max-w-xl mx-auto p-6 space-y-4">
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold">お問い合わせチャット</h1>
                    </header>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        管理者が承認するまでお待ちください
                    </div>
                </div>
            );
        }

        if (thread.status === "REJECTED") {
            return (
                <div className="max-w-xl mx-auto p-6 space-y-4">
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold">お問い合わせチャット</h1>
                    </header>
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        このお問い合わせは受付を終了しました。
                    </div>
                </div>
            );
        }

        // 想定外のステータス
        return (
            <div className="max-w-xl mx-auto p-6 space-y-4">
                <h1 className="text-xl font-semibold">無効なページ</h1>
                <p>このページは現在表示できません。</p>
            </div>
        );
    }

    const contactEmail = 'moet.therese@gmail.com';

    return (
        <section className="min-h-screen px-6 py-24 pt-32">
            <div className="max-w-4xl mx-auto">
                 {/* Header */}
                <div className="text-center mb-16 space-y-3">
                    <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">Chat</p>
                    <h2 className="font-serif italic text-[#0A2C6A] text-5xl">
                        Let's Talk
                    </h2>
                    <p className="text-[#4A5C7A] mt-6 max-w-md mx-auto leading-relaxed">
                        お問合せチャットです。土屋が管理画面からお返事いたします。
                    </p>
                </div>

                {/* Chat Container */}
                <div
                    className="relative bg-white/50 backdrop-blur-md overflow-hidden"
                    style={{
                        boxShadow: 'inset 0 0 0 8px #0A2C6A, inset 0 0 0 12px rgba(135, 153, 189, 0.3), inset 0 0 0 13px #0A2C6A, 0 8px 32px rgba(10, 44, 106, 0.15)',
                        padding: '20px'
                    }}
                >
                    {/* Decorative frame corners */}
                    <div className="absolute top-0 left-0 w-12 h-12" style={{ borderTop: '3px solid #8799BD', borderLeft: '3px solid #8799BD' }}></div>
                    <div className="absolute top-0 right-0 w-12 h-12" style={{ borderTop: '3px solid #8799BD', borderRight: '3px solid #8799BD' }}></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12" style={{ borderBottom: '3px solid #8799BD', borderLeft: '3px solid #8799BD' }}></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12" style={{ borderBottom: '3px solid #8799BD', borderRight: '3px solid #8799BD' }}></div>

                    {/* Inner frame content */}
                    <div className="relative bg-white/30 backdrop-blur-sm" style={{ boxShadow: '0 0 0 1px rgba(135, 153, 189, 0.2)' }}>
                        {/* Chat Header */}
                        <div
                            className="relative px-12 py-6"
                            style={{ borderBottom: '0.5px solid rgba(135, 153, 189, 0.2)' }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h3 className="font-serif italic text-[#0A2C6A] text-2xl">
                                        管理者とのチャット
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-[#8799BD] flex-wrap">
                                        <span className="tracking-wide">お名前: {thread.name}様</span>
                                        <span className="text-[#8b7d9e]">·</span>
                                        <span className="tracking-wider">Thread ID: {thread.slug}</span>
                                        {thread.status && (
                                            <>
                                                <span className="text-[#8b7d9e]">·</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                                    {thread.status}
                                                </span>
                                            </>
                                        )}
                                        {thread.createdAt && (
                                            <>
                                                <span className="text-[#8b7d9e]">·</span>
                                                <span>
                                                    受付: {new Date(thread.createdAt).toLocaleString('ja-JP')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-[#8b7d9e] opacity-40 text-2xl">✦</div>
                            </div>
                        </div>

                        {/* Subtle watercolor texture overlay */}
                        <div
                            className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(135, 153, 189, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 70%, rgba(139, 125, 158, 0.08) 0%, transparent 50%)`
                            }}
                        ></div>

                        {/* Messages Container */}
                        <ThreadMessages thread={thread} />
                        
                        <div
                            className="relative px-12 py-8 bg-white/20 backdrop-blur-sm"
                            style={{ borderTop: '0.5px solid rgba(135, 153, 189, 0.25)' }}
                        >
                            <UserReplyForm threadSlug={thread.slug} />
                        </div>
                    </div>
                </div>

                 {/* Contact Info */}
                <div className="mt-12 text-center space-y-4">
                    <p className="text-[#8799BD] text-sm tracking-wide">Or reach me directly</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a
                        href={`mailto:${contactEmail}`}
                        className="text-[#8799BD] hover:text-[#0A2C6A] transition-colors duration-500 tracking-wide"
                        >
                        {contactEmail}
                        </a>
                        <span className="text-[#8b7d9e]">·</span>
                        <a
                        href="https://github.com/moetsuchiya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8799BD] hover:text-[#0A2C6A] transition-colors duration-500 tracking-wide"
                        >
                        GitHub
                        </a>
                        <span className="text-[#8b7d9e]">·</span>
                        <a
                        href="https://www.linkedin.com/in/moe-tsuchiya-8a284b258/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8799BD] hover:text-[#0A2C6A] transition-colors duration-500 tracking-wide"
                        >
                        LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
