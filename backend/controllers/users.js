'use strict';
require('dotenv').config();
const models = require('../models');
const bcrypt = require('bcryptjs');
const jwtUtils = require('../middlewares/jwt');
const {validationResult} = require('express-validator');
const bouncer = require('express-bouncer')(0,0);
const fs = require('fs');
const logger = require('../middlewares/winston');
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
schema
	.is().min(8)
	.has().uppercase()
	.has().lowercase()
	.has().digits(1)

/**
 * @api {post} /api/auth/signup Sign Up
 * @apiName Sign up
 * @apiGroup User
 *
 * @apiSuccess message Message + user ID
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 201 Created
 *{
 *	"message":"New user created ! User ID: 18"
 *}
 *
 * @apiErrorExample Error-Response: Wrong email/password
 * HTTP/1.1 422 Unprocessable Entity
 *{
 *	"errors": [
 *				{
 *					"value": "123456",
 *					"msg": "Email incorrect. Please try with a valid mail",
 *					"param": "email",
 *					"location": "body"
 *				}
 *			]
 *}
 *@apiDescription
 *
 * ⚠️-  If this is the first user signing up,
 *a second account will be automatically created to reassign all posts and
 *comments from future deleted users.
 *
 * ⚠️-  First user signing up is Admin
 *
 */
exports.signup = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		logger.info('User tried to sign up with invalid email and/or password');
		return res.status(422).json({ errors: errors.array() });
	} else {
		if(schema.validate(req.body.password)) {
			let role;
			let consents = JSON.stringify({'shareable': false, 'contactable': false})
			models.Users.findAll()
				.then(users => {
					if(users.length === 0){
						role = JSON.stringify(['user', 'admin'])
						bcrypt.hash(req.body.password, 10)
							.then(hash => {
								let urlProfilePicture, altProfilePicture;
								if(req.file){
									urlProfilePicture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
									altProfilePicture = "Photo de profil de l'utilisateur"
								} else {
									urlProfilePicture = `${req.protocol}://${req.get('host')}/images/defaultPicture.png`
									altProfilePicture = "Photo de profil de l'utilisateur"
								}
								models.Users.create({
									email: req.body.email,
									password: hash,
									username: req.body.username,
									url_profile_picture: urlProfilePicture,
									alt_profile_picture: altProfilePicture,
									bio: req.body.bio,
									role: role,
									consents: consents
								}).then(user => {
									logger.info('First user account created');
									role = JSON.stringify(['user'])
									bcrypt.hash(`${process.env.MDP_USER_DELETED}`, 10)
										.then(hash => {
											models.Users.create({
												email: "deletedUser@admin.fr",
												password: hash,
												username: "Utilisateur supprimé",
												url_profile_picture: `${req.protocol}://${req.get('host')}/images/deletedUser.png`,
												alt_profile_picture: altProfilePicture,
												bio: null,
												role: role,
												consents: consents
											})
												.then(()=>{
													logger.info('Deleted user account created');
													res.status(201).json({message: `New user created ! User ID: ${user.id}`})
												}).catch(err => {
												logger.info('Something went wrong when trying to create deleted user account');
												res.status(500).json(err)
											})
										}).catch(err => {logger.info('Something went wrong with bcrypt hash for deleted user account'); res.status(500).json(err)})
								}).catch(err => {logger.info('Something went wrong when trying to create first user'); res.status(500).json(err)})
							}).catch(err => {logger.info('Something went wrong with bcrypt hash for first user'); res.status(500).json(err)})
					} else {
						role = JSON.stringify(['user'])
						models.Users.findOne({ attributes: ['email'], where: { email: req.body.email }})
							.then((user) =>{
								if(!user){
									bcrypt.hash(req.body.password, 10)
										.then(hash => {
											let urlProfilePicture, altProfilePicture;
											if(req.file){
												urlProfilePicture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
												altProfilePicture = "Photo de profil de l'utilisateur"
											} else {
												urlProfilePicture = `${req.protocol}://${req.get('host')}/images/defaultPicture.png`
												altProfilePicture = "Photo de profil de l'utilisateur"
											}
											models.Users.create({
												email: req.body.email,
												password: hash,
												username: req.body.username,
												url_profile_picture: urlProfilePicture,
												alt_profile_picture: altProfilePicture,
												bio: req.body.bio,
												role: role,
												consents: consents
											})
												.then((newUser) => {
													logger.info('New user has been created');
													res.status(201).json({ message: `New user created ! User ID: ${newUser.id}`})
												})
												.catch((err) => {logger.info('Something went wrong when trying to create new user'); res.status(500).json(err)})

										})
										.catch(error => {logger.info(`Something went wrong with bcrypt hash (function signup)`); res.status(500).json({ error })});
								} else {
									logger.info(`An user tried to sign up with an email already in DB`)
									return res.status(401).json({message: 'This email is already in use !'})
								}
							}).catch(err => {logger.info(`Something went wrong when trying to search for all users (function signup)`); res.status(500).json(err)})
					}
				}).catch(err => {logger.info(`Something went wrong when trying to search for all users (function signup)`);res.status(500).json(err)})
		} else {
			logger.info(`An user tried to sign up with invalid password`)
			res.status(400).json({ message: `Your password must contain at least 8 characters with at least one uppercase letter and a number`})
		}
	}
}

