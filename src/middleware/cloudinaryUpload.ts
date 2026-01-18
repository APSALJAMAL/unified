import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
      const isVideo = file.mimetype.startsWith("video");
  
      return {
        folder: "issue_reports",
        resource_type: isVideo ? "video" : "image",
        format: undefined, // keep original format
      };
    },
  });
  
  export const upload = multer({
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });