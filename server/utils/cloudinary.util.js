// Cloudinary helpers — upload buffers from Multer (memory storage) and delete previously uploaded images by their public_id
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/**
 * Upload an image buffer to Cloudinary.
 * @param {Buffer} buffer - file.buffer from a Multer memory-storage upload
 * @param {string} folder - target Cloudinary folder (e.g. "magzineer/articles")
 * @returns {Promise<{url:string, publicId:string}>}
 */
export const uploadToCloudinary = (buffer, folder = "magzineer") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    // Pipe the in-memory buffer into the Cloudinary upload stream
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Delete an image from Cloudinary by its public_id.
 * Safe to call with an empty/undefined publicId — it simply no-ops.
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message);
  }
};

export default cloudinary;
