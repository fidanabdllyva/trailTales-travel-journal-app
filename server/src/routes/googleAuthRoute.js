const router = require("express").Router();
const passport = require("passport");
const { CLIENT_URL, NODE_ENV } = require("../config/config");
const jwt = require("../utils/jwt");

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) {
      if (err.message === "EMAIL_EXISTS_LOCAL") {
        return res.redirect(`${CLIENT_URL}/?error=local_account_exists`);
      }
      return res.redirect(`${CLIENT_URL}/?error=google_failed`);
    }

    if (!user) {
      return res.redirect(`${CLIENT_URL}/?error=google_failed`);
    }

    // Generate JWT token
    const accessToken = jwt.generateAccessToken({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      passportImage: user.profileImage,
    });

    const refreshToken = jwt.generateRefreshToken({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    });

    // Set HttpOnly cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production", // false in dev, true in prod
      sameSite: NODE_ENV === "production" ? "none" : "lax", // none for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // send cookie to all paths
    });


    res.redirect(`${CLIENT_URL}/success/${accessToken}`);
  })(req, res, next);
});

module.exports = router;
