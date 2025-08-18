import mongoose from "mongoose";
const applyIdTransform = require("../utils/idTransform")

const chatSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
        groupProfileImage: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/previews/026/019/617/non_2x/group-profile-avatar-icon-default-social-media-forum-profile-photo-vector.jpg"
        },
        public_id: { type: String },
        description: { type: String },
        admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TravelList',
            required: true,
        },
        lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
    },
    { timestamps: true }
);

applyIdTransform(chatSchema)

export default chatSchema;