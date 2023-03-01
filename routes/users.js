var express = require('express');
var router = express.Router();
var usersCtrl = require('../controllers/users')
const ensureLoggedIn = require('../config/ensureLoggedIn');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET user profile

router.get('/:id', ensureLoggedIn, usersCtrl.show)

module.exports = router;
