import sharp from 'sharp';
import { requireAdmin } from '@/app/lib/auth';
import { api, HttpError, noStore, readBytes } from '@/app/lib/http';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  return api(async () => {
    await requireAdmin(request);
    const input = await readBytes(request, 5 * 1024 * 1024);
    let data: Buffer;
    try {
      const image = sharp(input, { limitInputPixels: 24_000_000, animated: false });
      const metadata = await image.metadata();
      if (!['jpeg', 'png', 'webp'].includes(metadata.format || '')) throw new Error('Unsupported image');
      data = await image.rotate().resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    } catch { throw new HttpError(400, '5MB以下のJPEG・PNG・WebP画像を選んでください（最大2400万画素）。'); }
    if (data.length > 2 * 1024 * 1024) throw new HttpError(413, '画像を小さくして再度登録してください。');
    // Remove abandoned uploads only after a grace period, never attached images.
    await prisma.media.deleteMany({ where: { projects: { none: {} }, createdAt: { lt: new Date(Date.now() - 7 * 86400_000) } } });
    const media = await prisma.media.create({ data: { data: new Uint8Array(data), mimeType: 'image/webp' }, select: { id: true } });
    return Response.json(media, { status: 201, headers: noStore });
  });
}
