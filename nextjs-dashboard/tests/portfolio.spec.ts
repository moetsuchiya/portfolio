import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import { PrismaClient } from '../generated/prisma';
import { readFile } from 'node:fs/promises';

const db = new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL });
const origin = 'http://127.0.0.1:3100';
const auth = { email: 'owner@example.test', password: 'Local-only-test-password!' };
async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('メールアドレス').fill(auth.email);
  await page.getByLabel('パスワード').fill(auth.password);
  await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  await expect(page.getByRole('heading', { name: '制作物を管理' })).toBeVisible();
}
async function apiLogin(request: APIRequestContext) {
  expect((await request.post('/api/auth/login', { headers: { Origin: origin }, data: auth })).status()).toBe(200);
}

test.beforeEach(async () => {
  await db.rateLimit.deleteMany();
  await db.project.deleteMany({ where: { title: { startsWith: 'E2E ' } } });
  await db.thread.deleteMany({ where: { email: { endsWith: '@example.test' } } });
});
test.afterAll(async () => {
  await db.project.deleteMany({ where: { title: { startsWith: 'E2E ' } } });
  await db.thread.deleteMany({ where: { email: { endsWith: '@example.test' } } });
  await db.media.deleteMany({ where: { projects: { none: {} } } });
  await db.adminSession.deleteMany();
  await db.rateLimit.deleteMany();
  await db.$disconnect();
});

test('管理画面から画像付き下書き→公開→編集→非公開→削除', async ({ page, request }) => {
  await login(page);
  await page.getByRole('link', { name: '＋ 制作物を追加' }).click();
  await page.getByLabel('タイトル').fill('E2E 制作物');
  await page.getByLabel('概要').fill('画像と説明を管理画面から登録しました。');
  await page.getByLabel('使用技術').fill('Next.js, TypeScript');
  await page.getByLabel('サムネイル').setInputFiles('public/standup-timer.jpeg');
  await expect(page.getByRole('status')).toContainText('画像を登録しました');
  await page.getByRole('button', { name: '下書きとして保存' }).click();
  await expect(page.getByRole('heading', { name: '制作物を管理' })).toBeVisible();
  const draft = await db.project.findFirstOrThrow({ where: { title: 'E2E 制作物' } });
  expect(draft.published).toBe(false); expect(draft.thumbnailId).toBeTruthy();
  expect((await request.get('/api/projects')).status()).toBe(200);
  expect(await (await request.get('/api/projects')).text()).not.toContain('E2E 制作物');
  expect((await request.get(`/api/media/${draft.thumbnailId}`)).status()).toBe(404);
  const row = page.locator('.admin-project-row').filter({ hasText: 'E2E 制作物' });
  await row.getByRole('button', { name: '公開する', exact: true }).click();
  await expect(row.getByText('公開中', { exact: true })).toBeVisible();
  expect((await request.get(`/api/media/${draft.thumbnailId}`)).status()).toBe(200);
  await page.goto('/#projects');
  await expect(page.getByRole('heading', { name: 'E2E 制作物', exact: true })).toBeVisible();
  await page.goto(`/admin/projects/${draft.id}`);
  await page.getByLabel('タイトル').fill('E2E 編集済み');
  await page.getByRole('button', { name: '公開して保存' }).click();
  await expect(page.getByRole('heading', { name: '制作物を管理' })).toBeVisible();
  expect(await (await request.get('/api/projects')).text()).toContain('E2E 編集済み');
  const updated = page.locator('.admin-project-row').filter({ hasText: 'E2E 編集済み' });
  await updated.getByRole('button', { name: '非公開にする' }).click();
  await expect(updated.getByText('下書き・非公開')).toBeVisible();
  expect(await (await request.get('/api/projects')).text()).not.toContain('E2E 編集済み');
  expect((await request.get(`/api/media/${draft.thumbnailId}`)).status()).toBe(404);
  page.once('dialog', d => d.accept());
  await updated.getByRole('button', { name: '削除', exact: true }).click();
  await expect(updated).toHaveCount(0);
});

