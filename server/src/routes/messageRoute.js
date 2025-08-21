const { Router } = require("express");
const { httpList, httpSendMessage } = require("../controllers/messageController");

const requireAuth = require("../middlewares/authToken");

const messageRouter = Router();

// Fetch messages via query param or body
messageRouter.get("/groups/messages", requireAuth, httpList);

// Send message, chatId in body
messageRouter.post("/groups/send", requireAuth, httpSendMessage);

module.exports = messageRouter;
