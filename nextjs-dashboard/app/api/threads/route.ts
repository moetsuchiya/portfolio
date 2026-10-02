import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import { api, appOrigin, noStore, readJson, requireSameOrigin, requireWritable } from '@/app/lib/http';
import { rateLimit } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { sendChatLink } from '@/app/lib/mail';
export async function POST(request: Request) {
  return api(async () => {
    requireSameOrigin(request); requireWritable();
    const input = z.object({ name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(254), body: z.string().trim().min(1).max(10000) }).parse(await readJson(request));
    await rateLimit('contact-total', 30, 3600);
    await rateLimit('mail:' + createHash('sha256').update(input.email.toLowerCase()).digest('hex'), 3, 3600);
    await prisma.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    const thread = await prisma.thread.create({ data: { name: input.name, email: input.email, slug: randomBytes(24).toString('hex'), messages: { create: { author: 'USER', body: input.body } } } });
    const chatUrl = `${appOrigin()}/t/${thread.slug}`;
    const emailSent = await sendChatLink(input.name, input.email, chatUrl);
    return Response.json({ slug: thread.slug, chatUrl, emailSent }, { status: 201, headers: noStore });
  });
}