test('未ログインの全管理API、CSRF、期限切れセッションを拒否', async ({ page, request }) => {
  const endpoints = [
    ['GET', '/api/admin/projects'], ['POST', '/api/admin/projects'], ['PATCH', '/api/admin/projects/legacy-standup-timer'], ['DELETE', '/api/admin/projects/legacy-standup-timer'], ['POST', '/api/admin/projects/reorder'], ['POST', '/api/admin/media'],
    ['GET', '/api/admin/threads'], ['GET', '/api/admin/threads/unknown'], ['PATCH', '/api/admin/threads/unknown'], ['POST', '/api/admin/threads/unknown/messages'],
  ];
  for (const [method, path] of endpoints) expect((await request.fetch(path, { method })).status(), path).toBe(401);
  await page.goto('/admin/projects'); await expect(page).toHaveURL(/\/login$/);
  await apiLogin(request);
  expect((await request.post('/api/admin/projects', { headers: { Origin: 'https://attacker.example' }, data: { title: 'E2E CSRF' } })).status()).toBe(403);
  expect((await request.post('/api/admin/projects', { data: { title: 'E2E no-origin' } })).status()).toBe(403);
  await db.adminSession.updateMany({ data: { expiresAt: new Date(0) } });
  expect((await request.get('/api/admin/projects')).status()).toBe(401);
  await apiLogin(request);
  expect((await request.post('/api/auth/logout', { headers: { Origin: origin } })).status()).toBe(200);
  expect((await request.get('/api/admin/projects')).status()).toBe(401);
});

test('0件・1件・多数の表示、並び替え、検索、スマートフォン', async ({ page, request }) => {
  await apiLogin(request);
  const originals = await db.project.findMany();
  try {
    await db.project.updateMany({ data: { published: false } });
    await page.goto('/#projects'); await expect(page.getByText('制作物はただいま準備中です。')).toBeVisible();
    await db.project.update({ where: { id: originals[0].id }, data: { published: true } });
    await page.reload(); await expect(page.getByTestId('project-card')).toHaveCount(1);
    await db.project.updateMany({ data: { published: true } });
    for (let i = 0; i < 7; i++) {
      expect((await request.post('/api/admin/projects', { headers: { Origin: origin }, data: { title: `E2E 作品 ${i}`, published: true } })).status()).toBe(201);
    }
    const all = await (await request.get('/api/admin/projects')).json();
    const ids = all.map((p: { id: string }) => p.id).reverse();
    expect((await request.post('/api/admin/projects/reorder', { headers: { Origin: origin }, data: { ids } })).status()).toBe(200);
    expect((await (await request.get('/api/projects')).json()).map((p: { id: string }) => p.id)).toEqual(ids);
    expect((await request.post('/api/admin/projects/reorder', { headers: { Origin: origin }, data: { ids: [ids[0], ids[0]] } })).status()).toBe(409);
    await page.goto('/#projects'); await expect(page.getByTestId('project-card')).toHaveCount(10);
    await page.getByRole('searchbox').fill('E2E 作品 3'); await expect(page.getByTestId('project-card')).toHaveCount(1);
    await page.getByRole('searchbox').fill('該当なし'); await expect(page.getByText('一致する制作物がありません。検索条件を変えてお試しください。')).toBeVisible();
    await page.getByRole('searchbox').fill('');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByTestId('project-card')).toHaveCount(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('#projects').screenshot({ path: 'test-results/projects-mobile.png' });
  } finally {
    for (const p of originals) await db.project.update({ where: { id: p.id }, data: { published: p.published, sortOrder: p.sortOrder } });
  }
});

