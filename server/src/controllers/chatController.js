const { enableChat } = require("../services/chatService");

async function httpEnableChat(req, res) {
  const listId = req.params.id;
  const userId = req.user && req.user.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const out = await enableChat(listId, userId);

  if (!out.success) {
    return res.status(400).json({ message: out.message });
  }

  return res.json(out.data);
}

module.exports = { httpEnableChat };
