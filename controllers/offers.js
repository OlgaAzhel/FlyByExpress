const Offer = require('../models/offer');
const User = require('../models/user');

function newOffer(req,res) {
    res.render('offers/new', { title: 'Add New Delivery offer' });
}


function create(req, res) {
    console.log("Offer create running...")
    console.log("CREATOR:", req.user.offers)
    req.body.creator = req.user._id
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;
    
    const offer = new Offer(req.body)
    
    console.log("offer and updated req body",offer, req.body)
    offer.save(function(err, offer){

        User.findById(req.user._id, function (err, theUser) {
            theUser.offers.push(offer)
            theUser.save(function(err){
             })
        })
        if (err) return res.redirect('offers/new')
        console.log(offer)

        res.redirect('offers/index')
    })

}

function show(req,res) {
    Offer.findById(req.params.id, function(err, offer) {
        res.render('offers/show', {title: 'Offer Details', offer})
    })
    
}

function index(req,res) {
    Offer.find({}, function(err, offers) {
        res.render('offers/index', {
            title: 'All offers',
            offers
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