const mongoose = require("mongoose")
const applyIdTransform = require("../utils/idTransform")

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", index: true, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: {
      text: { type: String },
      imageUrl: { type: String },
      fileUrl: { type: String },
      fileName: { type: String },
      audioUrl: { type: String },
    },
    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    clientId: { type: String, index: true },
  },
  { timestamps: true }
);

applyIdTransform(messageSchema)

module.exports= messageSchema;