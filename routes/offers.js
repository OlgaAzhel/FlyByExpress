const express = require('express');
const router = express.Router();
const offersCtrl = require('../controllers/offers');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/new', ensureLoggedIn, offersCtrl.new);

router.post('/', ensureLoggedIn, offersCtrl.create);

router.get('/:id', ensureLoggedIn, offersCtrl.show);

router.get('/:id/edit', ensureLoggedIn, offersCtrl.edit);

router.put('/:id/', ensureLoggedIn, offersCtrl.update);

router.get('/', offersCtrl.index);

router.delete('/:id', ensureLoggedIn, offersCtrl.delete)



module.exports = router;