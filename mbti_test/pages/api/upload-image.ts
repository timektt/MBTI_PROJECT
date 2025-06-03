// ✅ /pages/api/upload-image.ts

import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rateLimit";
import { UploadImageSchema } from "@/lib/schema"; // ✅ เพิ่ม schema validation

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  // ✅ Validate req.body
  const parseResult = UploadImageSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { imageBase64 } = parseResult.data;

  try {
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: "profile_pics",
    });

    return res.status(200).json({ url: uploadResponse.secure_url });
  } catch (err) {
    return res.status(500).json({ error: "Upload failed", detail: err });
  }
}
