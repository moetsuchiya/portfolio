import { Prisma } from '@/generated/prisma';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const noStore = { 'Cache-Control': 'private, no-store' };

export async function api(run: () => Promise<Response>): Promise<Response> {
  try { return await run(); }
  catch (error) {
    if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status, headers: noStore });
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return Response.json({ error: error instanceof ZodError ? error.issues[0].message : '入力形式を確認してください。' }, { status: 400, headers: noStore });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ error: '対象が見つかりません。' }, { status: 404, headers: noStore });
    }
    // Do not log query arguments, contact details, passwords or connection URLs.
    console.error('API request failed', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({ error: '処理に失敗しました。時間をおいて再度お試しください。' }, { status: 500, headers: noStore });
  }
}

export async function readBytes(request: Request, limit: number): Promise<Uint8Array> {
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413, '送信データが大きすぎます。');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'データがありません。');
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > limit) { await reader.cancel(); throw new HttpError(413, '送信データが大きすぎます。'); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function readJson(request: Request) {
  return JSON.parse(Buffer.from(await readBytes(request, 64 * 1024)).toString('utf8'));
}

export function appOrigin() {
  const value = process.env.APP_URL;
  if (!value) throw new HttpError(503, 'サイトURLが未設定です。');
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new HttpError(503, 'サイトURLの設定を確認してください。');
  return url.origin;
}

export function requireSameOrigin(request: Request) {
  if (request.headers.get('origin') !== appOrigin()) throw new HttpError(403, 'この送信元からは操作できません。');
}

export function requireWritable() {
  if (process.env.READ_ONLY_MODE === 'true') throw new HttpError(503, 'ただいまメンテナンス中です。時間をおいて再度お試しください。');
}
