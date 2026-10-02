import { z } from 'zod';
import { requireAdmin } from '@/app/lib/auth';
import { api, HttpError, noStore, readJson } from '@/app/lib/http';
import { prisma } from '@/app/lib/prisma';
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return api(async () => {
    await requireAdmin(request);
    const { body } = z.object({ body: z.string().trim().min(1).max(10000) }).parse(await readJson(request));
    const thread = await prisma.thread.findUnique({ where: { id: (await params).id }, select: { id: true, status: true } });
    if (!thread) throw new HttpError(404, 'お問い合わせが見つかりません。');
    if (thread.status !== 'APPROVED') throw new HttpError(403, '承認後に返信できます。');
    const message = await prisma.message.create({ data: { threadId: thread.id, body, author: 'OWNER' } });
    return Response.json(message, { status: 201, headers: noStore });
  });
}
