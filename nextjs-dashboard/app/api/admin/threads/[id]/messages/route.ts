// ===============================
// 管理者用：1件の Thread に返信メッセージを追加する API
// ===============================
// 役割：
// ・URL: POST /api/admin/threads/[id]/messages
//   → [id] は Thread.id（cuid）
// ・管理者としての返信を Message(author="OWNER") として1件追加する。
// ・body で受け取った本文を、author="USER" として Message に保存する。
// ・Thread が存在しなければ 404 を返す。
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
