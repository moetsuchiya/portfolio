import { NextResponse } from "next/server";
import postgres from "postgres";

type ContactPayload = {
    name: string;
    email: string;
    message: string;
};

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not configured");
}

const sql = postgres(POSTGRES_URL, { ssl: "require" });
let contactTableInitPromise: Promise<void> | null = null;

async function ensureContactTable() {
    if (!contactTableInitPromise) {
        contactTableInitPromise = sql`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id BIGSERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `.then(() => undefined);
    }

    return contactTableInitPromise;
}

async function saveContactMessage(payload: ContactPayload) {
    await ensureContactTable();
    await sql`
        INSERT INTO contact_messages (name, email, message)
        VALUES (${payload.name}, ${payload.email}, ${payload.message});
    `;
}

async function sendContactEmail(payload: ContactPayload) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !from || !to) {
        console.warn("Contact email environment variables are missing; skip sending email.");
        return;
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: [to],
            reply_to: payload.email,
            subject: `New contact from ${payload.name}`,
            text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Email send failed: ${response.status} ${errorText}`);
    }
}

export async function POST(request: Request) { // async: 非同期処理を行う宣言
    const body = await request.json(); //await: 他では非同期処理しつつ結果待ち
    const { name, email, message } = body; //TODO 分割代入: JSON の中身を変数にばらす

    //バリデーション
    if (!name || !email || !message) {
        return NextResponse.json(
            { ok: false, error: "必須項目が足りません" },
            { status: 400 }
        );
    }

    try {
        const payload: ContactPayload = { name, email, message };
        await Promise.all([
            saveContactMessage(payload),
            sendContactEmail(payload),
        ]);
    } catch (error) {
        console.error("Failed to handle contact form:", error);
        return NextResponse.json(
            { ok: false, error: "送信処理でエラーが発生しました" },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { ok: true, message: "お問い合わせを受け付けました！" },
        { status: 200}
    )
}
