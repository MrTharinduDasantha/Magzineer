// Thin wrappers around the Multer instance for the different upload scenarios
// in the Magzineer system. Keeps controllers clean and consistent.
import upload from "../configs/multer.config.js";

// Single image upload — used for profile photo, magazine cover, issue cover,
// article featured image, category image, etc.
export const uploadSingleImage = (fieldName) => upload.single(fieldName);

// Multiple image upload — useful if a future feature needs to upload several
// images at once (e.g. an article image gallery)
export const uploadMultipleImages = (fieldName, maxCount = 10) =>
  upload.array(fieldName, maxCount);

// Mixed fields upload — when a form has more than one named image field
// (e.g. simultaneous profile photo + cover image)
export const uploadFields = (fields) => upload.fields(fields);
