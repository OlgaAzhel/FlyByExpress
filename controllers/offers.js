const Offer = require('../models/offer');
const User = require('../models/user');

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
        User.findById(offer.creator._id, function (err, offerCreator) {
            res.render('offers/show', { title: 'Offer Details', offer, offerCreator })
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

module.exports = {
    new: newOffer,
    create,
    show,
    index
    // delete: deleteReview
};