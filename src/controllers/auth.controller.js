const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const {
  registerService,
  loginService,
  refreshAccessTokenService,
  getMyProfileService,
  updateProfileService,
  logoutService,
} = require("../services/auth.service");


// ================= REGISTER =================

const register = asyncHandler(
  async (req, res) => {
    const result =
      await registerService(req.body);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Registration successful",
        {
          accessToken:
            result.accessToken,

          user: {
            _id:
              result.user._id,

            name:
              result.user.name,

            email:
              result.user.email,

            role:
              result.user.role,
          },
        }
      )
    );
  }
);


// ================= LOGIN =================

const login = asyncHandler(
  async (req, res) => {
    const { email, password } =
      req.body;

    const result =
      await loginService(
        email,
        password
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Login successful",
        {
          accessToken:
            result.accessToken,

          user: {
            _id:
              result.user._id,

            name:
              result.user.name,

            email:
              result.user.email,

            role:
              result.user.role,
          },
        }
      )
    );
  }
);


// ================= REFRESH TOKEN =================

const refreshAccessToken =
  asyncHandler(async (req, res) => {
    const refreshToken =
      req.cookies.refreshToken;

    const accessToken =
      await refreshAccessTokenService(
        refreshToken
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Access token refreshed",
        {
          accessToken,
        }
      )
    );
  });


// ================= GET PROFILE =================

const getMyProfile =
  asyncHandler(async (req, res) => {
    const user =
      await getMyProfileService(
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Profile fetched successfully",
        user
      )
    );
  });


// ================= UPDATE PROFILE =================

const updateProfile =
  asyncHandler(async (req, res) => {
    const updatedUser =
      await updateProfileService(
        req.user,
        req.body
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Profile updated successfully",
        updatedUser
      )
    );
  });


// ================= LOGOUT =================

const logout = asyncHandler(
  async (req, res) => {
    const accessToken =
      req.headers.authorization?.split(
        " "
      )[1];

    const refreshToken =
      req.cookies.refreshToken;

    await logoutService(
      accessToken,
      refreshToken
    );

    res.clearCookie(
      "refreshToken"
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Logout successful"
      )
    );
  }
);

module.exports = {
  register,
  login,
  refreshAccessToken,
  getMyProfile,
  updateProfile,
  logout,
};