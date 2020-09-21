const express = require('express');
const router = express.Router();
//const validator = require('../middlewares/validator');
const reportCtrl = require('../controllers/postsReports');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');
'use strict';

router.get('/post/:id', reportCtrl.readOne)

router.put('/post/:id', reportCtrl.update)

router.get('/pending', reportCtrl.readAllPending)

router.get('/', reportCtrl.readAll)

router.delete('/post/:id', reportCtrl.delete)

module.exports = router;