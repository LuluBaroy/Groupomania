const express = require('express');
const router = express.Router();
const researchCtrl = require('../controllers/research.js');
const auth = require('../middlewares/auth');
'use strict';

router.post('/', auth, researchCtrl.research);

module.exports = router;