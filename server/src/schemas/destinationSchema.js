const mongoose = require('mongoose');
const applyIdTransform = require("../utils/idTransform");
const imageSubSchema = require('./imageSubSchema');

const destinationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        datePlanned: { type: Date, required: true },
        dateVisited: { type: Date, default: null },
        status: {
            type: String,
            enum: ['wishlist', 'planned', 'completed', 'cancelled'],
            default: 'wishlist',
            required: true
        },
        notes: { type: String, trim: true, default: '' },
        images: [imageSubSchema],

        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TravelList',
            required: true,
        },
    }
    , { timestamps: true }
)

applyIdTransform(destinationSchema)

module.exports = destinationSchema;