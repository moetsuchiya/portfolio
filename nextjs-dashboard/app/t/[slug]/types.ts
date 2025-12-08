// ===============================
// ユーザー用：型定義ファイル
// ===============================
// 役割：
// ・ユーザー側のチャット詳細画面 (page.tsx, ThreadMessages.tsx) で使用する共通の型を定義する
// ・サーバーコンポーネントとクライアントコンポーネント間で型情報を共有するために使用
// ===============================

// ユーザー向け Thread 詳細の共通型定義
// サーバー・クライアントで共有するために分離
export type UserThreadDetail = {
    id: string;
    slug: string;
    name: string;
    email: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    messages: {
        id: string;
        author: "USER" | "OWNER"; // メッセージの送り主（ユーザー or 管理者）
        body: string;              // メッセージ本文
        createdAt: Date;
    }[];
};
