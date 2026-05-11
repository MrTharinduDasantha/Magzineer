// Multer configuration for handling multipart/form-data file uploads
// Uses memory storage so files can be streamed directly to Cloudinary
import multer from "multer";

// Store uploaded files in memory (as Buffer) — not on disk
const storage = multer.memoryStorage();

// Allowed image MIME types for uploads (profile photos, covers, featured images, category images)
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// File filter — reject any file that is not an allowed image type
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF are allowed.",
      ),
      false,
    );
  }
};

// Configured Multer instance — 5 MB file size limit per upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;
