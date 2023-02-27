const User = require('../models/user');
const Offer = require('../models/offer');
const Review = require('../models/review')

module.exports = {
    create,
    // delete: deleteReview
};

function create(req, res) {
    console.log("REVIEW CREATING RUNNING..", )
    console.log("REQUEST PARAMS:", req.params )
    console.log("REQUEST USER:", req.user )
    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;

    Offer.findById(req.params.id, function (err, offer) {
        console.log("OFFER CREATOR", offer.creator)
        console.log("OFFER", offer)
        req.body.offer = offer
        const review = new Review(req.body)
        review.save(function (err) {
            if (err) return res.redirect('/offers')
        });
        console.log("REVIEW", review)

        /// Adding review into offerCreator's reviews array
        User.findById(offer.creator._id, function(err, offerCreator) {
            offerCreator.reviewsReceived.push(review)
            offerCreator.save(function(err){
                console.log("Add review to offerCreator")
            })
        })
        req.user.reviewsCreated.push(review)
        req.user.save(function (err) {
        })

        /// Adding reviews into offer array
        offer.reviews.push(review);
        offer.save(function (err) {
            console.log("Offer reviews updated")
        });

        console.log("HERE!!!!!!!!!!!!!!!")
        
    })
    


}