const rateLimit = require("express-rate-limit");

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  keyGenerator: (req /*, res */) => {
    return req.body?.email?.toLowerCase()?.trim() || req.ip;
  },

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

module.exports = {
  loginRateLimiter,
};