import { requireAdminPage } from '@/app/lib/auth';
import ProjectEditor from '../ProjectEditor';
export default async function NewProjectPage() { await requireAdminPage(); return <ProjectEditor />; }
