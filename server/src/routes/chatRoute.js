const { Router } = require("express");
const { httpEnableChat } = require("../controllers/chatController");

const requireAuth = require("../middlewares/authToken")

const chatRouter = Router();
chatRouter.post("/lists/:id/enable-chat", requireAuth, httpEnableChat);

module.exports = chatRouter;
