-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "githubUrl" TEXT NOT NULL DEFAULT '',
    "demoUrl" TEXT NOT NULL DEFAULT '',
    "period" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "legacyImage" TEXT,
    "thumbnailId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "tokenHash" TEXT NOT NULL,
    "credentials" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("tokenHash")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "Project_published_sortOrder_idx" ON "Project"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- One-time import of the existing portfolio. Later deploys never overwrite edits.
INSERT INTO "Project" ("id", "title", "description", "technologies", "githubUrl", "status", "published", "sortOrder", "legacyImage", "updatedAt") VALUES
('legacy-standup-timer', 'Standup-Timer', '初めて作ったwebアプリケーション。Djangoを使用', ARRAY['Django'], 'https://github.com/moetsuchiya/standup-timer', 'COMPLETED', true, 0, '/standup-timer.jpeg', CURRENT_TIMESTAMP),
('legacy-flea-market', 'flea-market-system', '現在作成中のSpring Bootのフリマサイト風アプリケーション', ARRAY['Spring Boot'], 'https://github.com/moetsuchiya', 'IN_PROGRESS', true, 1, '/dashboard-screenshot.jpeg', CURRENT_TIMESTAMP),
('legacy-map-capsule', 'Map-Capsule', '現在開発中のモバイルアプリケーション', ARRAY[]::TEXT[], 'https://github.com/moetsuchiya', 'IN_PROGRESS', true, 2, '/completion-screen.png', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
