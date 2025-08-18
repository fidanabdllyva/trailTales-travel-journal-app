const chatSchema = require('../schemas/journalEntrySchema');
const mongoose = require('mongoose');

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = JournalEntryModel;