const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
    name: String,
    googleId: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    additionalContact: String,
    avatar: String,
    reviewsReceived: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    reviewsCreated: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    offers: [{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    }],
    rating: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);