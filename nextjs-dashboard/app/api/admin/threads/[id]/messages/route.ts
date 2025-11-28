// ===============================
// 管理者用：返信メッセージ作成 API
// ===============================
// 役割：
// ・管理者が Thread（問い合わせ） に対して返信メッセージを追加するための API。
// ・対象URL: POST /api/admin/threads/[id]/messages
//   → [id] = Thread.id（cuid）
// ・フロント側（AdminReplyForm）から body を受け取り、
//   DB の Message モデルに author="OWNER" として保存する。
// ・保存後は「作成したメッセージの情報」を JSON として返す。
// ===============================

import { NextResponse } from "next/server";
import { PrismaClient, MessageAuthor } from "@/generated/prisma";

const prisma = new PrismaClient();
// Prisma を使って DB にアクセスするためのクライアント。
// route.ts のたびに new PrismaClient() して問題ない（Next.js がリクエスト単位で実行するため）。

// ===============================
// POST /api/admin/threads/[id]/messages
// 管理者が 1 件の Thread に返信メッセージを追加する
// ===============================
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const threadId = params.id;
        // URL の [id] パラメータ（Thread の ID）

        // -------------------------------------
        // 1. リクエストボディ(JSON) を取得
        // -------------------------------------
        // 例:
        // { "body": "管理者からの返信内容" }
        const json = await request.json();
        const body: unknown = json.body;

        // -------------------------------------
        // 2. バリデーション（型 & 空文字チェック）
        // -------------------------------------
        if (typeof body !== "string" || body.trim().length === 0) {
            return NextResponse.json(
                { error: "メッセージ本文が空です。" },
                { status: 400 }
            );
        }

        // -------------------------------------
        // 3. Thread が存在するか確認（任意だけど安全）
        // -------------------------------------
        // 存在しない ID にメッセージを紐づけると DB 側でエラーになるため、
        // API レベルで 404 を返すほうが使いやすい。
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

        // -------------------------------------
        // 4. Message を作成（author = OWNER）
        // -------------------------------------
        // 管理者の送信なので MessageAuthor.OWNER をセット。
        // body.trim(): 余計な空白を防ぐ。
        const message = await prisma.message.create({
            data: {
                threadId: threadId,   // 紐づく Thread の ID
                body: body.trim(),    // 本文
                author: MessageAuthor.OWNER, // 管理者
            },
        });

        // -------------------------------------
        // 5. 作成したメッセージを返す
        // -------------------------------------
        // フロントで router.refresh() 後にも使えるように
        // 必要なデータのみ返す（全フィールド不要）
        return NextResponse.json(
            {
                id: message.id,
                body: message.body,
                author: message.author,
                createdAt: message.createdAt,
            },
            { status: 201 } // 作成成功
        );

    } catch (err) {
        // -------------------------------------
        // 想定外のエラーは 500 として返す
        // -------------------------------------
        console.error(err);
        return NextResponse.json(
            { error: "メッセージの作成中にエラーが発生しました。" },
            { status: 500 }
        );
    }
}
