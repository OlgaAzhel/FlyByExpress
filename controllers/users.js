const User = require('../models/user')

module.exports = {
    show
};

function show(req, res) {
    res.send('User will be displayed here')
}