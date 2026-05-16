const jwt = require("jsonwebtoken");

const User = require("../models/User");

const RefreshToken = require("../models/RefreshToken");

const BlacklistToken = require("../models/BlacklistToken");

const ApiError = require("../utils/ApiError");

const generateTokens = require("../utils/generateTokens");


// ================= REGISTER SERVICE =================

const registerService = async (payload) => {
  const {
    name,
    email,
    password,
    role,
    companyName,
    skills,
    resumeUrl,
  } = payload;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "Email already registered"
    );
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    companyName,
    skills,
    resumeUrl,
  });

  const {
    accessToken,
    refreshToken,
  } = generateTokens(user);

  await RefreshToken.create({
    user: user._id,

    token: refreshToken,

    expiresAt: new Date(
      Date.now() +
        7 * 24 * 60 * 60 * 1000
    ),
  });

  return {
    accessToken,
    refreshToken,
    user,
  };
};


// ================= LOGIN SERVICE =================

const loginService = async (
  email,
  password
) => {
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      401,
      "Your account has been blocked"
    );
  }

  const isPasswordMatched =
    await user.comparePassword(
      password
    );

  if (!isPasswordMatched) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const {
    accessToken,
    refreshToken,
  } = generateTokens(user);

  await RefreshToken.create({
    user: user._id,

    token: refreshToken,

    expiresAt: new Date(
      Date.now() +
        7 * 24 * 60 * 60 * 1000
    ),
  });

  return {
    accessToken,
    refreshToken,
    user,
  };
};


// ================= REFRESH ACCESS TOKEN =================

const refreshAccessTokenService =
  async (refreshToken) => {
    if (!refreshToken) {
      throw new ApiError(
        401,
        "Refresh token not found"
      );
    }

    const existingToken =
      await RefreshToken.findOne({
        token: refreshToken,
      });

    if (!existingToken) {
      throw new ApiError(
        401,
        "Invalid refresh token"
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env
          .REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      throw new ApiError(
        401,
        "Refresh token expired"
      );
    }

    const user =
      await User.findById(
        decoded.id
      );

    if (
      !user ||
      !user.isActive
    ) {
      throw new ApiError(
        401,
        "User not found or blocked"
      );
    }

    const accessToken =
      require("../config/jwt").generateAccessToken(
        user
      );

    return accessToken;
  };


// ================= GET PROFILE =================

const getMyProfileService =
  async (userId) => {
    const user =
      await User.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    return user;
  };


// ================= UPDATE PROFILE =================

const updateProfileService =
  async (user, payload) => {
    const allowedFields = [
      "name",
      "skills",
      "resumeUrl",
      "companyName",
    ];

    allowedFields.forEach(
      (field) => {
        if (
          payload[field] !==
          undefined
        ) {
          user[field] =
            payload[field];
        }
      }
    );

    await user.save();

    return user;
  };


// ================= LOGOUT =================

const logoutService = async (
  accessToken,
  refreshToken
) => {
  if (accessToken) {
    const decoded =
      jwt.decode(accessToken);

    if (decoded?.exp) {
      await BlacklistToken.create(
        {
          token: accessToken,

          expiresAt:
            new Date(
              decoded.exp *
                1000
            ),
        }
      );
    }
  }

  if (refreshToken) {
    await RefreshToken.deleteOne({
      token: refreshToken,
    });
  }

  return true;
};

module.exports = {
  registerService,
  loginService,
  refreshAccessTokenService,
  getMyProfileService,
  updateProfileService,
  logoutService,
};