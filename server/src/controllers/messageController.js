const { listGroupMessages, sendMessage } = require("../services/messageService");

async function httpList(req, res) {
  try {
    const { chatId, cursor, limit } = req.query;
    if (!chatId) return res.status(400).json({ message: "chatId is required" });

    const data = await listGroupMessages(chatId, cursor, Number(limit || 30));
    res.json(data);
  } catch (e) {
    console.error("httpList error", e);
    res.status(500).json({ error: "Server error" });
  }
}


async function httpSendMessage(req, res) {
  try {
    // FIX: get chatId from body, not req.chatId
    const { chatId, text, clientId, files } = req.body;
    const authorId = req.user && req.user.id;

    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

    if (!text?.trim() && (!files || files.length === 0)) {
      return res.status(400).json({ message: "Empty message" });
    }

    const msg = await sendMessage({ chatId, authorId, text, clientId, files });

    // Emit via Socket.IO
    const io = req.app.get("io");
    if (io) io.to(chatId).emit("message:new", msg);

    res.json({ ok: true, message: msg });
  } catch (e) {
    console.error("httpSendMessage error", e);
    res.status(500).json({ ok: false, message: e?.message || "Server error" });
  }
}

module.exports = { httpList, httpSendMessage };
