// Centralized error-handling middleware
// Catches errors thrown anywhere in the request pipeline and returns a
// consistent JSON response
import multer from "multer";

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Handle Multer-specific upload errors (file too big, unexpected field, etc.)
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5 MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  // Handle our custom Multer fileFilter rejection
  if (err.message?.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose validation errors (e.g. required field missing, enum mismatch)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: messages,
    });
  }

  // Mongoose duplicate-key error (e.g. unique email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists.`,
    });
  }

  // Mongoose cast error (e.g. malformed ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Fallback — generic server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
};

export default errorHandler;
