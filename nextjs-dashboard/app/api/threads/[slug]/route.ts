import { api, HttpError, noStore } from '@/app/lib/http';
import { prisma } from '@/app/lib/prisma';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return api(async () => {
    const thread = await prisma.thread.findUnique({ where: { slug: (await params).slug }, select: { id: true, slug: true, name: true, status: true, createdAt: true, messages: { orderBy: { createdAt: 'asc' }, select: { id: true, author: true, body: true, createdAt: true } } } });
    if (!thread) throw new HttpError(404, 'お問い合わせが見つかりません。');
    if (thread.status !== 'APPROVED') return Response.json({ slug: thread.slug, status: thread.status, messages: [] }, { headers: noStore });
    return Response.json(thread, { headers: noStore });
  });
}
