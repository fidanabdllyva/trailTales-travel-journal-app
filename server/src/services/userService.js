const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const {
  verifyAccessToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");
const {
  sendUnlockAccountEmail,
  sendForgotPasswordEmail,
} = require("../utils/mailService");
const { CLIENT_URL } = require("../config/config");

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 10 * 60 * 1000;


const getAll = async () => await UserModel.find().select("-password");

const getOne = async (id) => await UserModel.findById(id).select("-password");

const register = async (payload) => {
  try {
    const { email, username } = payload;
    const existedUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existedUser) {
      return {
        success: false,
        message: "username or email already taken!",
      };

    }
    else if (payload.authProvider !== "local") {
      return {
        success: false,
        message: "authProvider should be local for registration!",
      };
    }
    else {
      return {
        success: true,
        data: await UserModel.create(payload),
      };
    }
  } catch (error) {
    return error.message || "internal server error!";
  }
};

const verifyEmail = async (token) => {
  const isValidToken = verifyAccessToken(token);
  if (isValidToken) {
    const { id } = isValidToken;
    const user = await UserModel.findById(id);
    if (user.isVerified) {
      return {
        success: false,
        message: "Email already has been verified",
      };
    } else {
      user.isVerified = true;
      await user.save();
      return {
        success: true,
        message: "Email has been verified successfully!",
      };
    }
  } else {
    throw new Error("invalid or expired token!");
  }
};

const unlockAcc = async (token) => {
  const isValidToken = verifyAccessToken(token);
  if (isValidToken) {
    const { id } = isValidToken;
    const user = await UserModel.findById(id);
    if (user.loginAttempts >= 3) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
      return {
        message: "account has been unlock manually successfully!",
      };
    } else {
      return {
        message: "account already has been unlocked!",
      };
    }
  } else {
    throw new Error("invalid or expired token!");
  }
};

const login = async (credentials) => {
  const { email, password } = credentials;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials!");
  }

  //is verified
  if (!user.isVerified) {
    throw new Error("email should be verified first!");
  }

  // Check if banned
  if (user.isBanned) {
    if (!user.banUntil || new Date(user.banUntil) > new Date()) {
      throw new Error("You are banned from logging in.");
    } else {
      // Ban has expired, remove it
      user.isBanned = false;
      user.banUntil = null;
      await user.save();
    }
  }

  // Check if locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    const unlockTime = new Date(user.lockUntil).toLocaleString();
    throw new Error(`Account is locked. Try again after ${unlockTime}.`);
  }

  //check user provider (local or email)
  if (user.authProvider !== "local") {
    throw new Error(
      "this account has been created with Google, try Sign In with Google!"
    );
  }

  // Validate password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
      await user.save();
      //send email to user to unlock their account
      const token = generateAccessToken(
        {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
        "6h"
      );
      const unlockAccountLink = `${process.env.SERVER_URL}/auth/unlock-account?token=${token}`;
      sendUnlockAccountEmail(user.email, user.fullName, unlockAccountLink);
      throw new Error(
        "Too many login attempts. Account locked for 10 minutes (check your email)"
      );
    }

    await user.save();
    throw new Error("Invalid credentials!");
  }
  //check user provider

  // Success: reset loginAttempts, lockUntil, update lastLogin
  user.loginAttempts = 0;
  user.lockUntil = null;
  user.lastLogin = new Date();

  await user.save();
  //implement refresh token
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    profileImage: user.profileImage,
    premium: user.premium,
    authProvider: user.authProvider,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({
    email: user.email,
    id: user._id,
    fullName: user.fullName,
  });

  return {
    message: "login successful",
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const forgotPassword = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("email does not exist!");
  } else {
    const token = generateAccessToken(
      {
        id: user._id,
        email: user.email,
      },
      "30m"
    );
    const resetPasswordLink = `${CLIENT_URL}/reset-password/${token}`;
    sendForgotPasswordEmail(email, resetPasswordLink);
  }
};

const resetPassword = async (newPassword, email) => {
  const user = await UserModel.findOne({ email: email });
  if (!user) throw new Error("user not found!");

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = hashedPassword;
  await user.save();
  return user
}

module.exports = {
  getAll,
  getOne,
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  unlockAcc,
}