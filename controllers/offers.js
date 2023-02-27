const Offer = require('../models/offer');
const User = require('../models/user');
const Review = require('../models/review');

function newOffer(req, res) {
    res.render('offers/new', { title: 'Add New Delivery offer' });
}


function create(req, res) {
    console.log("Offer create running...")
    console.log("CREATOR:", req.user.offers)
    req.body.creator = req.user._id
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;

    const offer = new Offer(req.body)

    User.findById(req.user._id, function (err, theUser) {
        theUser.offers.push(offer)
        theUser.save(function (err) {
        })
    })

    console.log("offer and updated req body", offer, req.body)
    offer.save(function (err) {
        if (err) {
            res.redirect('offers/new/')
        } else {
            res.redirect('offers/')
        }
    })

}

function show(req, res) {
    console.log("Show offer controller run...")
    Offer.findById(req.params.id, function (err, offer) {
        Review.find({ offer: offer }, function (err, reviews) {
            User.findById(offer.creator._id, function (err, offerCreator) {
                res.render('offers/show', { title: 'Offer Details', offer, offerCreator, reviews })
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

function edit(req,res) {
    Offer.findById(req.params.id, function(err, offer) {
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

module.exports = {
    new: newOffer,
    create,
    show,
    index,
    edit
    // delete: deleteReview
};