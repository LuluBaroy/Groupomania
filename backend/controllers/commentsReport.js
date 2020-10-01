//IF ADMIN
require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');
//const logger = require('../middleware/winston')
'use strict';

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
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					res.status(403).json({message: `You're not allowed for this route !`})
				} else {
					models.CommentsReport.update({status: 'treated'}, {where: {id: req.params.id}})
						.then(() => {
							res.status(200).json({message: `Report ${req.params.id} has been updated !`})
						}).catch((err) => res.status(500).json(err))
				}
			}).catch(err => res.status(500).json(err))
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
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					res.status(403).json({message: `You're not allowed for this route !`})
				} else {
					models.CommentsReport.destroy({where: {id: req.params.id}})
						.then(() => {
							res.status(200).json({message: `This report has been deleted !`})
						})
						.catch((err) => res.status(404).json({message: `No report found with ID ${req.params.id}`, err}))
				}
			}).catch(err => res.status(500).json(err))
	}
}



