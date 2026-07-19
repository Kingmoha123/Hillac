import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/session";
import { canManagePortfolio } from "@/lib/portfolio/permissions";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxFileSize = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin || !canManagePortfolio(admin.role, "update")) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ message: "Image upload is not configured." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Image file is required." }, { status: 400 });
  }

  if (!allowedMimeTypes.has(file.type)) {
    return NextResponse.json({ message: "Only JPEG, PNG, WebP, and AVIF images are allowed." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ message: "Image must be 4 MB or smaller." }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "hillaac/portfolio";
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signaturePayload).digest("hex");
  const uploadData = new FormData();
  uploadData.set("file", file);
  uploadData.set("api_key", apiKey);
  uploadData.set("timestamp", String(timestamp));
  uploadData.set("folder", folder);
  uploadData.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: uploadData
  });

  const result = (await response.json()) as { secure_url?: string; public_id?: string; error?: { message?: string } };

  if (!response.ok || !result.secure_url) {
    console.error("Cloudinary upload failed:", result.error?.message || response.statusText);
    return NextResponse.json({ message: "Unable to upload image." }, { status: 502 });
  }

  return NextResponse.json({
    image: {
      url: result.secure_url,
      publicId: result.public_id || null
    }
  });
}
