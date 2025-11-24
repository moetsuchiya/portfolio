// app/page.tsx

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-900">
      {/* ============================
          1. ヘッダー
      ============================= */}
      <header className="w-full px-8 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="text-base font-semibold tracking-wide">
          Moe Portfolio
        </div>

        <nav className="flex gap-6 text-sm">
          <a href="#skills" className="hover:opacity-70">
            Skills
          </a>
          <a href="#about" className="hover:opacity-70">
            About
          </a>
          <a href="#portfolio" className="hover:opacity-70">
            Portfolio
          </a>
          <a href="#contact" className="hover:opacity-70">
            Contact
          </a>
        </nav>
      </header>

      {/* ============================
          2. Hero セクション
      ============================= */}
      <section className="max-w-6xl mx-auto px-8 pt-10 pb-20 grid gap-10 md:grid-cols-2 items-center">
        {/* 左：テキスト */}
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-600">
            Fullstack Engineer
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">
            Moe Tsuchiya
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed max-w-md">
            Next.js / TypeScript / Python を中心に、
            小さくても実際に使える Web アプリケーションを制作しています。
            UI デザインと実装を往復しながら、使いやすさを重視した開発をしています。
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#portfolio"
              className="px-5 py-2.5 text-sm rounded-full bg-sky-600 text-white hover:bg-sky-700 transition"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 text-sm rounded-full border border-sky-600 text-sky-700 hover:bg-sky-50 transition"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* 右：人物イメージ（仮のボックス。後で画像に差し替え） */}
        <div className="flex justify-center md:justify-end">
          <div className="w-60 h-80 md:w-72 md:h-96 bg-gradient-to-b from-sky-200 to-sky-400 rounded-3xl shadow-md flex items-end justify-center overflow-hidden">
            {/* ここに実際の <Image> を入れる想定 */}
            <span className="text-xs text-white/80 pb-4">
              Photo / Illustration Here
            </span>
          </div>
        </div>
      </section>

      {/* ============================
          3. Skills セクション
      ============================= */}
      <section
        id="skills"
        className="max-w-6xl mx-auto px-8 pb-20 space-y-8"
      >
        <h2 className="text-2xl font-semibold text-center">Skills</h2>
        <p className="text-sm text-gray-700 text-center max-w-xl mx-auto">
          フロントエンドからバックエンドまで、学習と制作を通して身につけたスキルです。
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* カード1 */}
          <div className="rounded-xl bg-white shadow-sm p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-lg">
              {/* アイコンの代わり */}
              FE
            </div>
            <h3 className="text-base font-semibold">Frontend</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              React / Next.js / TypeScript / Tailwind CSS を使った SPA・SSR の実装。
            </p>
          </div>

          {/* カード2 */}
          <div className="rounded-xl bg-white shadow-sm p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-lg">
              BE
            </div>
            <h3 className="text-base font-semibold">Backend</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Django / Prisma / REST API。DB 設計から簡単な CRUD 実装まで経験。
            </p>
          </div>

          {/* カード3 */}
          <div className="rounded-xl bg-white shadow-sm p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-lg">
              UX
            </div>
            <h3 className="text-base font-semibold">Design &amp; UX</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Figma を用いたプロトタイピングと、実装を見据えた UI 設計。
            </p>
          </div>
        </div>
      </section>

      {/* ============================
          4. About セクション
      ============================= */}
      <section
        id="about"
        className="max-w-6xl mx-auto px-8 pb-20 grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center"
      >
        {/* 左：画像エリア（仮） */}
        <div className="flex justify-center md:justify-start">
          <div className="w-64 h-80 bg-gray-200 rounded-3xl overflow-hidden flex items-center justify-center">
            {/* 実際の人物写真に差し替え予定 */}
            <span className="text-xs text-gray-500">
              Portrait Image
            </span>
          </div>
        </div>

        {/* 右：テキスト */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">About me</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            3年制専門学校の2年生として、2024年から本格的にプログラミング学習を開始しました。
            授業とは別に個人開発でポートフォリオを作り、実際に動くサービスを通して学ぶスタイルです。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            フロントエンドだけでなく、API やデータベース、デプロイまでの一連の流れを理解し、
            「自分で考えて組み立てられる」エンジニアを目指しています。
          </p>
        </div>
      </section>

      {/* ============================
          5. Portfolio セクション
      ============================= */}
      <section
        id="portfolio"
        className="max-w-6xl mx-auto px-8 pb-20"
      >
        <h2 className="text-2xl font-semibold text-center mb-8">
          Portfolio
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* ここは後で実際のプロジェクトカードに差し替える */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-32 bg-gray-200" />
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-semibold">MapCapsule</h3>
              <p className="text-xs text-gray-600">
                地図とタイムカプセルを組み合わせた Web アプリ。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-32 bg-gray-200" />
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-semibold">StandupTimer</h3>
              <p className="text-xs text-gray-600">
                学習時間と座りすぎ防止を両立するタイマーアプリ。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-32 bg-gray-200" />
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-semibold">
                Contact &amp; Chat System
              </h3>
              <p className="text-xs text-gray-600">
                問い合わせ→承認→チャット開始までを一気通貫で扱う Next.js アプリ。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          6. フッター（Contact含める）
      ============================= */}
      <footer
        id="contact"
        className="border-t py-8 text-center text-xs text-gray-600"
      >
        <p className="mb-2">
          お問い合わせは本サイトのフォーム or 各種SNSからご連絡ください。
        </p>
        <p>© 2024 Moe Tsuchiya</p>
      </footer>
    </main>
  );
}

