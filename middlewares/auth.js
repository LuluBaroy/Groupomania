require('dotenv').config();
const jwt = require('jsonwebtoken');
'use strict';

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, `${process.env.PRIVATEKEY}`);
		const userId = decodedToken.userId;
		console.log(userId + ' auth version')
		if (req.body.userId && req.body.userId !== userId) {
			throw 'Invalid user ID';
		} else {
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error('Invalid request!')
		});
	}
};
