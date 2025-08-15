const mongoose = require("mongoose");
const applyIdTransform = require("../utils/idTransform");

const imageSubSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true }
}, { _id: true });

applyIdTransform(imageSubSchema);

module.exports = imageSubSchema;
