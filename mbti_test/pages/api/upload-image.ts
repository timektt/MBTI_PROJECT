// pages/api/upload-image.ts
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided." });

  try {
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: "profile_pics",
    });

    return res.status(200).json({ url: uploadResponse.secure_url });
  } catch (err) {
    return res.status(500).json({ error: "Upload failed", detail: err });
  }
}
