const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/jwt");

const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
};

module.exports = generateTokens;