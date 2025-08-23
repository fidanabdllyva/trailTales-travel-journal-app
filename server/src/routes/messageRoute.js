const { Router } = require("express");
const { httpList, httpSendMessage } = require("../controllers/messageController");
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const requireAuth = require("../middlewares/authToken");
const upload = uploadMiddleware("images")
const messageRouter = Router();

// Fetch messages via query param or body
messageRouter.get("/groups/messages", requireAuth, httpList);

// Send message, chatId in body
// Send message with optional files (images/audio/video)
messageRouter.post(
    "/groups/send",
    requireAuth,
    upload.array("files"), 
    httpSendMessage
);

module.exports = messageRouter;