/**
 * @api {post} /api/auth/login Log in
 * @apiName Login
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"user_id":18,
 *	"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJpYXQiOjE2MDE0ODAwMzQsImV4cCI6MTYwMTU2NjQzNH0.YbBLM9y_GBwD9o3vaWa42z4hTYkYAfeu0L_NoUB1D5E"
 *}
 *
 * @apiErrorExample Error-Response: User couldn't be found
 *HTTP/1.1 404 Not found
 *{
 *	"message":"This user couldn't be found"
 *}
 */
exports.login = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		logger.info('User tried to log in with invalid email and/or password');
		return res.status(422).json({ errors: errors.array() });
	} else {
		models.Users.findOne({ where: { email: req.body.email }})
			.then((user) => {
				if(!user){
					logger.info(`An user tried to log in but couldn't be found in DB`);
					return res.status(404).json({ message: `This user couldn't be found`})
				}
				bcrypt.compare(req.body.password, user.password)
					.then(valid => {
						if (!valid) {
							logger.warn("User didn't use correct password");
							return res.status(401).json({ error: 'Wrong password !' });
						}
						bouncer.reset(req);
						logger.info('Registered user connected');
						res.status(200).json({
							user_id: user.id,
							token: jwtUtils.generateToken(user)
						});
					})
					.catch((error) => {logger.info(`${req.params.id}: Couldn't connect an user on login function`); res.status(500).json({ error })});
			})
			.catch(error => {logger.info(`${req.params.id}: Couldn't connect an user on login function`); res.status(500).json({ error })});
	}

}

/**
 * @api {get} /api/auth/:id Read One
 * @apiName ReadOne
 * @apiGroup User
 *
 * @apiParam {Number} User id (unique)
 *
 * @apiSuccess Object All user info
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *     "id":2,
 *     "email":"deletedUser@admin.fr",
 *     "password":"$2a$10$BvS4N1seTASRfWlmRcBDN.LpKwwUp7Y/D92I..o/3xcNDyXkr58qu",
 *     "username":"Utilisateur supprimé",
 *     "role":"[\"user\"]",
 *     "bio":null,
 *     "url_profile_picture":"http://localhost:3000/images/deletedUser.png",
 *     "alt_profile_picture":"Photo de profil de l'utilisateur",
 *     "consents":"{\"shareable\":false,\"contactable\":false}",
 *     "created_at":"2020-09-24 17:33:09",
 *     "updated_at":"2020-09-24 17:33:09",
 *     "createdAt":"2020-09-24 17:33:09",
 *     "updatedAt":"2020-09-24 17:33:09",
 *     "Posts":[
 *     		{
 *     		"id":1,
 *     		"title":"123",
 *     		"content":"123456🤪",
 *     		"user_id":2,
 *     		"url_gif":"http://localhost:3000/images/7932182674.gif",
 *     		"alt_gif":"GIF partagé par l'utilisateur",
 *     		"created_at":"2020-09-24 17:59:11",
 *     		"updated_at":"2020-09-29 16:51:26",
 *     		"createdAt":"2020-09-24 17:59:11",
 *     		"updatedAt":"2020-09-29 16:51:26",
 *     		"UserId":2
 *     		},
 *     		{
 *     		"id":5,
 *     		"title":"132",
 *     		"content":"khghfwsdfgthyhujikoljnhg 😧",
 *     		"user_id":2,
 *     		"url_gif":"http://localhost:3000/images/579015870.gif",
 *     		"alt_gif":"GIF partagé par l'utilisateur",
 *     		"created_at":"2020-09-27 15:06:02",
 *     		"updated_at":"2020-09-29 17:28:51",
 *     		"createdAt":"2020-09-27 15:06:02",
 *     		"updatedAt":"2020-09-29 17:28:51",
 *     		"UserId":2
 *     		}
 *     	 ],
 *     	"Comments": [],
 *     	"Likes": [],
 *}
 *
 * @apiErrorExample Error-Response: User couldn't be found
 *HTTP/1.1 404 Not found
 *{
 *	"message": "User with ID 3 not found !"
 *}
 */
