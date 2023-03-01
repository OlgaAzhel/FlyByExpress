const User = require('../models/user');
const Offer = require('../models/offer');
const Review = require('../models/review')

module.exports = {
    create,
    delete: deleteReview
};

function create(req, res) {

    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;

    Offer.findById(req.params.id, function (err, offer) {
        req.body.offer = offer
        req.body.offerCreator = offer.creator
        const review = new Review(req.body)
        review.save(function (err) {
            if (err) return res.redirect('/offers')
        });
        console.log("REVIEW", review)
    })
    
}

function deleteReview(req,res) {
    console.log(req.body)
    console.log(req.params.id)
    Review.deleteOne({_id:req.params.id}, function(err) {
        console.log("deleteng review........")
        res.redirect(`/offers/${req.body.offer}`)
    })
}