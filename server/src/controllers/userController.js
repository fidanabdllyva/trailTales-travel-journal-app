
const { CLIENT_URL } = require("../config/config");
const bcrypt = require("bcrypt");
const formatMongoData = require("../utils/formatMongoData");
const { sendVerificationEmail } = require("../utils/mailService");
const { generateAccessToken } = require("../utils/jwt");
const { getAll, getOne, register, verifyEmail, forgotPassword, resetPassword, unlockAcc, login } = require("../services/userService");

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
    res.redirect(`${CLIENT_URL}/auth/login?message=${response.message}`);
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

    console.log("RESPONSE ON SERVER: ", response);

    // Set refresh token cookie (HttpOnly)
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/auth/refresh", 
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

    const accessToken = generateAccessToken({
      email: user.email,
      id: user._id,
      fullName: user.fullName,
    });
    return res.json({ accessToken });
  });
};

exports.logout = (_, res) => {
  res.clearCookie("refreshToken", { path: "/auth/refresh" });
  return res.status(200).json({ message: "logged out successfully!" });
};