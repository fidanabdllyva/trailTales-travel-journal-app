const travelListSchema = require('../schemas/travelListSchema');
const mongoose = require('mongoose');

const TravelListModel = mongoose.model('TravelList', travelListSchema);

module.exports = TravelListModel;