import { api, noStore } from '@/app/lib/http';
import { listProjects } from '@/app/lib/projects';

export const dynamic = 'force-dynamic';
export async function GET() {
  return api(async () => Response.json(await listProjects(), { headers: noStore }));
}
