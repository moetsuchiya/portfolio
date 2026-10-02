import { requireAdmin } from '@/app/lib/auth';
import { api, noStore } from '@/app/lib/http';
import { prisma } from '@/app/lib/prisma';
import { ThreadStatus } from '@/generated/prisma';
export async function GET(request: Request) {
  return api(async () => {
    await requireAdmin(request);
    const raw = (new URL(request.url).searchParams.get('status') || 'PENDING').toUpperCase();
    const status = Object.values(ThreadStatus).includes(raw as ThreadStatus) ? raw as ThreadStatus : ThreadStatus.PENDING;
    const threads = await prisma.thread.findMany({ where: { status }, orderBy: { createdAt: 'desc' }, include: { messages: { orderBy: { createdAt: 'asc' } } } });
    return Response.json(threads, { headers: noStore });
  });
}
