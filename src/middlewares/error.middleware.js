const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

  let errors = err.errors || [];

  // Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;

    message = "Invalid ID format";
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 422;

    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));

    message = "Validation failed";
  }

  // JWT Errors
  if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;

    message = "Token is invalid or expired";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};

module.exports = errorMiddleware;