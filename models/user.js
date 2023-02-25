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
    delivery: {
        type: Schema.Types.ObjectId,
        // ref: 'Delivery',
        // required: true
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

const userSchema = new Schema({
    name: String,
    googleId: {
        type: String,
        required: true
    },
    email: String,
    avatar: String,
    reviews: [reviewSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);