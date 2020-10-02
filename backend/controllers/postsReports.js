//IF ADMIN
'use strict';
require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');
const logger = require('../middlewares/winston')

/**
 * @api {get} /api/report Read All
 * @apiName ReadAll
 * @apiGroup Post Reports and Comments reports
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiSuccess Object All posts and comments reports
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"postReports":[
 *		{
 *			"id":6,
 *			"post_id":17,
 *			"user_id":3,
 *			"report":"123456789",
 *			"status":"treated",
 *			"created_at":"2020-09-30 15:14:45",
 *			"updated_at":"2020-09-30 15:14:45",
 *			"createdAt":"2020-09-30 15:14:45",
 *			"updatedAt":"2020-09-30 15:14:45",
 *			"UserId":3,"PostId":17
 *		},
 *		{
 *			"id":5,
 *			"post_id":7,
 *			"user_id":2,
 *			"report":"lokijuhytyrdftgyhujikolpkojihuyd",
 *			"status":"pending",
 *			"created_at":"2020-09-27 19:56:06",
 *			"updated_at":"2020-09-29 19:02:00",
 *			"createdAt":"2020-09-27 19:56:06",
 *			"updatedAt":"2020-09-29 19:02:00",
 *			"UserId":2,
 *			"PostId":7
 *		},
 *		{
 *			"id":4,
 *			"post_id":1,
 *			"user_id":2,
 *			"report":"123456789",
 *			"status":"pending",
 *			"created_at":"2020-09-27 13:13:55",
 *			"updated_at":"2020-09-29 19:02:00",
 *			"createdAt":"2020-09-27 13:13:55",
 *			"updatedAt":"2020-09-29 19:02:00",
 *			"UserId":2,
 *			"PostId":1
 *		}
 *	],
 *	"commentReports":[]
 *}
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to access this route"
 * }
 */
exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function readAll (postReports)`)
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to function readAll(postReports)`)
					res.status(403).json({message: `You're not allowed for this route !`})
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
								logger.info(`User ${userId} got all reports`)
								res.status(200).json({postReports, commentReports})
							}).catch(err => {
								logger.info(`Something went wrong when trying to find all commentsReports in function readAll`)
								res.status(404).json({message: `No reports found`, err})
							})
						}).catch(err => {
						logger.info(`Something went wrong when trying to find all postsReports in function ReadAll`)
						res.status(404).json({message: `No reports found`, err})
					})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to find user in function readAll (postReport)`)
			res.status(500).json(err)
		})
	}
}

/**
 * @api {put} /api/report/post/:id Update Post Report
 *
 * @apiParam {Number} PostReportId id(unique)
 * @apiName UpdatePostReport
 * @apiGroup Post Reports and Comments reports
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiSuccess Message message
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"message":"Report 5 has been updated !"
 *}
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to access this route"
 * }
 */
exports.update = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function update(postReport)`)
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to function update (postReport)`)
					res.status(400).json({message: `You're not allowed for this route !`})
				} else {
					models.PostsReport.update({status: 'treated'}, {where: {id: req.params.id}})
						.then(() => {
							logger.info(`User ${userId} has updated postReport ${req.params.id}`)
							res.status(200).json({message: `Report ${req.params.id} has been updated !`})
						}).catch((err) => {
						logger.info(`Something went wrong when trying to update postReport ${req.params.id}`)
						res.status(500).json(err)
					})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to find user in function readAll(postReports)`)
			res.status(500).json(err)
		})
	}
}

/**
 * @api {delete} /api/report/post/:id Delete Post Report
 *
 * @apiParam {Number} PostReportId id(unique)
 * @apiName DeletePostReport
 * @apiGroup Post Reports and Comments reports
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiSuccess Message message
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"message":"This report has been deleted !"
 *}
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to access this route"
 * }
 */
exports.delete = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function delete(postReports)`)
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to function delete(postReports)`)
					res.status(400).json({message: `You're not allowed for this route !`})
				} else {
					models.PostsReport.destroy({where: {id: req.params.id}})
						.then(() => {
							logger.info(`User ${userId} has deleted postReport ${req.params.id}`)
							res.status(200).json({message: `This report has been deleted !`})
						})
						.catch((err) => {
							logger.info(`Something went wrong when trying to delete postReport ${req.params.id}`)
							res.status(404).json({message: `No report found with ID ${req.params.id}`, err})
						})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to find user in function delete(postReport)`)
			res.status(500).json(err)
		})
	}
}