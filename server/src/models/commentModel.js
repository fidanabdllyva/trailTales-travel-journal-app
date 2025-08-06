const commentSchema = require('../schemas/commentSchema');
const mongoose = require('mongoose');

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;