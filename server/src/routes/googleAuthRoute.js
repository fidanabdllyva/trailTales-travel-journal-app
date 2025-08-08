const router = require("express").Router();
const passport = require("passport");
const { CLIENT_URL } = require("../config/config");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/?error=google_failed`,
    session: false,
  }),
  (req, res) => {
    const jwt = require("../utils/jwt");
    const accessToken = jwt.generateAccessToken({
      id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
    });
 


    res.redirect(`${CLIENT_URL}/success/${accessToken}`);
  }
);

module.exports = router;