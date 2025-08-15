const mongoose = require("mongoose");
const applyIdTransform = require("../utils/idTransform");
const imageSubSchema = require("./imageSubSchema");

const journalEntrySchema = new mongoose.Schema({

  title: { type: String, required: true, trim: true },

  content: { type: String, required: true, trim: true },

  photos: [imageSubSchema],
  likes: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      }
    ],
    default: [],
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },

  destination: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "Destination",

    required: true,

  },

  author: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,

  },

  public: { type: Boolean, default: false },

}, { timestamps: true });

applyIdTransform(journalEntrySchema)

module.exports = journalEntrySchema;