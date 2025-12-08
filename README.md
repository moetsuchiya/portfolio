# お問い合わせ機能つきポートフォリオサイト

Next.jsを使用した、ポートフォリオ兼問い合わせ管理アプリケーションです！<br>お問い合わせに対し、個別のチャットでやり取りできます。なお、お問い合わせが承認された後、チャットページのurlがメールで送信されます。

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [スクリーンショット](#スクリーンショット)
3. [リンク集](#リンク集)
4. [主な機能](#主な機能)
5. [環境](#環境)
6. [ディレクトリ構成](#ディレクトリ構成)
4. [開発環境構築](#開発環境構築)
5. [Django コマンド一覧](#Djangoコマンド一覧)

## プロジェクトについて
- aa
  
## スクリーンショット

![Screenshot 1](public/dashboard-screenshot.jpeg)
![Screenshot 2](public/completion-screen.png)

## リンク集

- [UIデザイン](https://www.figma.com/design/Yc0vWj973m4x1SUgvZFLpS/Moe-Portfolio?m=auto&t=mkHpt2ApcHUeN3fR-6)
- [画面遷移図,UI Flow](https://www.figma.com/design/B14XC2oyrUodxDzC8wSofb/UiFlows?m=auto&t=mkHpt2ApcHUeN3fR-6)


## 主な使用技術

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, shadcn/ui
*   **ORM**: Prisma
*   **Database**: PostgreSQL
*   **Authentication**: NextAuth.js
*   **Email**: Resend
*   **Others**: Zod, Framer Motion, Embla Carousel

## 機能一覧

### ポートフォリオ機能
- スキル、プロジェクト、経歴の表示
- レスポンシブデザイン対応

### 問い合わせ管理機能
- **問い合わせフォーム:** サイト訪問者が管理者へ問い合わせを送信できます。
- **管理者ダッシュボード:**
    - 受信した問い合わせを一覧で表示します (`PENDING`, `APPROVED`, `REJECTED` のステータス管理)。
    - 各問い合わせに対して「承認」または「拒否」を選択できます。
- **チャットシステム:**
    - 承認された問い合わせは、ユニークなURLを持つチャットページが生成されます。
    - ユーザーと管理者は、そのページで非同期にメッセージのやり取りができます。

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

## APIエンドポイント

### 管理者用 (`/api/admin`)
- `POST /api/admin/threads`: **(未使用)**
- `GET /api/admin/threads`: 全ての問い合わせスレッドを取得
- `PATCH /api/admin/threads/[id]`: 特定スレッドのステータス（承認/拒否）を更新
- `POST /api/admin/threads/[id]/messages`: 特定スレッドに管理者としてメッセージを送信

### ユーザー用 (`/api/threads`)
- `POST /api/threads`: 新規問い合わせスレッドを作成
- `GET /api/threads/[slug]`: 特定スレッドの情報を取得
- `POST /api/threads/[slug]/messages`: 特定スレッドにユーザーとしてメッセージを送信

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

## ライセンス

このプロジェクトのライセンスは ... です。
