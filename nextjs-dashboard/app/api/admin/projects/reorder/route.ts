import { z } from 'zod';
import { requireAdmin } from '@/app/lib/auth';
import { api, HttpError, noStore, readJson } from '@/app/lib/http';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  return api(async () => {
    await requireAdmin(request);
    const { ids } = z.object({ ids: z.array(z.string()).max(1000) }).parse(await readJson(request));
    await prisma.$transaction(async tx => {
      const current = await tx.project.findMany({ select: { id: true } });
      if (new Set(ids).size !== ids.length || ids.length !== current.length || current.some(p => !ids.includes(p.id))) throw new HttpError(409, '一覧が更新されました。再読み込みしてから並び替えてください。');
      for (let i = 0; i < ids.length; i++) await tx.project.update({ where: { id: ids[i] }, data: { sortOrder: i } });
    }, { isolationLevel: 'Serializable' });
    return Response.json({ ok: true }, { headers: noStore });
  });
}
