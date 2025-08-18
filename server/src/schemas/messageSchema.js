import mongoose from "mongoose";
const applyIdTransform = require("../utils/idTransform")

const messageSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", index: true, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: {
      text: String,
      files: [{ url: String, name: String, size: Number }]
    },
    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    clientId: { type: String, index: true },
  },
  { timestamps: true }
);

applyIdTransform(messageSchema)

export default messageSchema;