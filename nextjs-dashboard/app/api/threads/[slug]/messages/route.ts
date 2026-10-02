import { z } from 'zod';
import { rateLimit } from '@/app/lib/auth';
import { api, HttpError, noStore, readJson, requireSameOrigin, requireWritable } from '@/app/lib/http';
import { prisma } from '@/app/lib/prisma';
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return api(async () => {
    requireSameOrigin(request); requireWritable();
    const { body } = z.object({ body: z.string().trim().min(1).max(10000) }).parse(await readJson(request));
    const thread = await prisma.thread.findUnique({ where: { slug: (await params).slug }, select: { id: true, status: true } });
    if (!thread) throw new HttpError(404, 'お問い合わせが見つかりません。');
    if (thread.status !== 'APPROVED') throw new HttpError(403, '現在このチャットには投稿できません。');
    await rateLimit('thread:' + thread.id, 20, 60);
    const message = await prisma.message.create({ data: { threadId: thread.id, body, author: 'USER' } });
    return Response.json(message, { status: 201, headers: noStore });
  });
}
