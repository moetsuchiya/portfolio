import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RequestBody = {
    name: string;
    email: string;
    body: string; // 最初のメッセージ
};

function generateSlug() {
    // 6文字くらいのランダム文字列（かぶりにくければOK）utf8がどうたら?
    return Math.random().toString(36).slice(2, 8);
}

export async function POST(req: Request) {
    try {
        const { name, email, body}: RequestBody = await req.json(); //TODO: ぶんかつ

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
                        author: "user",
                        body,
                    },
                },
            },
        });

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
