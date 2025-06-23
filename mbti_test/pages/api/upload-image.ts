import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, type Fields, type Files } from "formidable";
import cloudinary from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rateLimit";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Parse form เป็น Promise
const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  const form = new IncomingForm({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    keepExtensions: true,
    multiples: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ Rate limit
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  // ✅ Method check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Parse form
    const { files } = await parseForm(req);
    const rawFile = files.file;
    const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

    // ✅ Validate file exists
    if (!file || typeof file !== "object" || typeof file.filepath !== "string") {
      console.warn("❌ Invalid file upload:", file);
      return res.status(400).json({ error: "Invalid file upload" });
    }

    // ✅ Optional: Validate mime type (กัน upload ไฟล์แปลก)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (file.mimetype && !allowedTypes.includes(file.mimetype)) {
      console.warn("❌ Unsupported file type:", file.mimetype);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // ✅ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: "profile_pics",
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    });

    if (!uploadResult.secure_url) {
      console.error("❌ Cloudinary upload failed:", uploadResult);
      return res.status(500).json({ error: "Cloud upload failed" });
    }

    console.log("✅ Upload success:", uploadResult.secure_url);

    return res.status(200).json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({
      error: "Upload failed",
      detail: err instanceof Error ? err.message : "Unknown server error",
    });
  }
}