'use strict';
const express = require('express');
const router = express.Router();
const reportCtrl = require('../controllers/postsReports');


router.put('/post/:id', reportCtrl.update)

router.get('/', reportCtrl.readAll)

router.delete('/post/:id', reportCtrl.delete)

module.exports = router;