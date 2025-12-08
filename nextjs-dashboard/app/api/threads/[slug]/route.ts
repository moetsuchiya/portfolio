// ===============================
// API: ユーザー用 Thread 詳細取得 (GET)
// ===============================
// 役割：
// ・URL の [slug] に一致する Thread の詳細情報をデータベースから取得して返す
// ・Thread に紐づくメッセージも一緒に取得する
// ・対象の Thread が見つからない場合は 404 エラーを返す
// ===============================

import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@/generated/prisma";



const prisma = new PrismaClient();



export async function GET(

    _req: NextRequest,

    { params }: { params: Promise<{ slug: string }> }

) {

    try {

        const { slug } = await params;

        // -------------------------------------
        // 1. slug に一致する Thread を1件取得
        // -------------------------------------
        const thread = await prisma.thread.findUnique({
            where: { slug }, // ← Prisma の Thread モデルにある slug フィールドを想定
            include: {
                messages: {
                    orderBy: { createdAt: "asc" }, // メッセージは古い順に
                },
            },
        });

        // 見つからなかった場合は 404
        if (!thread) {
            return NextResponse.json(
                { error: "指定されたお問い合わせは存在しません。" },
                { status: 404 }
            );
        }

        // -------------------------------------
        // 2. threadオブジェクト全部を返している状態必要な項目だけ整形してもよい
        //    ここではシンプルにそのまま返す
        // -------------------------------------
        return NextResponse.json(thread, { status: 200 });

    } catch (error) {
        console.error("GET /api/threads/[slug] error:", error);
        return NextResponse.json(
            { error: "お問い合わせの取得中にエラーが発生しました。" },
            { status: 500 }
        );
    }
}
