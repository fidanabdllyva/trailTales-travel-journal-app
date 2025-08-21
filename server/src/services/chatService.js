const mongoose = require("mongoose");
const TravelList = require("../models/travelListModel");
const Chat = require("../models/chatModel");

async function enableChat(listId, userId) {
  const list = await TravelList.findById(listId).lean();
  if (!list) return { success: false, message: "Travel list not found" };

  const isOwner = String(list.owner) === String(userId);
  const isCollaborator = (list.collaborators || []).some(
    (id) => String(id) === String(userId)
  );

  if (!isOwner && !isCollaborator) {
    return { success: false, message: "Only owner/collaborators can enable chat" };
  }

  if (!list.collaborators || list.collaborators.length < 1) {
    return { success: false, message: "Add at least one collaborator to enable chat" };
  }

  if (list.chat) {
    return { success: true, data: { chat: list.chat }, message: "Chat already enabled" };
  }

  const uniqueMembers = Array.from(
    new Set([String(list.owner), ...(list.collaborators || []).map(String)])
  ).map((id) => new mongoose.Types.ObjectId(id));

  const chat = await Chat.create({
    name: list.title,
    members: uniqueMembers,
    admins: [list.owner],
    listId,
  });

  await TravelList.findByIdAndUpdate(listId, { chat: chat._id });

  return { success: true, data: { chat: chat._id }, message: "Chat enabled" };
}

module.exports = { enableChat };
