// ===============================
// 管理画面用api
// ===============================
// 1. status = "PENDING" の Thread を一覧取得する
// 2. Thread に紐づく messages も一緒に取得する
//    → 管理画面1ページで完結させるため
// 3. 管理画面 (/admin/threads) がこのAPIを叩いて表示する
// ===============================

// Next.jsの「APIレスポンスを簡単に返すためのユーティリティ」
import { NextResponse } from "next/server";

// Prisma と enum を読み込む
import { PrismaClient, ThreadStatus } from "@/generated/prisma";

// PrismaClientを初期化（DBとの接続ハブ）
const prisma = new PrismaClient();

// ===============================
// GET /api/admin/threads
// 管理者が「新しい問い合わせ一覧」を見るときに呼ばれる
// ===============================

export async function GET() {
    try {
    // -------------------------------
    // ステータスがPENDING の Thread を新着順で取得
    // messages も全部含む
    // -------------------------------
        const threads = await prisma.thread.findMany({ // findMany: 複数のデータ取得
            where: { status: ThreadStatus.PENDING },
            orderBy: { createdAt: "desc" }, //desc:降順(新規が上)
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
        // JSONとして返す
        return NextResponse.json(threads);
    } catch (error) {
        console.error("GET /api/admin/threads error:", error);

        return NextResponse.json(
            { error: "管理者用スレッド一覧の取得に失敗しました" },
            { status: 500 }
        );
    }
}