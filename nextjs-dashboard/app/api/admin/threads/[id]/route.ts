// ===============================
// PATCH /api/admin/threads/[id]
// 管理画面から Thread の status を更新するときに呼ばれる
// 例: APPROVED / REJECTED に変更
// ===============================

// Next.js の API レスポンスを作るユーティリティ
import { NextResponse } from "next/server";
// PrismaClient と enum（ThreadStatus）をインポート
import { PrismaClient, ThreadStatus } from "@/generated/prisma";

// PrismaClient を初期化（DB への窓口）
const prisma = new PrismaClient();

export async function PATCH(
    req: Request,
    context: { params: { id: string } } // URLの [id] 部分がここに入る
) {
    const { params } = context;

    try {
        // リクエストボディから newStatus を取り出す
        // 期待する形: { "newStatus": "APPROVED" } または "REJECTED"
        const body = await req.json();
        const newStatus = body.newStatus as "APPROVED" | "REJECTED";

        // バリデーション: 変な値が来た場合は 400 を返す
        if (newStatus !== "APPROVED" && newStatus !== "REJECTED") {
            return new NextResponse("Invalid status", { status: 400 });
        }

        // Prisma を使って Thread を更新
        const updatedThread = await prisma.thread.update({
            where: {
                // URL の /api/admin/threads/[id] の [id] をそのまま使用
                id: params.id,
            },
            data: {
                // enum ThreadStatus 型に合わせて代入
                status: newStatus as ThreadStatus,
            },
        });

        // 更新結果を JSON で返す（フロントでは今は使っていないが、デバッグに便利）
        return NextResponse.json(updatedThread);
    } catch (error) {
        console.error("PATCH /api/admin/threads/[id] エラー:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
