import { isAdmin } from '@/app/lib/auth';
import { api, HttpError, noStore } from '@/app/lib/http';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return api(async () => {
    const { id } = await params;
    const visible = await prisma.project.findFirst({ where: { thumbnailId: id, published: true }, select: { id: true } });
    if (!visible && !await isAdmin()) throw new HttpError(404, '画像が見つかりません。');
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw new HttpError(404, '画像が見つかりません。');
    return new Response(new Uint8Array(media.data), { headers: { ...noStore, 'Content-Type': media.mimeType, 'X-Content-Type-Options': 'nosniff' } });
  });
}
