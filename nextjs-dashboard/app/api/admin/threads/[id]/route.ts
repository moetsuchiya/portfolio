// ===============================
// 管理画面でのstatus更新用api
// ===============================
// PATCH /api/admin/threads/[id]
// 管理画面のApproveRejectButtonsからstatus を更新するときに呼ばれる
// 例: APPROVED / REJECTED に変更
// ===============================

// Next.js の API レスポンスを作るユーティリティ
import { NextResponse } from "next/server";
// PrismaClient と enum（ThreadStatus）をインポート
import { PrismaClient, ThreadStatus } from "@/generated/prisma";

// PrismaClient を初期化（DB への窓口）
const prisma = new PrismaClient();

//NOTE 分割代入と型注釈を同時に
// params: Next.js が自動で渡してくれる「URL の動的パラメータをまとめたオブジェクト」です。
export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const thread = await prisma.thread.findUnique({
        where: { id: params.id },
        include: { messages: { orderBy: { createdAt: "asc" }}},
    });
    // 見つからなければ 404
    // 見つかれば NextResponse.json(thread)
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // ← Promise にしておく。URLの [id] 部分がここに入る
) {
    // params を await してから id を取り出す
    const { id } = await params;

    try {
        // リクエストボディから newStatus を取り出す
        // 期待する形: { "newStatus": "APPROVED" } または "REJECTED"
        const body = await req.json();
        const newStatus = body?.newStatus;
        if (!newStatus) {
        return new NextResponse("newStatus is required", { status: 400 });
        }

        // バリデーション: 変な値が来た場合は 400 を返す
        if (newStatus !== "APPROVED" && newStatus !== "REJECTED") {
            return new NextResponse("Invalid status", { status: 400 });
        }

        // Prisma を使って Thread を更新
        const updatedThread = await prisma.thread.update({
            where: {
                // URL の /api/admin/threads/[id] の [id] をそのまま使用
                //id: params.id,
                id, //TODO awiat済みのidらしい???
            },
            data: {
                // enum ThreadStatus 型に合わせて代入
                status: newStatus === "APPROVED"
                ? ThreadStatus.APPROVED
                : ThreadStatus.REJECTED,
            },
        });

        // 更新結果を JSON で返す（フロントでは今は使っていないが、デバッグに便利）
        return NextResponse.json(updatedThread);
    } catch (error) {
        console.error("PATCH /api/admin/threads/[id] エラー:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
