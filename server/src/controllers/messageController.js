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

// controllers/messageController.js

async function httpSendMessage(req, res) {
  try {
    const { chatId, text, clientId } = req.body;
    const authorId = req.user?.id;

    if (!chatId) return res.status(400).json({ message: "chatId is required" });

    // Handle uploaded files
    const files = (req.files || []).map((file) => {
      if (file.mimetype.startsWith("image")) return { type: "image", url: `/uploads/${file.filename}` };
      if (file.mimetype.startsWith("audio")) return { type: "audio", url: `/uploads/${file.filename}` };
      return { type: "file", url: `/uploads/${file.filename}`, name: file.originalname };
    });

    if (!text?.trim() && files.length === 0) {
      return res.status(400).json({ message: "Empty message" });
    }

    // Transform files to match MessageBody structure
    const body = {
      text: text?.trim() || undefined,
    };
    files.forEach((f) => {
      if (f.type === "image") body.imageUrl = f.url;
      if (f.type === "audio") body.audioUrl = f.url;
      if (f.type === "file") {
        body.fileUrl = f.url;
        body.fileName = f.name;
      }
    });

    const msg = await sendMessage({ chatId, authorId, body, clientId });

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
