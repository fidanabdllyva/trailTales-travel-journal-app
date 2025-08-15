const express = require("express");
const {
  registerUser,
  getAllUsers,
  verifyEmail,
  unlockAccount,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateUser,
  changePassword,
  respondToCollaboratorRequest,
  getCollaboratorRequests
} = require("../controllers/userController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const authToken = require("../middlewares/authToken");

const router = express.Router();

const upload = uploadMiddleware("userImages");

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.get("/unlock-account", unlockAccount);
router.get("/users", getAllUsers);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authToken, getCurrentUser);
router.patch("/change-password", authToken, changePassword);
router.get("/collaborator-requests", authToken, getCollaboratorRequests);
router.post("/collaborator-requests/:requestId/respond", authToken, respondToCollaboratorRequest);


router.patch("/:id", authToken, upload.single("profileImage"), updateUser);

module.exports = router;