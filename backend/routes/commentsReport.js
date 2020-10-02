'use strict';
const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/commentsReport');

router.put('/:id', commentCtrl.update)

router.delete('/:id', commentCtrl.delete)


module.exports = router;