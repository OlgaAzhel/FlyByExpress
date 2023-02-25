const User = require('../models/user')

module.exports = {
    show
};

function show(req, res) {

    User.findById(req.params.id, function(err, lookUpUser) {
        res.render('users/show', {
            title: `${lookUpUser.name}`,
            lookUpUser,

        })
    })

}
