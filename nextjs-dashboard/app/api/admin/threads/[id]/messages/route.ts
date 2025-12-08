// ===============================
// API: 管理者用 新規メッセージ投稿 (POST)
// ===============================
// 役割：
// ・特定の Thread に対して、管理者 (OWNER) として新しいメッセージを投稿する
// ・リクエストボディからメッセージ本文 (`body`) を受け取る
// ・対象の Thread が存在しない場合は 404 エラーを返す
// ・作成されたメッセージ情報を返す (status: 201)
// ===============================

import { NextResponse } from "next/server";
import { PrismaClient, MessageAuthor } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    // ★ params は Promise<{ id: string }> として受け取る
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // ★ await してから id を取り出す
        const { id } = await params;
        const threadId = id;

        // 1. リクエストボディを取得
        const json = await request.json();
        const body: unknown = json.body;

        // 2. バリデーション
        if (typeof body !== "string" || body.trim().length === 0) {
            return NextResponse.json(
                { error: "メッセージ本文が空です。" },
                { status: 400 }
            );
        }

        // 3. 該当 Thread が存在するかチェック（安全のため）
        const thread = await prisma.thread.findUnique({
            where: { id: threadId },
            select: { id: true },
        });

        if (!thread) {
            return NextResponse.json(
                { error: "指定された Thread が存在しません。" },
                { status: 404 }
            );
        }

        // 4. 管理者メッセージを作成（author = OWNER）
        const message = await prisma.message.create({
            data: {
                threadId: threadId,
                body: body.trim(),
                author: MessageAuthor.OWNER, // ★ 管理者は常に OWNER
            },
        });

        // 5. 作成したメッセージを返す
        return NextResponse.json(
            {
                id: message.id,
                body: message.body,
                author: message.author,
                createdAt: message.createdAt,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("POST /api/admin/threads/[id]/messages error:", err);
        return NextResponse.json(
            { error: "メッセージの作成中にエラーが発生しました。" },
            { status: 500 }
        );
    }
}
