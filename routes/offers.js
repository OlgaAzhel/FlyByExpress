const express = require('express');
const router = express.Router();
const offersCtrl = require('../controllers/offers');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/new', ensureLoggedIn, offersCtrl.new);

router.post('/', ensureLoggedIn, offersCtrl.create);

router.get('/:id', offersCtrl.show);

router.get('/', offersCtrl.index);

// router.delete('/reviews/:id', ensureLoggedIn, reviewsCtrl.delete)



module.exports = router;