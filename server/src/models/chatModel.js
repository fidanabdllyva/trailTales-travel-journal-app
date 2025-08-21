const chatSchema = require('../schemas/chatSchema');
const mongoose = require('mongoose');

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;