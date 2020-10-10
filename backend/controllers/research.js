'use strict';
const models = require('../models');
const logger = require('../middlewares/winston');
const validator = require('validator');
const xss = require('xss')
/**
 * @api {post} /api/research Research
 * @apiName Research
 * @apiGroup Research
 *
 * @apiSuccess Array All users info which usernames corresponding to user research (here with 'test')
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 201 Created
 *[
 *	{
 *		"id":3,
 *		"email":"test2@test.fr",
 *		"password":"$2a$10$tloa5dX6MNt.Iaw6QAMnuu/2oeO5gvW.tg7xSaVImo/0assd.12R2",
 *		"username":"Testeur test",
 *		"role":"[\"user\",\"admin\"]",
 *		"bio":"123456",
 *		"url_profile_picture":"http://localhost:3000/images/defaultPicture.png",
 *		"alt_profile_picture":"Photo de profil de l'utilisateur",
 *		"consents":"{\"shareable\":\"false\",\"contactable\":\"false\"}",
 *		"created_at":"2020-09-24 20:35:11",
 *		"updated_at":"2020-09-30 18:20:24",
 *		"createdAt":"2020-09-24 20:35:11",
 *		"updatedAt":"2020-09-30 18:20:24"
 *	},
 *	{
 *		"id":15,
 *		"email":"test987@test.fr",
 *		"password":"$2a$10$gCkSEOQVohSRJL2.Y0Rmh.3QDFsTUim4MeEm7VMe2gvJobqcbr1VO",
 *		"username":"Lulu Test",
 *		"role":"[\"user\"]",
 *		"bio":"",
 *		"url_profile_picture":"http://localhost:3000/images/defaultPicture.png",
 *		"alt_profile_picture":"Photo de profil de l'utilisateur",
 *		"consents":"{\"shareable\":false,\"contactable\":false}",
 *		"created_at":"2020-09-30 14:15:42",
 *		"updated_at":"2020-09-30 14:15:42",
 *		"createdAt":"2020-09-30 14:15:42",
 *		"updatedAt":"2020-09-30 14:15:42"
 *	}
 *]
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 400 Bad request
 * {
 *     "message": "You're not authenticated, please log in !"
 * }
 */
exports.research = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function Research`)
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		if(req.body.research === '' || req.body.research === null) {
			logger.info(`an user tried to use function Research without filling field`)
			res.status(400).json({ message: `Please complete the field before clicking on the search button`})
		} else {
			let regex = /[\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^]/
			if(validator.matches(req.body.research, regex)){
				res.status(422).json({message: `Wrong format - Please don't use : |/*+&#{([]})<>$£€%=^`})
			} else {
				let username = xss(req.body.research).toUpperCase()
				models.Users.findAll()
					.then(users => {
						if(users.length === 0){
							users = 'There is no user with this username'
							logger.info(`User research didn't match any username`)
							res.status(200).json(users)
						} else {
							let usersCorresponding = []
							for(let i in users){
								if(users[i].username.toUpperCase().includes(username)){
									usersCorresponding.push(users[i])
								}
								if(i == users.length -1){
									logger.info(`User got all user which usernames are matching with his research`)
									res.status(200).json(usersCorresponding)
								}
							}
						}
					}).catch(err => {
					logger.info(`Something went wrong when trying to find all users in function research`)
					res.status(500).json(err)
				})
			}
		}
	}
}