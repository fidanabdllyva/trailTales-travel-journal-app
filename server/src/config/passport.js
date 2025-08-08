const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userModel");
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SERVER_URL,
} = require("./config");

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: `${SERVER_URL}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await UserModel.findOne({ authId: profile.id, authProvider: "google"});

                if (existingUser) {
                    return done(null, existingUser);
                }

                // Check if email already exists from local provider
                const emailTaken = await UserModel.findOne({
                    email: profile.emails[0].value,
                });
                if (emailTaken) {
                    return done(null, false, {
                        message: "Email is already used with local auth.",
                    });
                }

                const newUser = await UserModel.create({
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.emails[0].value.split("@")[0],
                    profileImage: {
                        url: profile.photos?.[0].value
                    },
                    authId: profile.id,
                    authProvider: "google",
                    isVerified: true,
                });

                done(null, newUser);
            } catch (error) {
                done(error, false);
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