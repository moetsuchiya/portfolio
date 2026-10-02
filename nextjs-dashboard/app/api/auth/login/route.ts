import { z } from 'zod';
import { api, HttpError, noStore, readJson, requireSameOrigin } from '@/app/lib/http';
import { rateLimit, startSession, verifyPassword } from '@/app/lib/auth';

export async function POST(request: Request) {
  return api(async () => {
    requireSameOrigin(request);
    await rateLimit('owner-login', 10, 900);
    const { email, password } = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(256) }).parse(await readJson(request));
    const valid = await verifyPassword(password);
    if (!valid || !process.env.ADMIN_EMAIL || email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) throw new HttpError(401, 'メールアドレスまたはパスワードが違います。');
    await startSession();
    return Response.json({ ok: true }, { headers: noStore });
  });
}
