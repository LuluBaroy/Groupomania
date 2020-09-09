require('dotenv').config();
const models = require('../models');
const bcrypt = require('bcryptjs');
const jwtUtils = require('../middlewares/jwt');
const {validationResult} = require('express-validator');
const bouncer = require('express-bouncer')(0,0);
const fs = require('fs');
const logger = require('../middlewares/winston');

'use strict';

exports.signup = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		logger.info('User tried to signup with invalid email and/or password');
		return res.status(422).json({ errors: errors.array() });
	}
	let role;
	let consents = JSON.stringify({'sharable': false, 'contactable': false})
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
											res.status(201).json({message: `New user created ! User ID: ${user.id}`})
										}).catch(err => res.status(500).json(err))
								}).catch(err => res.status(500).json(err))
						}).catch(err => res.status(500).json(err))
					}).catch(err => res.status(500).json(err))
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
											res.status(201).json({ message: `New user created ! User ID: ${newUser.id}`})
										})
										.catch((err) => {res.status(500).json(err)})
									logger.info('New user has been created');
								})
								.catch(error => {/*logger.info(`Couldn't register new user`); */res.status(500).json({ error })});
						} else {
							return res.status(401).json({message: 'This email is already in use !'})
						}
					})
			}
		}).catch(err => res.status(500).json(err))
}


exports.login = (req, res, next) => {
	models.Users.findOne({ where: { email: req.body.email }})
		.then((user) => {
			if(!user){
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
				.catch((error) => {logger.info(`${req.params.id}: Couldn't connect a user on login function`); res.status(500).json({ error })});
		})
		.catch(error => {logger.info(`${req.params.id}: Couldn't connect a user on login function`); res.status(500).json({ error })});
}

exports.readOne = (req, res, next) => {
	console.log(req.cookie)
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({ where: { id: req.params.id }, include: [models.Posts, models.Comments, models.Likes]})
		.then((user) => {
			if(!user){
				res.status(404).json({ message: `User with ID ${userId} not found !`})
			}
			res.status(200).json(user)
		}).catch(err => res.status(500).json(err))
}

exports.delete = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			let role = JSON.parse(admin.role);
			if (userId == req.params.id || role.includes('admin')) {
				const filename = admin.url_profile_picture.split('/images/')[1];
				fs.unlink(`images/${filename}`, () => {
					models.Posts.update({user_id: 2}, {where: {user_id: req.params.id}, includes:[models.Comments, models.Likes, models.PostsReport, models.CommentsReport]})
						.then(() => {
							models.Users.destroy({where: {id: req.params.id}})
							res.status(200).json({message: `User ${req.params.id} has been deleted, all his Posts and Comment have been updated to user_id: 2`})
						}).catch(err => res.status(500).json(err))
				})
			} else {
				res.status(400).json({message: `You're not allowed for this action`})
			}
		}).catch(err => res.status(500).json(err))
}

exports.update = (req, res, next) => {
	let urlProfilePicture;
	models.Users.findOne({ where: { id: req.params.id }})
		.then(user => {
			if(req.file){
				const filename = user.url_profile_picture.split('/images/')[1];
				fs.unlink(`images/${filename}`, () => {
					console.log('Image deleted ! ' + filename);
				})
				urlProfilePicture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
			} else {
				urlProfilePicture = user.url_profile_picture;
			}
			bcrypt.hash(req.body.password, 10)
				.then(hash => {
					models.Users.update({ ...req.body, password: hash, url_profile_picture: urlProfilePicture }, { where: { id: req.params.id }})
						.then(() => {
							models.Users.findOne({ where: { id: req.params.id }})
								.then(user => {
									res.status(200).json({message: `Your information have been updated !`, user})
								}).catch(err=> res.status(500).json(err))
						})
						.catch((err) => res.status(500).json(err))
				}).catch(err => res.status(500).json(err))
		}).catch(err=> res.status(500).json(err))
}

exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	if(userId){
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
						email: allUsers[i].email
					})
				}
				res.status(200).json({message: `Here are all users`, users})
			}).catch((err) => res.status(500).json(err))
	} else {
		res.status(400).json({ message: `You're not authenticate, please login ! `})
	}

}

exports.updatePrivilege = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			bcrypt.compare(req.body.password, admin.password)
				.then(valid => {
					if (!valid) {
						res.status(400).json({message: `Wrong Password ! `})
					} else {
						let role = JSON.parse(admin.role);
						if (!role.includes('admin')) {
							res.status(400).json({message: `You're not allowed for this route !`})
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
											res.status(200).json({message: `This user's privilege has been updated to : ${roleUser} ! `})
										}).catch(err => res.status(500).json(err))
								}).catch(err => res.status(500).json(err))
						}
					}
				}).catch(err => res.status(500).json(err))
		}).catch(err => res.status(500).json(err))
}