require('dotenv').config();
const jwt = require('jsonwebtoken');
'use strict';

exports.generateToken = (user) => {
	return jwt.sign(
		{ userId: user.id, roles: ['user', 'admin']},
		`${process.env.PRIVATEKEY}`,
		{ expiresIn: '24h' }
	);
}

exports.getBearer = (authorization) => {
	if( authorization === undefined){
		return ` Authentication failed, please login or create an account !`
	} else {
		return (authorization !== null) ? authorization.replace('Bearer ', '') : null;
	}

}

exports.getUserId = (authorization) => {
	let userId;
	let token = this.getBearer(authorization);
	if (token !== null) {
		try {
			var jwtToken = jwt.verify(token, `${process.env.PRIVATEKEY}`);
			if (jwtToken != null) {
				userId = jwtToken.userId;
			}
		} catch (error){
			throw ` Authentication failed, please login or create an account !`
		}
	}
	return userId;
}