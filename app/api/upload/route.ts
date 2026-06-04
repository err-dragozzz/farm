import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireUser } from "@/lib/api";

export async function POST(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;

  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File is required" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Max file size is 5MB" }, { status: 413 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only images are supported" }, { status: 415 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({
      url: "https://cxtsxyhlfibzdwoowiba.supabase.co/rest/v1/",
      message: "Cloudinary credentials are not configured. Add them to enable production image uploads."
    });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "farmledger";
  const signature = crypto.createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("folder", folder);
  body.append("signature", signature);

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
  if (!upload.ok) return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  const result = await upload.json();
  return NextResponse.json({ url: result.secure_url });
}
