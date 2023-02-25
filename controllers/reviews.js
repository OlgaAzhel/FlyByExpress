const User = require('../models/user');

module.exports = {
    create,
    // delete: deleteReview
};

function create(req, res) {
    console.log("REVIEW CREATING RUNNING..")
    // Find the movie to embed the review within
    User.findById(req.params.id, function (err, user) {

        // Add the user-centric info to req.body (the new review)
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;

        // Push the subdoc for the review
        user.reviews.push(req.body);
        // Always save the top-level document (not subdocs)
        user.save(function (err) {
            console.log("User save update..")
            res.redirect(`/users/${user._id}`);
        });
    });
}