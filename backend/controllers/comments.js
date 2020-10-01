require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');
//const logger = require('../middleware/winston')
'use strict';

/**
 * @api {post} /api/posts/:id/comments Create
 * @apiName Create
 * @apiGroup Comments
 *
 * @apiParam {Number} PostId id(unique)
 *
 * @apiSuccess Object Message + new comment info
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 201 Created
 *{
 *	"message":"Your comment has been sent !",
 *	"comment":{
 *		"id":28,
 *		"comment":"123",
 *		"UserId":3,
 *		"PostId":"17",
 *		"updatedAt":"2020-10-01T12:29:47.681Z",
 *		"createdAt":"2020-10-01T12:29:47.681Z"
 *	}
 *}
 * @apiErrorExample Error-Response : User not authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.create = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth) {
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Comments.create({ comment: req.body.comment, UserId: userId, PostId: req.params.id})
			.then(comment => {
				res.status(201).json({ message: `Your comment has been sent !`, comment})
			}).catch(err => res.status(500).json(err))
	}
}

/**
 * @api {post} /api/posts/:id/:comment_id/report Create Comment Report
 * @apiName CreateCommentReport
 * @apiGroup Comments
 *
 * @apiParam {Number} PostId id(unique)
 * @apiParam {Number} CommentId id(unique)
 *
 * @apiSuccess Object Message + new comment report info
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 201 Created
 *{
 *	"message":"Your report has been sent, we'll eventually contact you if we need more information !",
 *	"report":{
 *		"id":10,
 *		"CommentId":"28",
 *		"PostId":"17",
 *		"UserId":3,
 *		"report":"123456",
 *		"status":"pending",
 *		"updatedAt":"2020-10-01T12:35:17.926Z",
 *		"createdAt":"2020-10-01T12:35:17.926Z"
 *	}
 *}
 * @apiErrorExample Error-Response : User not authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.createReport = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth) {
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
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
}

/**
 * @api {put} /api/posts/:id/:comment_id Update
 * @apiName Update
 * @apiGroup Comments
 *
 * @apiParam {Number} PostId id(unique)
 * @apiParam {Number} CommentId id(unique)
 *
 * @apiSuccess Message Message
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"message":"Your comment has been updated !"
 *}
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to update this comment"
 * }
 */
exports.update = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth)
	if(!headerAuth) {
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Comments.findOne({ where: { id: req.params.comment_id }})
			.then((comment) => {
				if(comment && userId === comment.user_id){
					models.Comments.update({ comment: req.body.comment }, { where: { id: req.params.comment_id }})
						.then(() => {
							res.status(200).json({ message: `Your comment has been updated !`})
						})
						.catch((err) => res.status(500).json(err))
				} else {
					res.status(403).json({ message: `You're not allowed to update this comment`})
				}
			})
			.catch((err) => res.status(404).json({ message: `This comment doesn't exist `, err}))
	}
}

/**
 * @api {delete} /api/posts/:id/:comment_id Delete
 * @apiName Delete
 * @apiGroup Comments
 *
 * @apiParam {Number} PostId id(unique)
 * @apiParam {Number} CommentId id(unique)
 *
 * @apiSuccess Message Message
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"message":"Comment has been deleted !"
 *}
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to delete this comment"
 * }
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
}

/**
 * @api {get} /api/posts/:id/:comment_id Read One
 * @apiName ReadOne
 * @apiGroup Comments
 *
 * @apiParam {Number} PostId id(unique)
 * @apiParam {Number} CommentId id(unique)
 *
 * @apiSuccess Object Comment info
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"id":29,
 *	"comment":"123456",
 *	"user_id":3,
 *	"post_id":17,
 *	"created_at":"2020-10-01 14:44:01",
 *	"updated_at":"2020-10-01 14:44:01",
 *	"createdAt":"2020-10-01 14:44:01",
 *	"updatedAt":"2020-10-01 14:44:01",
 *	"UserId":3,
 *	"PostId":17
 *}
 * @apiErrorExample Error-Response : User not authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readOne = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth) {
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Comments.findOne({ where: { id: req.params.comment_id }})
			.then(comment => {
				res.status(200).json(comment)
			}).catch(err => res.status(500).json(err))
	}
}

/**
 * @api {get} /api/posts/:id/all/comments Read All
 * @apiName ReadOne
 * @apiGroup Comments
 *
 * @apiParam {Number} PostId id(unique)
 *
 * @apiSuccess Array All comments of the targeted post + comments info + comment author info
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *[
 *	{
 *		"id":20,
 *		"comment":"123",
 *		"user_id":2,
 *		"post_id":11,
 *		"created_at":"2020-09-29 19:43:24",
 *		"updated_at":"2020-09-29 19:43:37",
 *		"createdAt":"2020-09-29 19:43:24",
 *		"updatedAt":"2020-09-29 19:43:37",
 *		"UserId":2,
 *		"PostId":11,
 *		"User":{
 *			"id":2,
 *			"email":"deletedUser@admin.fr",
 *			"password":"$2a$10$BvS4N1seTASRfWlmRcBDN.LpKwwUp7Y/D92I..o/3xcNDyXkr58qu",
 *			"username":"Utilisateur supprimé",
 *			"role":"[\"user\",\"admin\"]",
 *			"bio":null,
 *			"url_profile_picture":"http://localhost:3000/images/deletedUser.png",
 *			"alt_profile_picture":"Photo de profil de l'utilisateur",
 *			"consents":"{\"shareable\":false,\"contactable\":false}",
 *			"created_at":"2020-09-24 17:33:09",
 *			"updated_at":"2020-09-30 19:42:58",
 *			"createdAt":"2020-09-24 17:33:09",
 *			"updatedAt":"2020-09-30 19:42:58"
 *		}
 *	},
 *	{
 *		"id":26,
 *		"comment":"123456",
 *		"user_id":3,
 *		"post_id":11,
 *		"created_at":"2020-09-30 15:07:10",
 *		"updated_at":"2020-09-30 15:07:10",
 *		"createdAt":"2020-09-30 15:07:10",
 *		"updatedAt":"2020-09-30 15:07:10",
 *		"UserId":3,
 *		"PostId":11,
 *		"User":{
 *			"id":3,
 *			"email":"test2@test.fr",
 *			"password":"$2a$10$tloa5dX6MNt.Iaw6QAMnuu/2oeO5gvW.tg7xSaVImo/0assd.12R2",
 *			"username":"Testeur test",
 *			"role":"[\"user\",\"admin\"]",
 *			"bio":"123456",
 *			"url_profile_picture":"http://localhost:3000/images/defaultPicture.png",
 *			"alt_profile_picture":"Photo de profil de l'utilisateur",
 *			"consents":"{\"shareable\":\"false\",\"contactable\":\"false\"}",
 *			"created_at":"2020-09-24 20:35:11","updated_at":"2020-09-30 18:20:24",
 *			"createdAt":"2020-09-24 20:35:11","updatedAt":"2020-09-30 18:20:24"
 *		}
 *	}
 *]
 * @apiErrorExample Error-Response : User not authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth) {
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Comments.findAll({where: {PostId: req.params.id}, include: [models.Users],
			order: [
				['id', 'ASC']
			]
		})
			.then(comments => {
				res.status(200).json(comments)
			}).catch(err => res.status(500).json(err))
	}
}
