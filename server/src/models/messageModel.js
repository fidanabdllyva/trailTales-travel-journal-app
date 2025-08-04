const messageSchema = require('../schemas/messageSchema');
const mongoose = require('mongoose');
const MessageModel = mongoose.model('Message', messageSchema);
module.exports = MessageModel;