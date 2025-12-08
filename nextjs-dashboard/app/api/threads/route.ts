// ===============================
// API: 新規 Thread 作成 (POST)
// ===============================
// 役割：
// ・お問い合わせフォームから送信された内容 (名前, メール, 本文) を受け取る
// ・新しい Thread と、それに紐づく最初のメッセージ (author: USER) をデータベースに作成する
// ・ランダムな `slug` (例: abc123) を生成し、作成した Thread に割り当てる
// ・作成成功後、生成された `slug` をクライアントに返す (status: 201)
// ===============================

// Next.jsの「APIレスポンスを簡単に作るためのユーティリティ」
import { NextResponse } from "next/server";
// Prisma と、MessageAuthor enum（USER or OWNER）を使う
import { PrismaClient, MessageAuthor } from "@/generated/prisma";

// PrismaClientの初期化（DBと通信する窓口 接続ハブ）
const prisma = new PrismaClient();

// フロント側から来る JSON の型。型の定義であって注釈(型定義aka設計書を使うこと)ではない。
type RequestBody = {
    name: string;
    email: string;
    body: string; // 最初のメッセージのみ。二通目以降は他のapiで
};

// slug作成用関数
function generateSlug() {
    return Math.random().toString(36).slice(2, 8);
    // Math.random() → "0.xxxxxx"
    // .toString(36) → 英数字の文字列に変換
    // .slice(2,8) → 先頭 "0." を切って6文字取り出す
}

// ===============================
// POST リクエストを受け取る
// ===============================
export async function POST(req: Request) {
    try {
        // -----------------------------------------------
        // 1. フロントから送られた JSON を取り出す(パース)
        //JSON 形式の文字列を JavaScript のデータ構造に変換する)
        //    { name, email, body } に分解
        // -----------------------------------------------
        const { name, email, body }: RequestBody = await req.json();

        // バリデーション
        if (!name || !email || !body) {
            return NextResponse.json(
        { error: "name, email, body は必須です" },
        { status: 400 }
        );
        }
        // -----------------------------------------------
        // 3. slug を生成
        //    この slug がチャットページのURLになる:
        //    例: https://site.com/t/abc123
        // -----------------------------------------------
        const slug = generateSlug();

        // -----------------------------------------------
        // 4. Thread を新規作成し、
        //    その中に「最初のメッセージ」も同時に保存する
        //
        // Thread
        //   ├─ name, email, slug
        //   └─ messages (1件 create: body, author=USER)
        // -----------------------------------------------
        const thread = await prisma.thread.create({
            data: {
                slug,    // ← URLとして使う識別子
                name,    // ユーザー入力
                email,   // ユーザー入力
                messages: {
                    create: {
                        author: MessageAuthor.USER, // メッセージの送り主
                        body,                       // 本文
                    },
                },
            },
        });

        // -----------------------------------------------
        // 5. クライアント側へ slug を返す
        //    fetch の結果として JSON { slug: "xxxxxx" } が返るので、
        //    フロント側はその slug を使って画面遷移できる
        // -----------------------------------------------
        return NextResponse.json(
            {
                slug: thread.slug, // ← 返す
            },
            { status: 201 }
        );

    } catch (err) {
        console.error("POST /api/threads error:", err);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました"},
            { status: 500 }
        );
    }
}
