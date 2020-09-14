require('dotenv').config();
const models = require('../models');
const bcrypt = require('bcryptjs');
const jwtUtils = require('../middlewares/jwt');
const {validationResult} = require('express-validator');
const fs = require('fs');
//const logger = require('../middleware/winston')
'use strict';

exports.create = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Comments.create({ comment: req.body.comment, UserId: userId, PostId: req.params.id})
		.then(comment => {
			res.status(201).json({ message: `Your comment has been sent !`, comment})
		}).catch(err => res.status(500).json(err))
}

exports.createReport = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.CommentsReport.create({
		CommentId: req.params.comment_id,
		PostId: req.params.id,
		UserId: userId,
		report: req.body.report,
		status: 'pending'
	})
		.then((report) => {
			res.status(201).json({ message: `Your report has been sent, we'll eventually contact you if we need more information !`, report })
		}).catch((err) => res.status(500).json(err))
}

exports.update = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth)
	models.Comments.findOne({ where: { id: req.params.comment_id }})
		.then((comment) => {
			if(comment && userId === comment.user_id){
				models.Comments.update({ comment: req.body.comment }, { where: { id: req.params.comment_id }})
					.then(() => {
						res.status(201).json({ message: `Your comment has been updated !`})
					})
					.catch((err) => res.status(500).json(err))
			} else {
				res.status(403).json({ message: `You're not allowed to update this comment`})
			}
		})
		.catch((err) => res.status(404).json({ message: `This comment doesn't exist `, err}))
}

exports.delete = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			let role = JSON.parse(admin.role);
			models.Comments.findOne({where: {id: req.params.comment_id}})
				.then(comment => {
					if (userId === comment.user_id || role.includes('admin')) {
						models.CommentsReport.destroy({where: {comment_id: req.params.comment_id}})
							.then(() => {
								models.Comments.destroy({where: {id: req.params.comment_id}})
									.then(() => res.status(200).json({message: `Comment has been deleted !`}))
									.catch(err => res.status(500).json(err))
							}).catch(err => res.status(500).json(err))
					} else {
						res.status(403).json({ message: `You're not allowed to delete this comment`})
					}
				}).catch((err) => res.status(404).json({message: `This comment doesn't exist `, err}))
		}).catch(err => res.status(500).json(err))
}

exports.readOne = (req, res, next) => {
	models.Comments.findOne({ where: { id: req.params.comment_id }})
		.then(comment => {
			res.status(200).json(comment)
		}).catch(err => res.status(500).json(err))
}

exports.readAll = (req, res, next) => {
	models.Comments.findAll({include: [models.Users],
		order: [
			['id', 'ASC']
		]
	})
		.then(comments => {
			res.status(200).json(comments)
		}).catch(err => res.status(500).json(err))
}
