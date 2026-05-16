const jwt = require("jsonwebtoken");

const User = require("../models/User");
const BlacklistToken = require("../models/BlacklistToken");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization || "";

  if (typeof authHeader === "string") {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  if (!token && req.cookies) {
    token = req.cookies.accessToken || req.cookies.token;
  }

  if (!token) {
    throw new ApiError(
      401,
      "No token provided. Please log in."
    );
  }

  const blacklistedToken = await BlacklistToken.findOne({
    token,
  });

  if (blacklistedToken) {
    throw new ApiError(
      401,
      "Token is invalid or expired"
    );
  }

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(
      401,
      "Token is invalid or expired"
    );
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  if (!user.isActive) {
    throw new ApiError(
      401,
      "Your account has been blocked"
    );
  }

  req.user = user;

  next();
});

module.exports = protect;