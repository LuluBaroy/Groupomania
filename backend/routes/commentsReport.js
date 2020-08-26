const express = require('express');
const router = express.Router();
//const validator = require('../middlewares/validator');
const commentCtrl = require('../controllers/commentsReport');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');
'use strict';

router.get('/:id', commentCtrl.readOne)

router.put('/:id', commentCtrl.update)

router.delete('/:id', commentCtrl.delete)


module.exports = router;