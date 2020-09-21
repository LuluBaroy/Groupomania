const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config')
const userCtrl = require('../controllers/users');
const bouncer = require('express-bouncer')(15000, 30000, 3);
const auth = require('../middlewares/auth');
const validator = require('../middlewares/validator')
'use strict';

router.post('/signup', multer, validator.checkingSignup,userCtrl.signup);

router.post('/login', bouncer.block, validator.checkingSignup, userCtrl.login);

router.get('/:id', auth, userCtrl.readOne);

router.put('/:id', auth, multer, userCtrl.update);

router.delete('/:id', auth, multer, userCtrl.delete);

router.put('/:id/update_privilege', auth, userCtrl.updatePrivilege);

router.get('/', auth, userCtrl.readAll)


module.exports = router;