import { api, noStore, requireSameOrigin } from '@/app/lib/http';
import { endSession } from '@/app/lib/auth';

export async function POST(request: Request) {
  return api(async () => {
    requireSameOrigin(request);
    await endSession();
    return Response.json({ ok: true }, { headers: noStore });
  });
}
