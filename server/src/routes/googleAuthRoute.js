const router = require("express").Router();
const passport = require("passport");
const { CLIENT_URL } = require("../config/config");
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
    });

    res.redirect(`${CLIENT_URL}/success/${accessToken}`);
  })(req, res, next);
});

module.exports = router;
