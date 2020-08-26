const express = require('express');
const router = express.Router();
//const validator = require('../middlewares/validator');
const reportCtrl = require('../controllers/postsReports');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');
'use strict';

router.get('/post/:id', reportCtrl.readOne)

router.put('/posts/:id', reportCtrl.update)

router.get('/pending', reportCtrl.readAllPending)

router.get('/', reportCtrl.readAll)

router.delete('/posts/:id', reportCtrl.delete)

module.exports = router;