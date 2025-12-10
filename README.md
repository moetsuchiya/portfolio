<div align="center">
    <img src="nextjs-dashboard/public/name_rabel.png" alt="moe tsuchiya">
</div>

# お問い合わせ機能つきポートフォリオサイト
## サイトURL
https://portfolio-9nf2gpx8t-moe-tsuchiyas-projects.vercel.app/

## プロジェクトについて
- Next.jsを使用した、ポートフォリオ兼問い合わせ管理アプリケーションです！<br>お問い合わせに対し、個別のチャットでやり取りできます。

### 開発した背景
- next.jsを学ぶこと/1ヶ月で一つのプロジェクトを作り切り、デプロイすることを目的として制作しました。単なる静的なポートフォリオサイトにならないよう意識しました。

## 関連リンク集
- [UIデザイン](https://www.figma.com/design/Yc0vWj973m4x1SUgvZFLpS/Moe-Portfolio?m=auto&t=mkHpt2ApcHUeN3fR-6)
- [画面遷移図,UI Flow](https://www.figma.com/design/B14XC2oyrUodxDzC8wSofb/UiFlows?m=auto&t=mkHpt2ApcHUeN3fR-6)


## 主な使用技術

### Frontend

- **Next.js 15 (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion**
- **Embla Carousel**

### Backend / API

- **Next.js Route Handlers**
- **Prisma ORM**
- **Zod (バリデーション)**

### Infrastructure

- **PostgreSQL（Vercel Storage）**
- **Prisma Accelerate**
- **Resend（メール送信）**
- **NextAuth.js（管理画面の認証）**


## 機能一覧

### ポートフォリオ機能
- **メインページ**
    - 自己紹介
    - お問合せフォームへのリンク
    - 技術スタック
    - プロジェクト一覧

### 問い合わせ機能
- **問い合わせフォーム**
    - ユーザーが名前・メール・本文を送信することでお問合せをリクエストします。
    - お問合せ後、自動でチャット画面URLをユーザーへメール送信します。

- **管理者ダッシュボード:**
    - 不適切なお問合せを拒否できます。<br>未承認(PENDING) / 承認(APPROVED) / 拒否(REJECTED) で分類されます。
    - お問合せチャットを一覧表示します。

- **チャットシステム:**
    - 承認された問い合わせは、ユニークなURLを持つチャットページが生成されます。
    - ユーザーと管理者は、そのページで非同期にメッセージのやり取りができます。


## APIエンドポイント

### 管理者用 (`/api/admin`)
| Method | Endpoint                           | 内容         |
| ------ | ---------------------------------- | ---------- |
| GET    | `/api/admin/threads`               | 全スレッド取得    |
| PATCH  | `/api/admin/threads/[id]`          | ステータス更新    |
| POST   | `/api/admin/threads/[id]/messages` | 管理者メッセージ送信 |


### ユーザー用 (`/api/threads`)
| Method | Endpoint                       | 内容          |
| ------ | ------------------------------ | ----------- |
| POST   | `/api/threads`                 | 新規問い合わせ送信   |
| GET    | `/api/threads/[slug]`          | スレッド取得      |
| POST   | `/api/threads/[slug]/messages` | ユーザーメッセージ送信 |


## ディレクトリ構成

```
.
├── app/                  # App Routerのメインディレクトリ
│   ├── api/              # APIルート
│   ├── admin/            # 管理者用ページ
│   ├── components/       # 共通UIコンポーネント
│   ├── contact/          # 問い合わせフォームページ
│   ├── lib/              # データフェッチ、Prismaクライアントなど
│   └── t/[slug]/         # ユーザー用チャットページ
├── prisma/               # Prismaスキーマとマイグレーションファイル
├── public/               # 静的ファイル (画像など)
└── tailwind.config.ts    # Tailwind CSS設定ファイル
```


## セットアップと実行方法

1.  **リポジトリをクローン**
    ```bash
    git clone https://github.com/{your-username}/{repository-name}.git
    cd {repository-name}
    ```

2.  **パッケージをインストール**
    このプロジェクトでは `pnpm` を使用しています。
    ```bash
    pnpm install
    ```

3.  **環境変数を設定**
    `.env.example` ファイルをコピーして `.env` ファイルを作成し、中に記載されている各項目を設定してください。
    ```bash
    cp .env.example .env
    ```
    - `DATABASE_URL`: PostgreSQLデータベースの接続文字列。
    - `AUTH_SECRET`: `openssl rand -base64 32` コマンドで生成したシークレットキー。
    - `RESEND_API_KEY`: メール送信用ResendのAPIキー。

4.  **データベースのマイグレーション**
    Prismaを使ってデータベーススキーマを適用します。
    ```bash
    pnpm prisma migrate dev
    ```

5.  **開発サーバーを起動**
    ```bash
    pnpm dev
    ```
    ブラウザで `http://localhost:3000` を開いてください。
