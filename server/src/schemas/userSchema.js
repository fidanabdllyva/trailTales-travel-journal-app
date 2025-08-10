const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: { type: String },
        profileImage: {
            type: String,
            default:
                'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
        },
        public_id: {
            type: String,
        },
        premium: { type: Boolean, default: false },
        lists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TravelList",
            },
        ],
        isVerified: { type: Boolean, default: false },
        authProvider: {
            type: String,
            enum: ['google', 'local'],
            default: 'local',
            required: true,
        },
        authId: { type: String, default: null },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);
module.exports = userSchema;