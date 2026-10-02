import { requireAdmin } from '@/app/lib/auth';
import { api, HttpError, noStore, readJson } from '@/app/lib/http';
import { projectInput, projectSelect } from '@/app/lib/projects';
import { prisma } from '@/app/lib/prisma';

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  return api(async () => {
    await requireAdmin(request);
    const { id } = await params;
    const input = projectInput.partial().parse(await readJson(request));
    if (input.thumbnailId && !await prisma.media.findUnique({ where: { id: input.thumbnailId }, select: { id: true } })) throw new HttpError(400, '画像が見つかりません。');
    const data = { ...input, ...('thumbnailId' in input ? { legacyImage: null } : {}) };
    return Response.json(await prisma.project.update({ where: { id }, data, select: projectSelect }), { headers: noStore });
  });
}

export async function DELETE(request: Request, { params }: Context) {
  return api(async () => {
    await requireAdmin(request);
    await prisma.project.delete({ where: { id: (await params).id } });
    return Response.json({ ok: true }, { headers: noStore });
  });
}
