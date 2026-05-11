// Standardized JSON response helpers — used by every controller to keep response shape consistent across the API

export const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  statusCode = 500,
  message = "Error",
  error = null,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
