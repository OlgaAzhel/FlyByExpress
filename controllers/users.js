const User = require('../models/user')
const Review = require('../models/review')
const Offer = require('../models/offer');
const review = require('../models/review');

module.exports = {
    show
};

function show(req, res) {

    User.findById(req.params.id, function (err, lookUpUser) {

        Review.find({ user: lookUpUser }, function (err, reviews) {
            let reviewsNumber = reviews.length
            let totalScore = 0
            reviews.forEach((review) => {
                totalScore += review.communication
                totalScore += review.cost
                totalScore += review.overall
            })
            let rating = totalScore/3/reviewsNumber
            if (err) { console.log(err) } else {
                console.log("REVIEWS:", lookUpUser)
                Offer.find({creator: lookUpUser}, function(err, offers) {

                    res.render('users/show', {
                        title: `${lookUpUser.name}`,
                        lookUpUser,
                        reviews,
                        offers, 
                        rating
    
                    })
                })

            }
        })


    })

}
