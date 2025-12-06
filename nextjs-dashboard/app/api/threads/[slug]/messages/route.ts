// ===============================
// ユーザー用：返信メッセージ作成 API
// ===============================
// 役割：
// ・ユーザーが Thread（問い合わせ） に対してメッセージを追加するための API。
// ・対象URL: POST /api/threads/[slug]/messages
//   → [slug] = Thread.slug
// ・フロント側（UserReplyForm）から body を受け取り、
//   DB の Message モデルに author="USER" として保存する。
// ・保存後は「作成したメッセージの情報」を JSON として返す。
// ===============================

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, MessageAuthor } from "@/generated/prisma";

const prisma = new PrismaClient();
// Prisma を使って DB にアクセスするためのクライアント。
// route.ts のたびに new PrismaClient() して問題ない（Next.js がリクエスト単位で実行するため）。

// ===============================
// POST /api/threads/[slug]/messages
// ユーザーが 1 件の Thread にメッセージを追加する
// ===============================
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        // URL の [slug] パラメータ（Thread の slug）

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
        // 存在しない slug にメッセージを紐づけると DB 側でエラーになるため、
        // API レベルで 404 を返すほうが使いやすい。
        const thread = await prisma.thread.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!thread) {
            return NextResponse.json(
                { error: "指定された Thread が存在しません。" },
                { status: 404 }
            );
        }

        // -------------------------------------
        // 4. Message を作成（author = USER）
        // -------------------------------------
        // ユーザー送信なので MessageAuthor.USER をセット。
        const message = await prisma.message.create({
            data: {
                threadId: thread.id,   // 紐づく Thread の ID
                body: body.trim(),     // 本文
                author: MessageAuthor.USER,
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
