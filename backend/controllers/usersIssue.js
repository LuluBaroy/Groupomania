require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');

exports.create = (req, res, next) => {
	models.UserIssues.create({
		...req.body,
		status: 'pending'
	})
		.then(issue => res.status(201).json(issue))
		.catch(err => res.status(500).json(err))
}

exports.readOne = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({ where: {id: userId}})
		.then(user => {
			if (!user) {
				res.status(404).json({ message: `We couldn't authenticate you, please login or signup !`})
			} else {
				let roles = JSON.parse(user.role)
				if (!roles.includes('admin')) {
					res.status(403).json({ message: `You're not allowed to access this route`})
				} else {
					models.UserIssues.findOne({ where: {id: req.params.id }})
						.then(issue => {
							if(!issue){
								res.status(404).json({ message: `This user issue doesn't exist`})
							} else {
								res.status(200).json(issue)
							}
						}).catch(err => res.status(500).json(err))
				}
			}
		}).catch(err => res.status(500).json(err))
}

exports.update = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({ where: {id: userId}})
		.then(user => {
			if (!user) {
				res.status(404).json({message: `We couldn't authenticate you, please login or signup !`})
			} else {
				let roles = JSON.parse(user.role)
				if (!roles.includes('admin')) {
					res.status(403).json({message: `You're not allowed to access this route`})
				} else {
					models.UserIssues.update({status: 'treated'}, {where: {id: req.params.id}})
						.then(issue => {
							res.status(201).json({ message: `User Issue updated`, issue})
						})
						.catch(err => res.status(500).json(err))
				}
			}
		}).catch(err => res.status(500).json(err))
}

exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({ where: {id: userId}})
		.then(user => {
			if (!user) {
				res.status(404).json({message: `We couldn't authenticate you, please login or signup !`})
			} else {
				let roles = JSON.parse(user.role)
				if (!roles.includes('admin')) {
					res.status(403).json({message: `You're not allowed to access this route`})
				} else {
					models.UserIssues.findAll()
						.then(issues => {
							res.status(200).json(issues)
						}).catch(err => res.status(500).json(err))
				}
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
				models.UserIssues.findAll({where: {status: 'pending'}}, {
					order: [
						['id', 'DESC']
					]
				})
					.then(issues => {
						if(issues.length === 0){
							res.status(200).json({ message: `There is no user issue with status 'pending' !`})
						} else {
							res.status(200).json(issues)
						}
					}).catch(err => res.status(500).json(err))
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
				models.UserIssues.destroy({where: {id: req.params.id}})
					.then(() => {
						res.status(200).json({ message: `The user issue has been deleted !`})
					}).catch(err => res.status(500).json(err))
			}
		}).catch(err => res.status(500).json(err))
}

exports.readMessageWaiting = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({where: {id: userId}})
		.then(admin => {
			let role = JSON.parse(admin.role);
			if (!role.includes('admin')) {
				res.status(400).json({message: `You're not allowed for this route !`})
			} else {
				models.UserIssues.findAll({where: {status: 'pending'}}, {
					order: [
						['id', 'DESC']
					]
				}).then(issues => {
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
								.then(commentReports => {
									let total = issues.length + postReports.length + commentReports.length
									res.status(200).json({issues, postReports, commentReports, total})
								})
								.catch(err => res.status(500).json(err))
						}).catch(err => res.status(500).json(err))
				})
			}
		})
}