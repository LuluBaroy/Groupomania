'use strict';
require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');
const logger = require('../middlewares/winston');
const validator = require('validator');
const hateoasComment = require('../services/hateoasComment');
const xss = require('xss')

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
	let regex = /[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth) {
		logger.info(`an unauthenticated user tried to create a comment`)
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		if(req.body.comment === null) {
			res.status(400).json({message: 'Comment is required'})
		} else if (validator.matches(req.body.comment, regex)){
			res.status(422).json({message: `Wrong format - Please don't use : |/*+&#{([]})<>$£€%=^`})
		} else {
			models.Comments.create({ comment: xss(req.body.comment), UserId: userId, PostId: req.params.id})
				.then(comment => {
					logger.info(`User ${userId} has commented post ${req.params.id}`)
					res.status(201).json({ message: `Your comment has been sent !`, comment})
				}).catch(err => {
					logger.info(`User ${userId} couldn't comment post ${req.params.id}`);
					res.status(500).json(err)
				})
		}
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
	let regex = /[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth) {
		logger.info(`An unauthenticated user tried to create a comment report`)
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		if(req.body.report === null){
			res.status(400).json({ message: 'Report is required'})
		} else if (validator.matches(req.body.report, regex)){
			res.status(422).json({message: `Wrong format - Please don't use : |/*+&#{([]})<>$£€%=^`})
		} else {
			models.CommentsReport.create({
				CommentId: req.params.comment_id,
				PostId: req.params.id,
				UserId: userId,
				report: xss(req.body.report),
				status: 'pending'
			})
				.then((report) => {
					logger.info(`User ${userId} has created a comment report about comment ${req.params.comment_id}`)
					res.status(201).json({ message: `Your report has been sent, we'll eventually contact you if we need more information !`, report })
				}).catch((err) => {
					logger.info(`User ${userId} couldn't create a comment report about comment ${req.params.comment_id}`);
					res.status(500).json(err)
				})
		}

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
	let regex = /[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth)
	if(!headerAuth) {
		logger.info(`an unauthenticated user tried to update a comment`)
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		if(req.body.comment === null){
			res.status(400).json({ message: 'Comment is required'})
		} else if(validator.matches(req.body.comment, regex)){
			res.status(422).json({message: `Wrong format - Please don't use : |/*+&#{([]})<>$£€%=^`})
		} else {
			models.Users.findOne({where: {id: userId}})
				.then(user => {
					if(!user){
						res.status(400).json({ message: `We couldn't authenticate user, please log in or sign up !`})
					} else {
						models.Comments.findOne({ where: { id: req.params.comment_id }})
							.then((comment) => {
								if(comment && userId === comment.user_id || user.role.includes('admin')){
									models.Comments.update({ comment: xss(req.body.comment) }, { where: { id: req.params.comment_id }})
										.then(() => {
											logger.info(`User ${userId} has updated comment ${req.params.comment_id}`)
											res.status(200).json({ message: `Your comment has been updated !`})
										})
										.catch((err) => {
											logger.info(`User ${userId} couldn't update comment ${req.params.comment_id}`);
											res.status(500).json(err)
										})
								} else {
									logger.info(`User ${userId} has tried to update comment ${req.params.comment_id}`)
									res.status(403).json({ message: `You're not allowed to update this comment`})
								}
							})
							.catch((err) => {
								logger.info(`Something went wrong when trying to search a comment (function updateComment)`);
								res.status(404).json({ message: `This comment doesn't exist `, err})
							})
					}
				})

		}
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
		logger.info(`An unauthenticated user tried to delete a comment`)
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
										.then(() => {
											logger.info(`User ${userId} has deleted comment ${req.params.comment_id}`)
											res.status(200).json({message: `Comment has been deleted !`})
										})
										.catch(err => {
											logger.info(`User ${userId} couldn't delete comment ${req.params.comment_id}`);
											res.status(500).json(err)
										})
								}).catch(err => {
									logger.info(`User ${userId} couldn't delete a comment report (function delete comment)`);
									res.status(500).json(err)
								})
						} else {
							logger.info(`User ${userId} tried to delete comment ${req.params.comment_id}`)
							res.status(403).json({ message: `You're not allowed to delete this comment`})
						}
					}).catch((err) => {
						logger.info(`Something went wrong when trying to search a comment`);
						res.status(404).json({message: `This comment doesn't exist `, err})
					})
			}).catch(err => {
				logger.info(`Something went wrong when trying to search an user (function delete comment)`);
				res.status(500).json(err)
			})
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
    "id": 13,
    "comment": "123456789  ",
    "user_id": 23,
    "post_id": 17,
    "created_at": "2020-10-09 00:12:07",
    "updated_at": "2020-10-09 00:12:19",
    "createdAt": "2020-10-09 00:12:07",
    "updatedAt": "2020-10-09 00:12:19",
    "UserId": 23,
    "PostId": 17,
    "_links": {
        "self": {
            "method": "GET",
            "href": "http://localhost:3000/api/posts/17/13"
        },
        "create": {
            "method": "POST",
            "href": "http://localhost:3000/api/posts/17/comments"
        },
        "update": {
            "method": "PUT",
            "href": "http://localhost:3000/api/posts/17/13"
        },
        "delete": {
            "method": "DELETE",
            "href": "http://localhost:3000/api/posts/17/13"
        },
        "list": {
            "method": "GET",
            "href": "http://localhost:3000/api/posts/17/all/comments"
        },
        "report": {
            "method": "POST",
            "href": "http://localhost:3000/api/posts/17/13/report"
        }
    }
}
 * @apiErrorExample Error-Response : User not authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readOne = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth) {
		logger.info(`An unauthenticated user tried to delete a comment`)
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Comments.findOne({ where: { id: req.params.comment_id }})
			.then(comment => {
				logger.info(`User got comment ${req.params.comment_id}`)
				hateoasComment(req, res, comment, `api/posts/${req.params.id}`)
			}).catch(err => {logger.info(`Something went wrong when trying to search for a comment (function readOne comment)`); res.status(500).json(err)})
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
    {
        "id": 13,
        "comment": "123456789  ",
        "user_id": 23,
        "post_id": 17,
        "created_at": "2020-10-09 00:12:07",
        "updated_at": "2020-10-09 00:12:19",
        "createdAt": "2020-10-09 00:12:07",
        "updatedAt": "2020-10-09 00:12:19",
        "UserId": 23,
        "PostId": 17,
        "User": {
            "id": 23,
            "email": "testeur@test.fr",
            "password": "$2a$10$YyHAqe4XPGsdSsFSHzDRIOA/amw4pvCI0F59w7GadcHRFZdmgP8hu",
            "username": "Lulu Baroy",
            "role": "[\"user\"]",
            "bio": "",
            "url_profile_picture": "http://localhost:3000/images/9792965802.gif",
            "alt_profile_picture": "Photo de profil de l'utilisateur",
            "consents": "{\"shareable\":false,\"contactable\":false}",
            "lastLogin": "2020-10-08 23:51:40",
            "created_at": "2020-10-08 23:51:06",
            "updated_at": "2020-10-08 23:51:40",
            "createdAt": "2020-10-08 23:51:06",
            "updatedAt": "2020-10-08 23:51:40"
        },
        "_links": {
            "self": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts/17/13"
            },
            "create": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts/17/comments"
            },
            "update": {
                "method": "PUT",
                "href": "http://localhost:3000/api/posts/17/13"
            },
            "delete": {
                "method": "DELETE",
                "href": "http://localhost:3000/api/posts/17/13"
            },
            "list": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts/17/all/comments"
            },
            "report": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts/17/13/report"
            }
        }
    },
    {
        "id": 14,
        "comment": "123lkjhghjklkjhgghjkl",
        "user_id": 23,
        "post_id": 17,
        "created_at": "2020-10-09 00:27:55",
        "updated_at": "2020-10-09 00:28:51",
        "createdAt": "2020-10-09 00:27:55",
        "updatedAt": "2020-10-09 00:28:51",
        "UserId": 23,
        "PostId": 17,
        "User": {
            "id": 23,
            "email": "testeur@test.fr",
            "password": "$2a$10$YyHAqe4XPGsdSsFSHzDRIOA/amw4pvCI0F59w7GadcHRFZdmgP8hu",
            "username": "Lulu Baroy",
            "role": "[\"user\"]",
            "bio": "",
            "url_profile_picture": "http://localhost:3000/images/9792965802.gif",
            "alt_profile_picture": "Photo de profil de l'utilisateur",
            "consents": "{\"shareable\":false,\"contactable\":false}",
            "lastLogin": "2020-10-08 23:51:40",
            "created_at": "2020-10-08 23:51:06",
            "updated_at": "2020-10-08 23:51:40",
            "createdAt": "2020-10-08 23:51:06",
            "updatedAt": "2020-10-08 23:51:40"
        },
        "_links": {
            "self": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts/17/14"
            },
            "create": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts/17/comments"
            },
            "update": {
                "method": "PUT",
                "href": "http://localhost:3000/api/posts/17/14"
            },
            "delete": {
                "method": "DELETE",
                "href": "http://localhost:3000/api/posts/17/14"
            },
            "list": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts/17/all/comments"
            },
            "report": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts/17/14/report"
            }
        }
    }
]
 * @apiErrorExample Error-Response : User not authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth) {
		logger.info(`An unauthenticated user tried to delete a comment`)
		res.status(400).json({message: `You're not authenticated, please log in!`})
	} else {
		models.Comments.findAll({where: {PostId: req.params.id}, include: [models.Users],
			order: [
				['id', 'ASC']
			]
		})
			.then(comment => {
				let comments = comment
				comments.forEach(comment => {
					comment.User.url_profile_picture = `${req.protocol}://${req.get('host')}/images/${comment.User.url_profile_picture}`
				})
				logger.info(`User got all comments from post ${req.params.id}`)
				hateoasComment(req, res, comments, `api/posts/${req.params.id}`)
			}).catch(err => {logger.info(`Something went wrong when trying to search for all comments from post ${req.params.id}`);res.status(500).json(err)})
	}
}
