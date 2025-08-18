const mongoose = require("mongoose");
const applyIdTransform = require("../utils/idTransform");

const travelListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, default: [] },
    isPublic: { type: Boolean, default: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    coverImage: { type: String, required: true },
    public_id: { type: String },
    destinations: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Destination",
      validate: {
        validator: function (v) {
          return v && v.length > 0; 
        },
        message: "At least one destination is required",
      },
      required: true,
    },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", default: null },
  },
  { timestamps: true }
);

applyIdTransform(travelListSchema);

module.exports = travelListSchema;
