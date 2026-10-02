import { z } from 'zod';
import { requireAdmin } from '@/app/lib/auth';
import { api, HttpError, noStore, readJson } from '@/app/lib/http';
import { prisma } from '@/app/lib/prisma';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, { params }: Context) {
  return api(async () => {
    await requireAdmin(request);
    const thread = await prisma.thread.findUnique({ where: { id: (await params).id }, include: { messages: { orderBy: { createdAt: 'asc' } } } });
    if (!thread) throw new HttpError(404, 'お問い合わせが見つかりません。');
    return Response.json(thread, { headers: noStore });
  });
}
export async function PATCH(request: Request, { params }: Context) {
  return api(async () => {
    await requireAdmin(request);
    const { newStatus } = z.object({ newStatus: z.enum(['APPROVED', 'REJECTED']) }).parse(await readJson(request));
    const thread = await prisma.thread.update({ where: { id: (await params).id }, data: { status: newStatus } });
    return Response.json(thread, { headers: noStore });
  });
}
