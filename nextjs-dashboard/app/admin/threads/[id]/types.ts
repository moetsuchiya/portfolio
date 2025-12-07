// 管理者向け Thread 詳細レスポンスの共通型
// サーバー・クライアント両方で再利用するため分離
export type AdminThreadDetail = {
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
