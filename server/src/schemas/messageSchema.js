const mongoose = require('mongoose');
const applyIdTransform = require("../utils/idTransform")

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TravelList",
    required: true,
  },
},{ timestamps: true });

applyIdTransform(messageSchema)

module.exports = messageSchema;
