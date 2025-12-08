// ===============================
// 管理者用：型定義ファイル
// ===============================
// 役割：
// ・管理者側のチャット詳細画面 (page.tsx, ThreadMessages.tsx) で使用する共通の型を定義する
// ・サーバーコンポーネントとクライアントコンポーネント間で型情報を共有するために使用
// ===============================

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
