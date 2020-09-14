const {body} = require('express-validator');

'use strict';
const message = "Email incorrect. Please try with a valid mail";
exports.checkingSignup = [
	body('email').isEmail().withMessage(message),
]