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
