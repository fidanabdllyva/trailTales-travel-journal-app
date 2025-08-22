const mongoose = require("mongoose");
const applyIdTransform = require("../utils/idTransform")

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    journalEntry: { type: mongoose.Schema.Types.ObjectId, ref: "JournalEntry", required: true },
}, { timestamps: true });

applyIdTransform(commentSchema)

module.exports = commentSchema;