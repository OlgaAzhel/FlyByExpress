const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const offerSchema = new Schema({
    direction: {
        type: String,
        required: true
    },
    departureCity: {
        type: String,
        required: true
    },
    transitCity: String,
    destinationCity: {
        type: String,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    cutoffDate: {
        type: Date,
        required: true
    },
    availDate: {
        type: Date,
        required: true
    },
    mail: Boolean,
    electronics: Boolean,
    info: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: String,
    userAvatar: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }]

}, {
    timestamps: true
});



module.exports = mongoose.model('Offer', offerSchema)
