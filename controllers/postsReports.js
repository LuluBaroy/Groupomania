//IF ADMIN
require('dotenv').config();
const models = require('../models');
const bcrypt = require('bcryptjs');
const jwtUtils = require('../middlewares/jwt');
const {validationResult} = require('express-validator');
const fs = require('fs');
//const logger = require('../middleware/winston')
'use strict';

exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			let role = JSON.parse(admin.role);
			if (!role.includes('admin')) {
				res.status(400).json({message: `You're not allowed for this route !`})
			} else {
				models.PostsReport.findAll({
					order: [
						['id', 'DESC']
					]
				})
					.then(postReports => {
						models.CommentsReport.findAll({
							order: [
								['id', 'DESC']
							]
						}).then(commentReports => {
							res.status(200).json({postReports, commentReports})
						}).catch(err => res.status(404).json({message: `No reports found`, err}))
					}).catch(err => res.status(404).json({message: `No reports found`, err}))
			}
		}).catch(err => res.status(500).json(err))
}

exports.readAllPending = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			let role = JSON.parse(admin.role);
			if (!role.includes('admin')) {
				res.status(400).json({message: `You're not allowed for this route !`})
			} else {
				models.PostsReport.findAll({where: {status: 'pending'}}, {
					order: [
						['id', 'DESC']
					]
				})
					.then(postReports => {
						models.CommentsReport.findAll({where: {status: 'pending'}}, {
							order: [
								['id', 'DESC']
							]
						})
							.then(commentsReports => {
								res.status(200).json({postReports, commentsReports})
							})
							.catch(err => res.status(500).json(err))
					}).catch(err => res.status(500).json(err))
			}
		}).catch(err => res.status(500).json(err))
}

exports.readOne = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			let role = JSON.parse(admin.role);
			if (!role.includes('admin')) {
				res.status(400).json({message: `You're not allowed for this route !`})
			} else {
				models.PostsReport.findOne({where: {id: req.params.id}})
					.then(report => {
						models.Users.findOne({where: {id: report.user_id}})
							.then(user => {
								models.Posts.findOne({where: {id: report.post_id}})
									.then(post => {
										let reportAuthor = {
											username: user.username,
											email: user.email
										}
										res.status(200).json({report, post, reportAuthor})
									}).catch(err => res.status(500).json(err))
							}).catch(err => res.status(500).json(err))
					}).catch(err => res.status(500).json(err))
			}
		}).catch(err => res.status(500).json(err))
}



exports.update = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			let role = JSON.parse(admin.role);
			if (!role.includes('admin')) {
				res.status(400).json({message: `You're not allowed for this route !`})
			} else {
				models.PostsReport.update({status: 'treated'}, {where: {id: req.params.id}})
					.then(() => {
						res.status(200).json({message: `Report ${req.params.id} has been updated !`})
					}).catch((err) => res.status(500).json(err))
			}
		}).catch(err => res.status(500).json(err))
}

exports.delete = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			let role = JSON.parse(admin.role);
			if (!role.includes('admin')) {
				res.status(400).json({message: `You're not allowed for this route !`})
			} else {
				models.PostsReport.destroy({where: {id: req.params.id}})
					.then(() => {
						res.status(200).json({message: `This report has been deleted !`})
					})
					.catch((err) => res.status(404).json({message: `No report found with ID ${req.params.id}`, err}))
			}
		}).catch(err => res.status(500).json(err))
}