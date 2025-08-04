const destinationSchema = require('../schemas/destinationSchema');
const mongoose = require('mongoose');

const DestinationModel = mongoose.model('Destination', destinationSchema);

module.exports = DestinationModel;