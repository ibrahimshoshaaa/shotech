import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!await isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return Response.json({ error: "Cloudinary is not configured" }, { status: 501 });
  }
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const form = await req.formData();
    const files = form.getAll("files").filter((x): x is File => x instanceof File && x.size > 0);
    const single = form.get("file");
    if (!files.length && single instanceof File && single.size > 0) files.push(single);
    if (!files.length) return Response.json({ error: "No images selected" }, { status: 400 });
    if (files.length > 10) return Response.json({ error: "You can upload up to 10 images at once" }, { status: 400 });
    for (const file of files) {
      if (!file.type.startsWith("image/")) return Response.json({ error: "Only image files are allowed" }, { status: 400 });
      if (file.size > 10 * 1024 * 1024) return Response.json({ error: "Each image must be 10MB or smaller" }, { status: 400 });
    }
    const urls = await Promise.all(files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "shotech/projects", resource_type: "image" }, (error, upload) => error ? reject(error) : resolve(upload));
        stream.end(buffer);
      });
      return result.secure_url as string;
    }));
    return Response.json({ ok: true, urls, url: urls[0] });
  } catch (error: any) {
    return Response.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}
