import { ApiError } from "../utils/http.js";

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof ApiError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
      ...error.extra,
    });
  }

  if (error?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors)[0]?.message || "Invalid input.",
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "That record already exists.",
    });
  }

  console.error("[error]", error);
  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again.",
  });
}
