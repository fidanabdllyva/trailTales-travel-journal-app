const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authToken = require("../middlewares/authToken");

// Get comments for a journal entry
router.get("/:journalEntryId", commentController.getComments);

// Protected routes
router.use(authToken);

// Create a comment
router.post("/", commentController.createComment);

// Delete a comment
router.delete("/:id", commentController.deleteComment);

module.exports = router;
