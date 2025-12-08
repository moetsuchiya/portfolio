// ===============================
// API: 管理者用 Thread 一覧取得 (GET)
// ===============================
// 役割：
// ・特定ステータスの Thread の一覧をデータベースから取得して返す
// ・URL クエリパラメータ `status` (PENDING, APPROVED, REJECTED) で絞り込む
// ・`status` がない場合は、デフォルトで PENDING を対象とする
// ・各 Thread に紐づくメッセージも一緒に取得する
// ===============================

// Next.js の「APIレスポンスを簡単に返すためのユーティリティ」
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Prisma と enum を読み込む
import { PrismaClient, ThreadStatus } from "@/generated/prisma";

// PrismaClient を初期化（DB と通信する窓口）
const prisma = new PrismaClient();

// ===============================
// GET /api/admin/threads
// 管理者が「特定ステータスの問い合わせ一覧」を見るとき呼ばれる
// ===============================
export async function GET(req: Request) {
try {
    // -------------------------------
    // URL からクエリパラメータ(status) を取得
    // 例: /api/admin/threads?status=APPROVED
    //
    // searchParams.get("status") が null のときは PENDING とみなす
    // -------------------------------
    const { searchParams } = new URL(req.url);
    const rawStatus = (searchParams.get("status") ?? "PENDING").toUpperCase();

    // -------------------------------
    // 受け取った文字列が ThreadStatus のどれかか判定するヘルパー
    // -------------------------------
    const isThreadStatus = (value: string): value is ThreadStatus => {
        return Object.values(ThreadStatus).includes(value as ThreadStatus);
    };

    // -------------------------------
    // 正常な値ならそれを使う。変な値なら PENDING にフォールバック。
    // -------------------------------
    const status: ThreadStatus = isThreadStatus(rawStatus)
        ? rawStatus
        : ThreadStatus.PENDING;

    console.log("[GET /api/admin/threads] rawStatus =", rawStatus, " -> status =", status);


//TODO null合体演算子?
    // -------------------------------
    // DB から該当ステータスの Thread 一覧を取得
    // ・新着順 (createdAt desc)
    // ・messages も all include
    // -------------------------------
    const threads = await prisma.thread.findMany({
    where: { status }, // ← ここで enum ThreadStatus をそのまま渡す
    orderBy: { createdAt: "desc" },
    include: {
        messages: {
        orderBy: { createdAt: "asc" }, // メッセージは古い順に並べたい
        },
    },
    });

    // -------------------------------
    // JSON として返す
    // -------------------------------
    return NextResponse.json(threads);
} catch (error) {
    console.error("GET /api/admin/threads error:", error);

    return NextResponse.json(
    { error: "管理者用スレッド一覧の取得に失敗しました" },
    { status: 500 }
    );
}
}
