const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userModel");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } = require("./config");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // 1. If already registered with Google → log them in
        const existingGoogleUser = await UserModel.findOne({
          authId: profile.id,
          authProvider: "google",
        });
        if (existingGoogleUser) {
          return done(null, existingGoogleUser);
        }

        // 2. If email exists but with local auth → stop login
        const email = profile.emails?.[0]?.value;
        const localUser = await UserModel.findOne({ email, authProvider: "local" });
        if (localUser) {
          return done(new Error("EMAIL_EXISTS_LOCAL"), false);
        }

        // 3. Otherwise → create a new Google user
        const newUser = await UserModel.create({
          fullName: profile.displayName,
          email,
          username: email.split("@")[0],
          profileImage: profile.photos?.[0]?.value,
          authId: profile.id,
          authProvider: "google",
          isVerified: true,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});
