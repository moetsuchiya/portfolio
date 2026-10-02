import { notFound } from 'next/navigation';
import { requireAdminPage } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { projectSelect } from '@/app/lib/projects';
import ProjectEditor from '../ProjectEditor';
export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const project = await prisma.project.findUnique({ where: { id: (await params).id }, select: projectSelect });
  if (!project) notFound(); return <ProjectEditor project={project} />;
}
