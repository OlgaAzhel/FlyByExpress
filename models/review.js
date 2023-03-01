const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    communication: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    cost: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    overall: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    offer: {
        type: Schema.Types.ObjectId,
        ref: 'Offer',
    },

    offerCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: String,
    userAvatar: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);