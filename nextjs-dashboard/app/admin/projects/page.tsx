import { requireAdminPage } from '@/app/lib/auth';
import { listProjects } from '@/app/lib/projects';
import ProjectList from './ProjectList';
export default async function ProjectsPage() { await requireAdminPage(); return <ProjectList initialProjects={await listProjects(false)} />; }
