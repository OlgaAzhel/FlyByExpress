const User = require('../models/user')
const Review = require('../models/review')
const Offer = require('../models/offer');
const review = require('../models/review');

module.exports = {
    show,
    edit,
    update
};

function show(req, res) {

    User.findById(req.params.id, function (err, lookUpUser) {

        Review.find({ offerCreator: lookUpUser }, function (err, reviews) {
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

function edit(req,res) {
    User.findById(req.params.id, function (err, lookUpUser) {

        Review.find({ offerCreator: lookUpUser }, function (err, reviews) {
            let reviewsNumber = reviews.length
            let totalScore = 0
            reviews.forEach((review) => {
                totalScore += review.communication
                totalScore += review.cost
                totalScore += review.overall
            })
            let rating = totalScore / 3 / reviewsNumber
            if (err) { console.log(err) } else {
                console.log("REVIEWS:", lookUpUser)
                Offer.find({ creator: lookUpUser }, function (err, offers) {

                    res.render(`users/edit`, {
                        title: `Edit info: ${lookUpUser.name}`,
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

function update(req,res) {
    console.log("USER UPDATE RUN:",req.body)
    User.findById(req.params.id, function (err, user) {
        Object.assign(user, req.body)
        user.save(function (err) {

        })
        console.log(user)
        res.redirect(`/users/${req.params.id}`)
    })
}
