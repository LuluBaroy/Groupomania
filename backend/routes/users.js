'use strict';
const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config')
const userCtrl = require('../controllers/users');
const bouncer = require('express-bouncer')(15000, 30000, 3);
const validator = require('../middlewares/validator')

router.post('/signup', multer, validator.checkingSignup,userCtrl.signup);

router.post('/login', bouncer.block, validator.checkingSignup, userCtrl.login);

router.get('/:id', userCtrl.readOne);

router.put('/:id', multer, userCtrl.update);

router.delete('/:id', multer, userCtrl.delete);

router.put('/:id/update_privilege', userCtrl.updatePrivilege);

router.get('/', userCtrl.readAll)


module.exports = router;