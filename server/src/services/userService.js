const UserModel = require('../models/userModel');
const TravelListModel = require("../models/travelListModel");
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
const cloudinary = require("cloudinary").v2;

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 10 * 60 * 1000;


const getAll = async () => await UserModel.find()
  .populate('lists')
  .select("-password");

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
    username: user.username,
    profileImage: user.profileImage,
  }, "1d");
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

const updateUser = async (userId, updateData) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Fields that are allowed to be updated
    const allowedUpdates = [
      "fullName",
      "username",
      "bio",
      "location",
      "profileImage",
      "socialLinks",
      "password",
      "public_id"
    ];

    // Filter only allowed fields
    const filteredUpdates = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    if (filteredUpdates.username && filteredUpdates.username !== user.username) {
      const existingUser = await UserModel.findOne({ username: filteredUpdates.username });
      if (existingUser) {
        throw new Error("Username already taken");
      }
      user.username = filteredUpdates.username;
      delete filteredUpdates.username;
    }

    // Handle password hashing
    if (filteredUpdates.password) {
      const hashedPassword = await bcrypt.hash(filteredUpdates.password, 10);
      user.password = hashedPassword;
      delete filteredUpdates.password;
    }

    // Handle profile image change with Cloudinary
    if (filteredUpdates.profileImage && filteredUpdates.public_id) {
      if (user.public_id) {
        await cloudinary.uploader.destroy(user.public_id);
      }
      user.profileImage = filteredUpdates.profileImage;
      user.public_id = filteredUpdates.public_id;
      delete filteredUpdates.profileImage;
      delete filteredUpdates.public_id;
    }

    // Handle nested location update (merge instead of overwrite)
    if (filteredUpdates.location) {
      user.location = {
        ...user.location,
        ...filteredUpdates.location
      };
      delete filteredUpdates.location;
    }

    // Handle nested socialLinks update (merge instead of overwrite)
    if (filteredUpdates.socialLinks) {
      user.socialLinks = {
        ...user.socialLinks,
        ...filteredUpdates.socialLinks
      };
      delete filteredUpdates.socialLinks;
    }

    // Assign remaining simple fields
    Object.assign(user, filteredUpdates);

    await user.save();
    return user;
  } catch (error) {
    throw new Error(error?.message || "Error updating user");
  }
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash and set new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();
  return user;
};

const respondToCollaboratorRequest = async (userId, requestId, accept) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const request = user.collaboratorRequests.id(requestId);
  if (!request || request.status !== "pending") {
    return { success: false, message: "Request not found" };
  }

  if (accept) {
    const list = await TravelListModel.findById(request.travelList);
    if (!list) throw new Error("Travel list not found");

    // Add user to collaborators
    list.collaborators.push(userId);
    await list.save();

    request.status = "accepted";
  } else {
    request.status = "rejected";
  }

  await user.save();
  return { success: true, message: `Request ${accept ? "accepted" : "rejected"}` };
};

const getCollaboratorRequests = async (userId) => {
  const user = await UserModel.findById(userId)
    .populate({
      path: "collaboratorRequests.travelList",
      select: "title owner",
      populate: { path: "owner", select: "username fullName profileImage" }
    })
    .populate({
      path: "collaboratorRequests.fromUser", // 👈 populate fromUser too
      select: "username fullName profileImage email"
    });

  if (!user) throw new Error("User not found");

  // Filter only pending requests
  const pendingRequests = user.collaboratorRequests.filter(
    (req) => req.status === "pending"
  );

  return pendingRequests;
};


module.exports = {
  getAll,
  getOne,
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  unlockAcc,
  updateUser,
  changePassword,
  respondToCollaboratorRequest,
  getCollaboratorRequests
}