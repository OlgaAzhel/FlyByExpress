const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const offerSchema = new Schema({
    direction: {
        type: String,
        required: true,
    },
    departureCity: {
        type: String,
        
        required: true,
        validate: {
            validator: function(input) {
                return input.length <= 50
            },
            message: "City name must be not longer than 50 characters"
        }
    },
    transitCity: {
        type:String,
        validate: {
            validator: function (input) {
                return input.length <= 50
            },
            message: "City name must be not longer than 50 characters"
        }
    },

    destinationCity: {
        type: String,
        required: true,
        validate: {
            validator: function (input) {
                return input.length <= 50
            },
            message: "City name must be not longer than 50 characters"
        }
    },
    departureDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return (
                    v && // check that there is a date object
                    v.getTime() > Date.now() + 24 * 60 * 60 * 1000 &&
                    v.getTime() < Date.now() + 365 * 24 * 60 * 60 * 1000
                );
            },
            message:
                "A departure must be not earlier than 1 day before and not later than 1 year after current date."
    }
    },

    cutoffDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return (
                    v && // check that there is a date object
                    v.getTime() <= this.departureDate.getTime() &&
                    v.getTime() >= Date.now()
                );
            },
            message:
                "A package accept last day must be not later than departure date and not eralier than current date."
        }
    },
    availDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return (
                    v && // check that there is a date object
                    v.getTime() >= this.departureDate.getTime() &&
                    v.getTime() <= this.departureDate.getTime() + 30 * 24 * 60 * 60 * 1000
                );
            },
            message:
                "Package arrived and available day must be not earlier than departure date and not later than 30 days after departure date."
        }
    },
    mail: Boolean,
    electronics: Boolean,
    info: {
        type:String,
        validate: {
            validator: function (input) {
                return input.length <= 200
            },
            message: "Additional info must be not longer than 50 characters"
        }
},
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
