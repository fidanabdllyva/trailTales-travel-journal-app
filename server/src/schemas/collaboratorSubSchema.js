const mongoose = require("mongoose");
const applyIdTransform = require("../utils/idTransform");

// Sub-schema for collaborator requests
const collaboratorRequestSchema = new mongoose.Schema({
  travelList: { type: mongoose.Schema.Types.ObjectId, ref: "TravelList" },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { _id: true }); // keep _id internally, transform will remove it

// Apply the id transform to the sub-schema
applyIdTransform(collaboratorRequestSchema);

module.exports=collaboratorRequestSchema