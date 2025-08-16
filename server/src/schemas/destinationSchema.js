const mongoose = require('mongoose');
const applyIdTransform = require("../utils/idTransform");
const imageSubSchema = require('./imageSubSchema');

const destinationSchema = new mongoose.Schema(
    {
        location: {
            country: { type: String, required:true  },
            city: { type: String, required:true  },
        },
        datePlanned: { type: Date},
        dateVisited: { type: Date, default: null },
        status: {
            type: String,
            enum: ['wishlist', 'planned', 'completed', 'cancelled'],
            default: 'wishlist',
            required: true
        },
        notes: { type: String, trim: true, default: '' },
        image: imageSubSchema,

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