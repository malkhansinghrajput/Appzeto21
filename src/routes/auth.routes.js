const express = require("express");

const router = express.Router();

const {
  register,
  login,
  refreshAccessToken,
  getMyProfile,
  updateProfile,
  logout,
} = require("../controllers/auth.controller");

const protect = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
  loginRateLimiter,
} = require("../middlewares/rateLimit.middleware");

const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");


// ================= AUTH ROUTES =================

router.post(
  "/register",
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  loginRateLimiter,
  loginValidator,
  validate,
  login
);

router.post(
  "/refresh",
  refreshAccessToken
);

router.get(
  "/me",
  protect,
  getMyProfile
);

router.put(
  "/me",
  protect,
  updateProfile
);

router.post(
  "/logout",
  protect,
  logout
);

module.exports = router;