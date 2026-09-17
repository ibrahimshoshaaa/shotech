import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '@/lib/admin';

export const runtime = 'nodejs';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(req: Request) {
  if (!await isAdmin()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET ||
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  ) {
    return Response.json({ error: 'Cloudinary is not configured.' }, { status: 501 });
  }

  try {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const form = await req.formData();
    const files = form
      .getAll('files')
      .filter((value): value is File => value instanceof File && value.size > 0);
    const single = form.get('file');

    if (!files.length && single instanceof File && single.size > 0) {
      files.push(single);
    }

    if (!files.length) {
      return Response.json({ error: 'No images selected.' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return Response.json(
        { error: `You can upload up to ${MAX_FILES} images at once.` },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return Response.json(
          { error: 'Only JPEG, PNG, WebP, and GIF images are allowed.' },
          { status: 400 },
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return Response.json(
          { error: 'Each image must be 10MB or smaller.' },
          { status: 400 },
        );
      }
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'shotech/projects', resource_type: 'image' },
            (error, upload) => {
              if (error || !upload?.secure_url) {
                reject(error || new Error('Upload failed.'));
                return;
              }
              resolve({ secure_url: upload.secure_url });
            },
          );
          stream.end(buffer);
        });
        return result.secure_url;
      }),
    );

    return Response.json({ ok: true, urls, url: urls[0] });
  } catch {
    return Response.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
