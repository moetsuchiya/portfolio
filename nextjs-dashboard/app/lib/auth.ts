import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { appOrigin, HttpError, requireSameOrigin, requireWritable } from './http';

const derive = promisify(scrypt);
const COOKIE = 'portfolio_session';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const credentials = () => hash(`${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD_HASH}`);

export async function verifyPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD_HASH || '';
  if (!/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(configured)) throw new HttpError(503, '管理者のログイン設定が未完了です。');
  const [, salt, expected] = configured.split(':');
  const actual = await derive(password, salt, 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token) || !process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_EMAIL) return false;
  const session = await prisma.adminSession.findUnique({ where: { tokenHash: hash(token) } });
  return !!session && session.expiresAt > new Date() && session.credentials === credentials();
}

export async function requireAdmin(request: Request) {
  if (!await isAdmin()) throw new HttpError(401, 'ログインしてください。');
  if (!['GET', 'HEAD'].includes(request.method)) { requireSameOrigin(request); requireWritable(); }
}

export async function requireAdminPage() {
  if (!await isAdmin()) redirect('/login');
}

export async function startSession() {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000);
  await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await prisma.adminSession.create({ data: { tokenHash: hash(token), credentials: credentials(), expiresAt: expires } });
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: 'strict', secure: appOrigin().startsWith('https:'), path: '/', expires });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await prisma.adminSession.deleteMany({ where: { tokenHash: hash(token) } });
  jar.delete(COOKIE);
}

// DB-backed fixed windows survive restarts and work across instances.
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const now = new Date();
  const expires = new Date(now.getTime() + windowSeconds * 1000);
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "expiresAt") VALUES (${key}, 1, ${expires})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN 1 ELSE "RateLimit"."count" + 1 END,
      "expiresAt" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN ${expires} ELSE "RateLimit"."expiresAt" END
    RETURNING "count"`;
  if (rows[0].count > limit) throw new HttpError(429, '操作が続いています。しばらく待ってからお試しください。');
}
