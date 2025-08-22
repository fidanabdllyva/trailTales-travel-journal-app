const Comment = require("../models/commentModel");
const JournalEntry = require("../models/journalEntryModel");

const createComment = async (journalEntryId, userId, content) => {
  const comment = await Comment.create({
    content,
    author: userId,
    journalEntry: journalEntryId,
  });

  // Push the comment into journal entry
  await JournalEntry.findByIdAndUpdate(journalEntryId, {
    $push: { comments: comment._id },
  });

  return comment;
};

const getCommentsByJournal = async (journalEntryId) => {
  return await Comment.find({ journalEntry: journalEntryId })
    .populate("author", "username avatar")
    .sort({ createdAt: -1 });
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) throw new Error("Comment not found");
  if (comment.author.toString() !== userId.toString()) {
    throw new Error("Unauthorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  // Remove from journalEntry.comments
  await JournalEntry.findByIdAndUpdate(comment.journalEntry, {
    $pull: { comments: comment._id },
  });

  return comment;
};

module.exports = {
  createComment,
  getCommentsByJournal,
  deleteComment,
};
