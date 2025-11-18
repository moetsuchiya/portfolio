// contact/page.tsx フォームで「送信」すると
// ブラウザがここ(api)に JSON を送る

// API Routeで返すデータを作るためのNext.js専用の便利クラス
import { NextResponse } from "next/server";

// ブラウザがfetch("/api/contact", { method: "POST" })と叩いてきたら、この関数が呼ばれる
// POST リクエストを処理する関数ですよ” という宣言↓
export async function POST(request: Request) {
  // フロントから送られてきたJSONをパース(データを解析し必要なデータを取り出すこと。JSON 形式の文字列を JavaScript のデータ構造に変換する)
    const body = await request.json();
    const { name, email, message } = body; //TODO: 中身を変数に分割代入(?)

  // 超ざっくりバリデーション（後でちゃんとやる）
    if (!name || !email || !message) {
    return NextResponse.json(
    { ok: false, error: "必須項目が足りません" },
    { status: 400 }
    );
}

  // NOTE: メール送信やDB保存をする（今はログだけ）
console.log("CONTACT FORM RECEIVED:", body);

// クライアントにjsonで返答
return NextResponse.json(
    { ok: true, message: "お問い合わせを受け付けました（仮）" },
    { status: 200 }
);
}
