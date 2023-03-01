const Offer = require('../models/offer');
const User = require('../models/user');
const Review = require('../models/review');

function newOffer(req, res) {
    res.render('offers/new', { title: 'Add New Delivery offer' });
}


function create(req, res) {
    console.log("Offer create running...")
    req.body.creator = req.user._id
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;

    req.body.mail = !!req.body.mail
    req.body.electronics = !!req.body.electronics

    const offer = new Offer(req.body)

    // User.findById(req.user._id, function (err, theUser) {
    //     theUser.offers.push(offer)
    //     theUser.save(function (err) {
    //     })
    // })

    offer.save(function (err) {
        res.redirect('offers/')
    })

}

function show(req, res) {
    console.log("Show offer controller run...")
    Offer.findById(req.params.id, function (err, offer) {
        Review.find({ offer: offer }, function (err, reviews) {
            User.findById(offer.creator._id, function (err, offerCreator) {
                Review.find({ user: offerCreator }, function (err, couriersReviews) {
                    let totalScore = 0
                    couriersReviews.forEach((review) => {
                        totalScore += review.communication
                        totalScore += review.cost
                        totalScore += review.overall
                    })
                    let couriersRating = totalScore / 3 / couriersReviews.length


                    res.render('offers/show', { title: 'Offer Details', offer, offerCreator, reviews, couriersRating })

                })
            })

        })

    })

}

function index(req, res) {
    Offer.find({}, function (err, offers) {
        let sortedOffers = offers.sort((a, b) => {
            return b.departureDate - a.departureDate
        })
        res.render('offers/index', {
            title: 'All offers',
            sortedOffers
        })
    })
}

function edit(req, res) {
    req.body.mail = !!req.body.mail
    req.body.electronics = !!req.body.electronics
    Offer.findById(req.params.id, function (err, offer) {
        let departureDateString = offer.departureDate.toLocaleDateString('en-us', {
            timeZone: 'GMT',
            year: "numeric", month: "numeric", day: "numeric"
        })
        let cutoffDateString = offer.cutoffDate.toLocaleDateString('en-us', {
            timeZone: 'GMT',
            year: "numeric", month: "numeric", day: "numeric"
        })
        let availDateString = offer.availDate.toLocaleDateString('en-us', {
            timeZone: 'GMT',
            year: "numeric", month: "numeric", day: "numeric"
        })

        let departureDateFormatted = intoDateString(departureDateString)
        let cutoffDateFormatted = intoDateString(cutoffDateString)
        let availDateFormatted = intoDateString(availDateString)

        res.render('offers/edit', {
            title: 'Edit Offer',
            offer,
            departureDateFormatted,
            cutoffDateFormatted,
            availDateFormatted
        })
    })
}

function intoDateString(string) {
    let arr = []
    let newArr = string.split('/')
    arr.push(newArr.pop())
    newArr.forEach(num => {
        if (num.length === 1) {
            newNum = "0" + num
            arr.push(newNum)
        } else {
            arr.push(num)
        }
    })
    return arr.join("-")

}
function update(req, res) {

    console.log(req.body)
    Offer.findById(req.params.id, function (err, offer) {
        Object.assign(offer, req.body)
        offer.save(function (err) {


        })


        console.log(offer)
        res.redirect(`/offers/${req.params.id}`)
    })
}

function deleteOffer(req, res) {
    console.log("DElete offer controller run", req.params.id)
    // Offer.find({ _id: req.params.id }, function (err, offer) {
    //     console.log("OFFER:", offer)
    //     User.find({ creator: offer.creator }, function (err, offerCreator) {
    //         console.log("OFFER CREATOR:", offerCreator)
    //         let offersArray = offerCreator.offers
    //         console.log("OFFER CREATOR's OFFERS:", offerCreator.offers)
    //         let index = offersArray.findIndex(offer)
    //         console.log("INDEX of THE OFFER TO DELETE:", index)
    //         offersArray.splice(index, 1)
    //         offerCreator.offers = offersArray
    //         offerCreator.save(function (err) {
    //             console.log("Offers inside offerCreator updated")
    //         })
    //     })
    // })

    Offer.deleteOne({ _id: req.params.id }, function (err, offer) {

    })
    Review.deleteMany({ offer: req.params.id }, function (err, reviews) {
        console.log("Offer reviews are being removed:", reviews)
        res.redirect('/offers')
    })
}

module.exports = {
    new: newOffer,
    create,
    show,
    index,
    edit,
    update,
    delete: deleteOffer
};