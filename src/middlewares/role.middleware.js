const ApiError = require("../utils/ApiError");

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(
        new ApiError(
          401,
          "Unauthorized. Please log in."
        )
      );
    }

    const userRole = String(req.user.role).trim().toLowerCase();
    const allowed = roles.some(
      (role) => String(role).trim().toLowerCase() === userRole
    );

    if (!allowed) {
      return next(
        new ApiError(
          403,
          "Access denied. Insufficient permissions."
        )
      );
    }

    next();
  };
};

module.exports = allowRoles;