exports.readOne = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to get user ${req.params.id}`);
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({ where: { id: req.params.id }, include: [models.Posts, models.Comments, models.Likes]})
			.then((user) => {
				if(!user){
					logger.info(`User ${userId} tried to get info about user ${req.params.id} but it seems this user doesn't exist`);
					res.status(404).json({ message: `User with ID ${req.params.id} not found !`})
				} else {
					logger.info(`User ${userId} got info about user ${req.params.id}`);
					res.status(200).json(user)
				}
			}).catch(err => {logger.info(`Something went wrong when trying to search for user ${req.params.id} info`); res.status(500).json(err)})
	}
}

/**
 * @api {delete} /api/auth/:id Delete
 * @apiName Delete
 * @apiGroup User
 *
 * @apiParam {Number} UserId id (unique)
 *
 * @apiSuccess message user deleted
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *{
 *	"message": "User 14 deleted !"
 *}
 *
 * @apiErrorExample Error-Response: User couldn't be found
 *HTTP/1.1 404 Not found
 *{
 *	"message": "User 1500 couldn't be found !"
 *}
 */
exports.delete = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access delete (user) function`);
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		function deleting () {
			return new Promise((resolve) => {
				models.CommentsReport.update({user_id: 2}, {where: {user_id: req.params.id}})
					.then(() => {
						models.PostsReport.update({user_id: 2}, {where: {user_id: req.params.id}})
							.then(() => {
								models.Likes.update({user_id: 2}, {where: {user_id: req.params.id}})
									.then(() => {
										models.Comments.update({user_id: 2}, {where: {user_id: req.params.id}})
											.then(() => {
												models.Posts.update({user_id: 2}, {where: {user_id: req.params.id}})
													.then(() => resolve())
													.catch(err => res.status(500).json(err))
											}).catch(err => res.status(500).json(err))
									}).catch(err => res.status(500).json(err))
							}).catch(err => res.status(500).json(err))
					}).catch(err => res.status(500).json(err))
			})
		}

		models.Users.findOne({where: {id: req.params.id}})
			.then(admin => {
				if(!admin){
					logger.info(`User ${res.params.id} couldn't be found in DB (function delete (user))`);
					res.status(404).json({message: `User ${req.params.id} couldn't be found !`})
				} else {
					let role = JSON.parse(admin.role);
					if (userId == req.params.id || role.includes('admin')) {
						const filename = admin.url_profile_picture.split('/images/')[1];
						if(!filename.includes('defaultPicture.png')) {
							fs.unlink(`images/${filename}`, () => {
								deleting()
									.then(() => {
										logger.info(`All posts/comments/likes/postsReports/commentsReports from user ${req.params.id} has been reassigned to user 2`);
										models.Users.destroy({where: {id: req.params.id}})
											.then(() => {
												logger.info(`User ${req.params.id} has been deleted`);
												res.status(200).json({message: `User ${req.params.id} deleted !`})
											})
											.catch(err => {
												logger.info(`Couldn't delete user ${req.params.id}`);
												res.status(500).json(err)
											})
									}).catch(err => {
									logger.info(`Something went wrong in function deleting (function delete (user))`);
									res.status(500).json(err)
								})
							})
						} else {
							deleting()
								.then(() => {
									models.Users.destroy({where: {id: req.params.id}})
										.then(() => {
											logger.info(`User ${req.params.id} has been deleted`);
											res.status(200).json({message: `User ${req.params.id} deleted !`})
										})
										.catch(err => {
											logger.info(`Couldn't delete user ${req.params.id}`);
											res.status(500).json(err)
										})
								}).catch(err => {
								logger.info(`Something went wrong in function deleting (function delete (user))`);
								res.status(500).json(err)
							})
						}
					} else {
						logger.info(`User ${userId} tried to delete user ${req.params.id}`);
						res.status(400).json({message: `You're not allowed for this action`})
					}
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to search user (function delete (user))`);
			res.status(500).json(err)
		})
	}
}

/**
 * @api {put} /api/auth/:id Update
 * @apiName Update
 * @apiGroup User
 *
 * @apiParam {Number} UserId id (unique)
 *
 * @apiSuccess message Updated + new info
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *     "message":"Your information have been updated !",
 *     "user": {
 *     		"id":3,
 *     		"email":"test2@test.fr",
 *     		"password":"$2a$10$tloa5dX6MNt.Iaw6QAMnuu/2oeO5gvW.tg7xSaVImo/0assd.12R2",
 *     		"username":"Testeur test",
 *     		"role":"[\"user\",\"admin\"]",
 *     		"bio":"123456",
 *     		"url_profile_picture":"http://localhost:3000/images/defaultPicture.png",
 *     		"alt_profile_picture":"Photo de profil de l'utilisateur",
 *     		"consents":"{\"shareable\":\"false\",\"contactable\":\"false\"}",
 *     		"created_at":"2020-09-24 20:35:11",
 *     		"updated_at":"2020-09-30 18:20:24",
 *     		"createdAt":"2020-09-24 20:35:11",
 *     		"updatedAt":"2020-09-30 18:20:24"
 *     		}
 *}
 *
 * @apiErrorExample Error-Response : User is not allowed for this action
 * HTTP/1.1 403 Forbidden
 *{
 *  	"message": "You're not allowed for this action !"
 *}
 */
exports.update = (req, res, next) => {
	let urlProfilePicture;
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access updateUser function`);
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({ where: { id: req.params.id }})
			.then(user => {
				if(user.id === userId){
					if(req.file){
						const filename = user.url_profile_picture.split('/images/')[1];
						fs.unlink(`images/${filename}`, () => {
							//
						})
						urlProfilePicture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
					} else {
						urlProfilePicture = user.url_profile_picture;
					}
					let consents = {
						shareable: req.body.shareable,
						contactable: req.body.contactable
					};
					let password
					if(req.body.password === ''){
						password = user.password
						console.log(password)
						models.Users.update({ ...req.body, password: password, url_profile_picture: urlProfilePicture, consents: JSON.stringify(consents) }, { where: { id: req.params.id }})
							.then(() => {
								logger.info(`User ${userId} has updated his info`);
								models.Users.findOne({ where: { id: req.params.id }})
									.then(user => {
										res.status(200).json({message: `Your information have been updated !`, user})
									}).catch(err=> {
									logger.info(`Something went wrong when trying to search for user in function updateUser`);
									res.status(500).json(err)
								})
							})
							.catch((err) => {
								logger.info(`Something went wrong when trying to update user ${userId}`);
								res.status(500).json(err)
							})
					} else {
						bcrypt.hash(req.body.password, 10)
							.then(hash => {
								password = hash
								console.log('bcrypt : ' + password)
								models.Users.update({ ...req.body, password: password, url_profile_picture: urlProfilePicture, consents: JSON.stringify(consents) }, { where: { id: req.params.id }})
									.then(() => {
										logger.info(`User ${userId} has updated his info`);
										models.Users.findOne({ where: { id: req.params.id }})
											.then(user => {
												res.status(200).json({message: `Your information have been updated !`, user})
											}).catch(err=> {
											logger.info(`Something went wrong when trying to search for user in function updateUser`);
											res.status(500).json(err)
										})
									})
									.catch((err) => {
										logger.info(`Something went wrong when trying to update User ${userId}`);
										res.status(500).json(err)
									})
							}).catch(err => {
							logger.info(`Something went wrong when trying to hash new password for user ${userId}`);
							res.status(500).json(err)
						})
					}
				} else {
					logger.info(`User ${userId} tried to update user ${req.params.id} infos`);
					res.status(403).json({message: `You're not allowed for this action !`})
				}
			}).catch(err=> {
			logger.info(`Something went wrong when searching for user in function updateUser`);
			res.status(500).json(err)
		})
	}
}

