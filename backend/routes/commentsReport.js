const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/commentsReport');
'use strict';

router.put('/:id', commentCtrl.update)

router.delete('/:id', commentCtrl.delete)


module.exports = router;