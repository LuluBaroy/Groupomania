const express = require('express');
const router = express.Router();
const issueCtrl = require('../controllers/usersIssue');
'use strict';

router.post('/', issueCtrl.create)

router.get('/:id', issueCtrl.readOne)

router.put('/:id', issueCtrl.update)

router.get('/all/pending', issueCtrl.readAllPending)

router.get('/', issueCtrl.readAll)

module.exports = router;
