require('dotenv').config();
const models = require('../models');
const path = require('path')
const bcrypt = require('bcryptjs');
const jwtUtils = require('../middlewares/jwt');
const {validationResult} = require('express-validator');
const fs = require('fs');
const logger = require('../middlewares/winston')
'use strict';

exports.create = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		if(!req.file){
			res.status(400).json({ message: 'File is required !'})
		} else {
			if(path.extname(req.file.filename).includes('.undefined')) {
				res.status(400).json({ message: 'This file extension is not allowed !'})
			} else {
				let userId = jwtUtils.getUserId(headerAuth);
				let urlGif, altGif;
				urlGif = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
				altGif = "GIF partagé par l'utilisateur"
				models.Posts.create({ title: req.body.title, UserId: userId, content: req.body.content, url_gif: urlGif, alt_gif: altGif })
					.then((post) => res.status(201).json({ message: `You're post has been created !`, post}))
					.catch((err) => res.status(500).json(err))
			}
		}
	}

}

exports.createLike = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		let userId = jwtUtils.getUserId(headerAuth);
		models.Likes.findOne({ where: { user_id: userId, post_id: req.params.id }})
			.then(likes => {
				if(likes){
					models.Likes.destroy({ where: { user_id: userId, post_id: req.params.id}})
						.then(() => res.status(200).json({ message: `Your like has been removed from that post !`}))
						.catch(error => res.status(400).json({ error }))
				} else {
					models.Likes.create({
						post_id: req.params.id,
						user_id: userId
					})
						.then((like) => res.status(200).json(like))
						.catch(error => res.status(400).json({ error }))
				}
			}).catch(err => res.status(500).json(err))
	}

}

exports.readLike = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userLiked = []
	let userInfo = []
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		models.Likes.findAll({ where: { post_id: req.params.id },
			order: [
				[ 'created_at', 'ASC']
			]})
			.then((likes) => {
				if(likes.length > 0){
					for(let i in likes){
						userLiked.push(likes[i].user_id)
					}
					for(let k = 0; k < userLiked.length; k++){
						models.Users.findOne({ where: { id: userLiked[k] } })
							.then((user => {
								userInfo.push({id:user.id, username: user.username, url_profile_picture: user.url_profile_picture, alt_profile_picture: user.alt_profile_picture})
								if(k === userLiked.length -1){
									res.status(200).json(userInfo)
								}
							})).catch(err => res.status(500).json(err))
					}
				} else {
					res.status(200).json(likes)
				}

			}).catch(err => res.status(500).json(err))
	}

}

exports.update = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		let userId = jwtUtils.getUserId(headerAuth);
		models.Users.findOne({where: {id: userId}})
			.then((user) => {
				models.Posts.findOne({ where: { id: req.params.id }})
				.then((post) => {
					if(post && userId === post.user_id || JSON.parse(user.role).includes('admin')){
						let urlGif, altGif;
						if(req.file){
							if(post.url_gif !== null){
								const filename = post.url_gif.split('/images/')[1];
								fs.unlink(`images/${filename}`, () => {
									//
								})
							}
							urlGif = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
							altGif = "GIF partagé par l'utilisateur"
						} else {
							urlGif = post.url_gif;
							altGif = "GIF partagé par l'utilisateur"
						}
						models.Posts.update({ ...req.body, url_gif: urlGif, alt_gif: altGif }, { where: { id: req.params.id }})
							.then(() => {
								res.status(201).json({ message: `Your post has been updated !`})
							})
							.catch((err) => res.status(500).json(err))
					} else {
						res.status(403).json({ message: `You're not allowed to update this post ! `})
					}
				})
				.catch((err) => res.status(404).json({ message: `This post doesn't exist `, err}))
			})

	}

}

exports.delete = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		let userId = jwtUtils.getUserId(headerAuth);
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				models.Posts.findOne({where: {id: req.params.id}})
					.then(post => {
						if (post && userId === post.user_id || role.includes('admin')) {
							const filename = post.url_gif.split('/images/')[1];
							fs.unlink(`images/${filename}`, () => {
								models.CommentsReport.destroy({where: {post_id: post.id}})
									.then(() => {
										models.Comments.destroy({where: {post_id: post.id}})
											.then(() => {
												models.Likes.destroy({where: {post_id: post.id}})
													.then(() => {
														models.PostsReport.destroy({
															where: {PostId: post.id},
															include: [models.Likes]
														})
															.then(() => {
																models.Posts.destroy({where: {id: post.id}})
																	.then((response) => {
																		res.status(200).json({message: 'Post deleted', response})
																	}).catch(err => res.status(500).json({err}))
															}).catch(err => res.status(500).json(err))
													}).catch(err => res.status(500).json(err))
											}).catch(err => res.status(500).json(err))
									}).catch(err => res.status(500).json(err))
							})
						} else {
							res.status(401).json({message: `You're not allowed to delete this post !`})
						}
					}).catch(err => res.status(404).json(err))
			}).catch(err => res.status(500).json(err))
	}

}

exports.readOne = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		let userId = jwtUtils.getUserId(headerAuth);
		if(userId){
			models.Posts.findOne({ where: { id: req.params.id }})
				.then((post) => {
					res.status(200).json(post)
				})
				.catch((err) => res.status(404).json(err))
		} else {
			res.status(400).json({ message: `You're not authenticated, please login ! `})
		}
	}


}

exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		models.Posts.findAll({ include: [models.Users, models.Comments, models.Likes],
			order: [
				['id', 'DESC']
			]
		})
			.then(posts => {
				res.status(200).json(posts)
			})
			.catch(err => res.status(500).json(err))
	}

}

exports.readAllFromUserId = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		models.Posts.findAll({ where: { user_id: req.params.user_id }, include: [models.Likes, models.Comments]}, {
			order: [
				['created_at', 'DESC']
			]
		})
			.then(posts => {
				res.status(200).json(posts)
			})
			.catch(err => res.status(500).json(err))
	}

}

exports.createReport = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		res.status(400).json({ message: `You're not authenticated, please login ! `})
	} else {
		let userId = jwtUtils.getUserId(headerAuth);
		models.PostsReport.create({
			PostId: req.params.id,
			UserId: userId,
			report: req.body.report,
			status: 'pending'
		})
			.then((report) => {
				res.status(201).json({ message: `Your report has been sent, we'll eventually contact you if we need more information !`, report })
			}).catch((err) => res.status(500).json(err))
	}

}

