const userSchema = require('../schemas/userSchema');
const mongoose = require('mongoose');

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
