// やること:
// 1.contact/page.tsx フォームで「送信」するとブラウザがここ(api)に JSON を送る
// 2.最初のメッセージのデータを受け取る
// 3.dbにデータを保存する
// 4.slugを生成した後,完了画面に遷移

// API Routeで返すデータを作るためのNext.js専用の便利クラス
import { NextResponse } from "next/server";
// PrismaClient と一緒に enum 型もインポート
import { PrismaClient, MessageAuthor } from "../../../generated/prisma";

// PrismaClientの初期化
const prisma = new PrismaClient();

type RequestBody = {
    name: string;
    email: string;
    body: string; // 最初のメッセージのみ。二通目以降は他のapiで
};

function generateSlug() {
    // 6文字くらいのランダム文字列
    return Math.random().toString(36).slice(2, 8);
}

// ブラウザがfetch("/api/threads", { method: "POST" })と叩いてきたら、この関数が呼ばれる
// POST リクエストを処理する関数ですよ” という宣言↓
export async function POST(req: Request) {
    try {
        // フロントから送られてきたJSONをパース(データを解析し必要なデータを取り出すこと。JSON 形式の文字列を JavaScript のデータ構造に変換する)
        const { name, email, body}: RequestBody = await req.json(); //TODO: 中身を変数に分割代入(?)

        // バリデーションです
        if (!name || !email || !body) {
            return NextResponse.json(
        { error: "name, email, body は必須です" },
        { status: 400 }
        );
        }

        const slug = generateSlug();

        const thread = await prisma.thread.create({
            data: {
                slug,
                name,
                email,
                messages: {
                    create: {
                        author: MessageAuthor.USER,
                        body,
                    },
                },
            },
        });

        // クライアントにjsonで返答
        return NextResponse.json(
            {
                slug: thread.slug,
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
