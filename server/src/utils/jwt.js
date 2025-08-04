const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
} = require("../config/config");

// Generate Access Token
const generateAccessToken = (payload, expiresIn = "15m") => {
  return jwt.sign(payload, JWT_ACCESS_SECRET_KEY, { expiresIn });
};

// Generate Refresh Token
const generateRefreshToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_REFRESH_SECRET_KEY, { expiresIn });
};

// Verify Access Token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET_KEY);
  } catch (err) {
    return null;
  }
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET_KEY);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};