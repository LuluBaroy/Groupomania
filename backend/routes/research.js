const express = require('express');
const router = express.Router();
const researchCtrl = require('../controllers/research.js');
'use strict';

router.post('/', researchCtrl.research);

module.exports = router;