test('入力検証・画像形式・ログイン試行制限', async ({ request }) => {
  await apiLogin(request);
  for (const data of [{ title: '' }, { title: 'E2E invalid', demoUrl: 'javascript:alert(1)' }, { title: 'E2E invalid', published: 'true' }]) {
    expect((await request.post('/api/admin/projects', { headers: { Origin: origin }, data })).status()).toBe(400);
  }
  expect((await request.post('/api/admin/media', { headers: { Origin: origin, 'Content-Type': 'image/svg+xml' }, data: '<svg xmlns="http://www.w3.org/2000/svg"></svg>' })).status()).toBe(400);
  expect((await request.post('/api/admin/media', { headers: { Origin: origin, 'Content-Type': 'image/jpeg' }, data: Buffer.alloc(5 * 1024 * 1024 + 1) })).status()).toBe(413);
  await request.post('/api/auth/logout', { headers: { Origin: origin } });
  for (let i = 0; i < 9; i++) expect((await request.post('/api/auth/login', { headers: { Origin: origin }, data: { ...auth, password: 'incorrect' } })).status()).toBe(401);
  expect((await request.post('/api/auth/login', { headers: { Origin: origin }, data: auth })).status()).toBe(429);
});

test('問い合わせ保存・メール無効時の案内・承認・双方の返信・拒否', async ({ page, request }) => {
  await page.goto('/contact');
  await page.getByLabel('お名前').fill('E2E 利用者');
  await page.getByLabel('メールアドレス').fill('visitor@example.test');
  await page.getByLabel('メッセージ').fill('E2E 問い合わせです。');
  await page.getByRole('button', { name: /送信/ }).click();
  await expect(page.getByText(/メールは送信されていません/)).toBeVisible();
  const thread = await db.thread.findFirstOrThrow({ where: { email: 'visitor@example.test' } });
  expect(thread.slug).toHaveLength(48);
  expect((await request.post(`/api/threads/${thread.slug}/messages`, { headers: { Origin: origin }, data: { body: 'pending bypass' } })).status()).toBe(403);
  const pending = await (await request.get(`/api/threads/${thread.slug}`)).json();
  expect(pending.messages).toEqual([]); expect(pending.email).toBeUndefined();
  await apiLogin(request);
  expect((await request.patch(`/api/admin/threads/${thread.id}`, { headers: { Origin: origin }, data: { newStatus: 'APPROVED' } })).status()).toBe(200);
  expect((await request.post(`/api/admin/threads/${thread.id}/messages`, { headers: { Origin: origin }, data: { body: 'E2E 管理者からの返信' } })).status()).toBe(201);
  expect((await request.post(`/api/threads/${thread.slug}/messages`, { headers: { Origin: origin }, data: { body: 'E2E 利用者からの返信' } })).status()).toBe(201);
  await page.goto(`/t/${thread.slug}`); await expect(page.getByText('E2E 管理者からの返信', { exact: true })).toBeVisible();
  await expect(page.getByText('E2E 利用者からの返信', { exact: true })).toBeVisible();
  expect((await request.patch(`/api/admin/threads/${thread.id}`, { headers: { Origin: origin }, data: { newStatus: 'REJECTED' } })).status()).toBe(200);
  expect((await request.post(`/api/threads/${thread.slug}/messages`, { headers: { Origin: origin }, data: { body: 'rejected bypass' } })).status()).toBe(403);
});

test('既存画像を保持して編集、デスクトップと管理画面の表示', async ({ page }) => {
  await login(page);
  await page.screenshot({ path: 'test-results/admin-projects.png', fullPage: true });
  await page.goto('/admin/projects/legacy-standup-timer');
  await expect(page.locator('.editor-preview img')).toHaveAttribute('src', '/standup-timer.jpeg');
  await page.getByRole('button', { name: '公開して保存' }).click();
  await expect(page.getByRole('heading', { name: '制作物を管理' })).toBeVisible();
  expect((await db.project.findUniqueOrThrow({ where: { id: 'legacy-standup-timer' } })).legacyImage).toBe('/standup-timer.jpeg');
  await page.goto('/#projects');
  await expect(page.getByTestId('project-card')).toHaveCount(3);
  await page.locator('#projects').screenshot({ path: 'test-results/projects-desktop.png' });
  await page.goto('/admin/projects/new');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/editor-mobile.png', fullPage: true });
});
