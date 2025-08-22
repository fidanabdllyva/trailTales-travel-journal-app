
const { CLIENT_URL, NODE_ENV, JWT_REFRESH_SECRET_KEY, DEFAULT_AVATAR_URL } = require("../config/config");
const bcrypt = require("bcrypt");
const formatMongoData = require("../utils/formatMongoData");
const { sendVerificationEmail } = require("../utils/mailService");
const { generateAccessToken } = require("../utils/jwt");
const { getAll, getOne, register, verifyEmail, forgotPassword,getCollaboratorRequests: getCollaboratorRequestsService, respondToCollaboratorRequest: respondToCollaboratorRequestService , resetPassword,changePassword: changePasswordService, unlockAcc, login, updateUser: updateUserService } = require("../services/userService");

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Only allow users to update their own profile
    if (userId !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    const updateData = { ...req.body };

    // Handle resetting to default photo
    if (req.body.resetToDefault === "true") {
      updateData.profileImage = DEFAULT_AVATAR_URL;
      updateData.public_id = null;
    }
    // Handle uploaded file
    else if (req.file && req.file.path) {
      updateData.profileImage = req.file.path;
      updateData.public_id = req.file.filename;
    }

    const updatedUser = await updateUserService(userId, updateData);

    res.status(200).json({
      message: "User updated successfully",
      data: formatMongoData(updatedUser),
    });
  } catch (error) {
    console.error(error); // log for debugging

    // Handle known errors
    if (error.message === "Username already taken") {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }

    // Fallback for unexpected errors
    next(error)
  }
};


exports.getAllUsers = async (_, res, next) => {
  try {
    const users = await getAll();
    res.status(200).json({
      message: "users retrieved successfully!",
      data: formatMongoData(users),
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getOne(id);
    if (!user) {
      res.status(404).json({
        message: "no such user found!",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "user retrieved successfully!",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await this.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        message: "no such user with given email",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "user retrieved successfully!",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    //password hash
    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const response = await register({
      ...req.body,
      password: hashedPassword,
      authProvider: "local",

    });
    if (!response.success) {
      throw new Error(response.message);
    }

    //send email service ...
    const token = generateAccessToken(
      {
        id: response.data._id,
        email: req.body.email,
        fullName: req.body.fullName,

      },
      "6h"
    );
    const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;
    sendVerificationEmail(req.body.email, req.body.fullName, verificationLink);

    res.status(201).json({
      message: "user registered successfully | verify your email",
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const response = await verifyEmail(token);

    res.redirect(`${CLIENT_URL}/email-verified?message=${response.message}`);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await forgotPassword(email);
    res.status(200).json({
      message: "reset password email was sent!",
    });
  } catch (error) {
    res.json({
      message: error.message || "internal server error",
      statusCode: 401,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, email } = req.body;
    await resetPassword(newPassword, email);
    //redirect to login page
    res.status(200).json({
      message: "password reset successfully!",
    });

  } catch (error) {
    next(error);
  }
};

exports.unlockAccount = async (req, res, next) => {
  try {
    const { token } = req.query;
    const response = await unlockAcc(token); //success, message
    res.redirect(`${CLIENT_URL}/?message=${response.message}`);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };
    const response = await login(credentials);



    // Set refresh token cookie (HttpOnly)
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return res.status(200).json({
      message: response.message,
      accessToken: response.accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message || "internal server error",
      statusCode: 401,
    });
  }
};

exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "no token provided!" });
  }

  jwt.verify(token, JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "invalid or expired token!" });
    }

    const user = await getOne(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "invalid or expired token!" });
    }

    // Generate new tokens
    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      profileImage: user.profileImage,
    });

    const newRefreshToken = generateRefreshToken({ id: user._id });

    // Send new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return res.json({ accessToken });
  });
};


exports.logout = (_, res) => {
  res.clearCookie("refreshToken", {
    path: "/", // matches the set cookie
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true
  });
  return res.status(200).json({ message: "logged out successfully!" });
};


exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await getOne(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Current user retrieved successfully",
      data: formatMongoData(user),
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const { currentPassword, newPassword } = req.body;

    const updatedUser = await changePasswordService(userId, currentPassword, newPassword);

    res.status(200).json({
      message: "Password updated successfully",
      data: formatMongoData(updatedUser),
    });
  } catch (error) {
    if (error.message === "Current password is incorrect") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.respondToCollaboratorRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;
    const { accept } = req.body;

    const response = await respondToCollaboratorRequestService(userId, requestId, accept);
    if (!response.success) {
      return res.status(404).json({ message: response.message });
    }

    res.status(200).json({
      message: response.message,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCollaboratorRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const requests = await getCollaboratorRequestsService(userId);

    res.status(200).json({
      message: "collaborator requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};