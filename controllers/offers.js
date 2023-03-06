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

    // check if each of theree dates is a real date
    // check if the departure date is within 1 year from current date
    // check if package accept date is earlier than  or equal departure date
    // check if departure date is earlier or equal available date

    const offer = new Offer(req.body)

    offer.save(function(err) {
        // https://stackoverflow.com/questions/61056021/improve-mongoose-validation-error-handling
        if (err && err.name === "ValidationError") {
            console.log("THIS IS ERROR OBJECT:", err, err.name)
            
            let listOfErrors = []
            let errorKeys = []
            Object.keys(err.errors).forEach((key) => {
                errorKeys.push(key)
                listOfErrors.push(err.errors[key].message);

            });
            errorKeys.forEach((key) => {
                req.body[key] = ""
            })
            let currentInputObj = req.body
            console.log(req.body)
            res.render('offers/error', {
                title: 'Fix Error - Adding New Delivery offer',
                listOfErrors,
                currentInputObj,
                errorKeys
            });
        } else {
            res.redirect('offers/')
        }
    })

}

function show(req, res) {
    Offer.findById(req.params.id, function (err, offer) {
        Review.find({ offer: offer }, function (err, reviews) {
            User.findById(offer.creator._id, function (err, offerCreator) {
                Review.find({ offerCreator: offerCreator }, function (err, couriersReviews) {
                    let totalScore = 0
                    let couriersRating
                    if (couriersReviews) {
                        couriersReviews.forEach((review) => {
                            totalScore += review.communication
                            totalScore += review.cost
                            totalScore += review.overall
                        })
                        couriersRating = totalScore / 3 / couriersReviews.length

                    }
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