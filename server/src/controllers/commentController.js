const commentService = require("../services/commentService");

const createComment = async (req, res) => {
  try {
    const { journalEntryId, content } = req.body;
    const userId = req.user.id; 

    const comment = await commentService.createComment(
      journalEntryId,
      userId,
      content
    );

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { journalEntryId } = req.params;
    const comments = await commentService.getCommentsByJournal(journalEntryId);

    res.json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await commentService.deleteComment(id, userId);

    res.json({ message: "Comment deleted", deleted });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment,
};
