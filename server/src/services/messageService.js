const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

/**
 * List messages with cursor-based pagination
 */
async function listGroupMessages(chatId, cursor, limit = 30) {
  const filter = { chat: chatId };
  if (cursor) filter._id = { $lt: cursor };

  const items = await Message.find(filter)
    .sort({ _id: -1 })
    .limit(Math.min(100, Number(limit)))
    .populate("author", "username profileImage");

  return {
    items: items.reverse(),
    nextCursor: items.length ? items[0]._id : null,
  };
}

/**
 * Send a message in a chat
 */
async function sendMessage({ chatId, authorId, text, clientId, files }) {
  const msg = await Message.create({
    chat: chatId,
    author: authorId,
    body: { text: String(text).slice(0, 5000), files },
    clientId,
    readBy: [authorId],
  });

  await Chat.findByIdAndUpdate(chatId, { lastMessage: msg._id });

  return msg.populate("author", "username profileImage");
}

module.exports = { listGroupMessages, sendMessage };
