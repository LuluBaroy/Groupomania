//IF ADMIN
'use strict';
require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');
const logger = require('../middlewares/winston')

/**
 * @api {put} /api/report/comment/:id Update Comment Report
 * @apiName UpdateCommentReport
 * @apiGroup Post Reports and Comments reports
 *
 * @apiParam {Number} CommentReportId id(unique)
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiSuccess Message message
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"message":"Report 9 has been updated !"
 *}
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 *{
 *	"message": "You're not allowed to access this route"
 *}
 */
exports.update = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth) {
		logger.info(`An unauthenticated user tried to access to function update(commentReports)`)
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to function update(commentReports)`)
					res.status(403).json({message: `You're not allowed for this route !`})
				} else {
					models.CommentsReport.update({status: 'treated'}, {where: {id: req.params.id}})
						.then(() => {
							logger.info(`User ${userId} has updated commentReport ${req.params.id}`)
							res.status(200).json({message: `Report ${req.params.id} has been updated !`})
						}).catch((err) => {
						logger.info(`Something went wrong when trying to update comment report ${req.params.id}`)
						res.status(500).json(err)
					})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to find user in function update(commentReports)`)
			res.status(500).json(err)
		})
	}
}

/**
 * @api {put} /api/report/comment/:id Delete Comment Report
 * @apiName DeleteCommentReport
 * @apiGroup Post Reports and Comments reports
 *
 * @apiParam {Number} CommentReportId id(unique)
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
 *{
 *	"message": "You're not allowed to access this route"
 *}
 */
exports.delete = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth) {
		logger.info(`An unauthenticated user tried to access to function delete(commentReports)`)
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to function update(commentReports)`)
					res.status(403).json({message: `You're not allowed for this route !`})
				} else {
					models.CommentsReport.destroy({where: {id: req.params.id}})
						.then(() => {
							logger.info(`User ${userId} has deleted comment Report ${req.params.id}`)
							res.status(200).json({message: `This report has been deleted !`})
						})
						.catch((err) => {
							logger.info(`Something went wrong when trying to delete comment report ${req.params.id}`)
							res.status(404).json({message: `No report found with ID ${req.params.id}`, err})
						})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to find user in function delete(commentReport)`)
			res.status(500).json(err)
		})
	}
}



