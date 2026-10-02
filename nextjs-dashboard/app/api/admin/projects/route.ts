import { requireAdmin } from '@/app/lib/auth';
import { api, HttpError, noStore, readJson } from '@/app/lib/http';
import { listProjects, projectInput, projectSelect } from '@/app/lib/projects';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  return api(async () => { await requireAdmin(request); return Response.json(await listProjects(false), { headers: noStore }); });
}

export async function POST(request: Request) {
  return api(async () => {
    await requireAdmin(request);
    const input = projectInput.parse(await readJson(request));
    if (input.thumbnailId && !await prisma.media.findUnique({ where: { id: input.thumbnailId }, select: { id: true } })) throw new HttpError(400, '画像が見つかりません。再度登録してください。');
    const first = await prisma.project.aggregate({ _min: { sortOrder: true } });
    const project = await prisma.project.create({ data: { ...input, sortOrder: (first._min.sortOrder ?? 0) - 1 }, select: projectSelect });
    return Response.json(project, { status: 201, headers: noStore });
  });
}