/**
 * @api {get} /api/auth/ Read All
 * @apiName ReadAll
 * @apiGroup User
 *
 * @apiSuccess message Message + All users
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message":"Here are all users",
 *     "users": [
 *     		{
 *     			"id":4,
 *     			"username":"Lulu",
 *     			"email":"test3@test.fr",
 *     			"url_profile_picture":"http://localhost:3000/images/defaultPicture.png",
 *     			"alt_profile_picture":"Photo de profil de l'utilisateur",
 *     			"role":"[\"user\"]"
 *     		},
 *     		{
 *     			"id":18,
 *     			"username":"Lulu blablabla",
 *     			"email":"testlkgjhfgjik@test.fr",
 *     			"url_profile_picture":"http://localhost:3000/images/defaultPicture.png",
 *     			"alt_profile_picture":"Photo de profil de l'utilisateur",
 *     			"role":"[\"user\"]"
 *     		},
 *     		{
 *     			"id":17,
 *     			"username":"Lulu lululu",
 *     			"email":"testlkjvhbjnk@test.fr",
 *     			"url_profile_picture":"http://localhost:3000/images/defaultPicture.png",
 *     			"alt_profile_picture":"Photo de profil de l'utilisateur",
 *     			"role":"[\"user\"]"
 *     		}
 *     	  ]
 *}

 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(headerAuth){
		models.Users.findAll({
			order: [
				['username', 'ASC']
			]
		})
			.then(allUsers => {
				let users = [];
				for(let i in allUsers){
					users.push({
						id: allUsers[i].id,
						username: allUsers[i].username,
						email: allUsers[i].email,
						url_profile_picture: allUsers[i].url_profile_picture,
						alt_profile_picture: allUsers[i].alt_profile_picture,
						role: allUsers[i].role
					})
				}
				logger.info(`All users info has been asked`);
				res.status(200).json({message: `Here are all users`, users})
			}).catch((err) => {
			logger.info(`Something went wrong when trying to search for all users in function ReadAllUsers`);
			res.status(500).json(err)
		})
	} else {
		logger.info(`An unauthenticated user tried to get all users info`);
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
	}

}

/**
 * @api {put} /api/auth/:id Update Privilege
 * @apiName UpdatePrivilege
 * @apiGroup User
 *
 * @apiParam {Number} UserId id (unique)
 *
 * @apiSuccess message Message + new role
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message":"This user's privilege has been updated to : user,admin ! "
 *}
 *
 * @apiErrorExample Error-Response: User not allowed for this action
 * HTTP/1.1 403 Forbidden
 *{
 *  	"message": "You're not allowed for this route !"
 *}
 *
 * @apiDescription ⚠️Admin role needed
 */
exports.updatePrivilege = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function updatePrivilege`);
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to function updatePrivilege`);
					res.status(403).json({message: `You're not allowed for this route !`})
				} else {
					models.Users.findOne({where: {id: req.params.id}})
						.then(user => {
							let roleUser = JSON.parse(user.role)
							if (roleUser.includes('admin')) {
								roleUser = ['user']
							} else {
								roleUser = ['user', 'admin'];
							}
							let newRole = JSON.stringify(roleUser)
							models.Users.update({role: newRole}, {where: {id: req.params.id}})
								.then(() => {
									logger.info(`User ${userId} has updated user ${req.params.id} privilege`);
									res.status(200).json({message: `This user's privilege has been updated to : ${roleUser} ! `})
								}).catch(err => {
								logger.info(`User ${userId} couldn't update user ${req.params.id} privilege`);
								res.status(500).json(err)
							})
						}).catch(err => {
						logger.info(`Something went wrong when trying to search for user ${userId} in function updatePrivilege`);
						res.status(500).json(err)
					})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to search for user ${userId} in function updatePrivilege`);
			res.status(500).json(err)
		})
	}
}