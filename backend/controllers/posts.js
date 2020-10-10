'use strict';
require('dotenv').config();
const hateoas = require('../services/hateoasPost')
const models = require('../models');
const validator = require('validator');
const jwtUtils = require('../middlewares/jwt');
const fs = require('fs');
const logger = require('../middlewares/winston');
const xss = require('xss');

/**
 * @api {post} /api/posts Create
 * @apiName Create
 * @apiGroup Posts
 *
 * @apiSuccess Object Message + new post info
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *{
 *	"message":"You're post has been created !",
 *	"post":{
 *		"id":18,
 *		"title":"123",
 *		"UserId":3,
 *		"content":"123",
 *		"url_gif":"http://localhost:3000/images/4629494962.gif",
 *		"alt_gif":"GIF partagé par l'utilisateur",
 *		"updatedAt":"2020-10-01T12:56:04.501Z",
 *		"createdAt":"2020-10-01T12:56:04.501Z"
 *	}
 *}
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.create = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let regex = /[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function create(post)`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
	} else {
		if(!req.file){
			res.status(400).json({message: `File is required`})
		} else if (validator.matches(req.body.title, regex) || validator.matches(req.body.content, regex)) {
			res.status(422).json({message: `Wrong format - Please don't use : |/*+&#{([]})<>$£€%=^`})
		} else {
			let userId = jwtUtils.getUserId(headerAuth);
			let urlGif, altGif;
			urlGif = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
			altGif = "GIF partagé par l'utilisateur"
			models.Posts.create({ title: xss(req.body.title), UserId: userId, content: xss(req.body.content), url_gif: urlGif, alt_gif: altGif })
				.then((post) => {
					logger.info(`User ${userId} has published a post`)
					res.status(201).json({message: `You're post has been created !`, post})
				})
				.catch((err) => {
					logger.info(`Something went wrong when trying to create a post`)
					res.status(500).json(err)
				})
		}
	}
}

/**
 * @api {post} /api/posts/:id/like Create Like
 * @apiName CreateLike
 * @apiGroup Posts
 *
 * @apiParam {Number} PostId id(unique)
 *
 * @apiSuccess Object new like info
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *{
 *	"id":23,
 *	"post_id":"17",
 *	"user_id":3,
 *	"updatedAt":"2020-10-01T12:59:53.353Z",
 *	"createdAt":"2020-10-01T12:59:53.353Z"
 *}
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.createLike = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function createLike(post)`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
	} else {
		let userId = jwtUtils.getUserId(headerAuth);
		models.Likes.findOne({ where: { user_id: userId, post_id: req.params.id }})
			.then(likes => {
				if(likes){
					models.Likes.destroy({ where: { user_id: userId, post_id: req.params.id}})
						.then(() => {
							logger.info(`User ${userId} has disliked post ${req.params.id}`)
							res.status(200).json({message: `Your like has been removed from that post !`})
						})
						.catch(error => {
							logger.info(`Something went wrong when trying to dislike post ${req.params.id}`)
							res.status(400).json({error})
						})
				} else {
					models.Likes.create({
						post_id: req.params.id,
						user_id: userId
					})
						.then((like) => {
							logger.info(`User ${userId} has liked post ${req.params.id}`)
							res.status(201).json(like)
						})
						.catch(error => {
							logger.info(`Something went wrong when trying to like post ${req.params.id}`)
							res.status(400).json({error})
						})
				}
			}).catch(err => {
			logger.info(`Somethig went wrong when trying to find likes in function createLike(post)`)
			res.status(500).json(err)
		})
	}

}

/**
 * @api {get} /api/posts/:id/like Read Like
 * @apiName ReadLike
 * @apiGroup Posts
 *
 * @apiParam {Number} PostId id(unique)
 *
 * @apiSuccess Array all likes info of the targeted post
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *[
 *	{
 *		"id":2,
 *		"username":"Utilisateur supprimé",
 *		"url_profile_picture":"http://localhost:3000/images/deletedUser.png",
 *		"alt_profile_picture":"Photo de profil de l'utilisateur"
 *	},
 *	{
 *		"id":3,
 *		"username":"Testeur test",
 *		"url_profile_picture":"http://localhost:3000/images/defaultPicture.png",
 *		"alt_profile_picture":"Photo de profil de l'utilisateur"
 *	}
 *]
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readLike = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userLiked = []
	let userInfo = []
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function readLike(post)`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
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
									logger.info(`An user got likes for post ${req.params.id}`)
									res.status(200).json(userInfo)
								}
							})).catch(err => {
							logger.info(`Something went wrong when trying to find users in function readLike(post)`)
							res.status(500).json(err)
						})
					}
				} else {
					logger.info(`an user got likes for post ${req.params.id} - here zero`)
					res.status(200).json(likes)
				}

			}).catch(err => {
			logger.info(`Something went wrong when trying to find all likes in function readLike(post)`)
			res.status(500).json(err)
		})
	}

}

/**
 * @api {put} /api/posts/:id Update
 * @apiName Update
 * @apiGroup Posts
 *
 * @apiParam {Number} PostId id(unique)
 *
 * @apiSuccess Message message
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *{
 *	"message":"Your post has been updated !"
 *}
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *	"message": "You're not authenticated, please log in !"
 *}
 */
exports.update = (req, res, next) => {
	let regex = /[\|\/\\\*\+&#\{\(\[\]\}\)<>$£%=\^`]/
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function update(post)`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
	} else {
		if (req.body.title && validator.matches(req.body.title, regex) || req.body.content && validator.matches(req.body.content, regex)) {
			res.status(422).json({message: `Wrong format - Please don't use : |/*+&#{([]})<>$£€%=^`})
		} else {
			let userId = jwtUtils.getUserId(headerAuth);
			models.Users.findOne({where: {id: userId}})
				.then((user) => {
					models.Posts.findOne({where: {id: req.params.id}})
						.then((post) => {
							if (post && userId === post.user_id || JSON.parse(user.role).includes('admin')) {
								let urlGif, altGif;
								if (req.file) {
									if (post.url_gif !== null) {
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
								models.Posts.update({
									...req.body,
									url_gif: urlGif,
									alt_gif: altGif
								}, {where: {id: req.params.id}})
									.then(() => {
										logger.info(`User ${userId} has updated post ${req.params.id}`)
										res.status(200).json({message: `Your post has been updated !`})
									})
									.catch((err) => {
										logger.info(`Something went wrong when trying to update post ${req.params.id}`)
										res.status(500).json(err)
									})
							} else {
								logger.info(`User ${userId} tried to update post ${req.params.id}`)
								res.status(403).json({message: `You're not allowed to update this post ! `})
							}
						})
						.catch((err) => {
							logger.info(`Something went wrong when trying to find post ${req.params.id}`)
							res.status(404).json({message: `This post doesn't exist `, err})
						})
				}).catch(err => {
				logger.info(`Something went wrong when trying to find user in function update(post)`)
				res.status(500).json(err)
			})
		}

	}

}

/**
 * @api {delete} /api/posts/:id Delete
 * @apiName Delete
 * @apiGroup Posts
 *
 * @apiParam {Number} PostId id(unique)
 *
 * @apiSuccess Message message
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *{
 *	"message":"Post deleted"
 *}
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *	"message": "You're not authenticated, please log in !"
 *}
 */
exports.delete = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function delete(post)`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
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
																	.then(() => {
																		logger.info(`User ${userId} has deleted post ${req.params.id}`)
																		res.status(200).json({message: 'Post deleted'})
																	}).catch(err => {
																	logger.info(`Something went wrong when trying to delete post ${req.params.id}`)
																	res.status(500).json({err})
																})
															}).catch(err => {
															logger.info(`Something went wrong when trying to delete postReports corresponding with post ${req.params.id}`)
															res.status(500).json(err)
														})
													}).catch(err => {
													logger.info(`Something went wrong when trying to delete likes corresponding with post ${req.params.id}`)
													res.status(500).json(err)
												})
											}).catch(err => {
											logger.info(`Something went wrong when trying to delete comments corresponding to post ${req.params.id}`)
											res.status(500).json(err)
										})
									}).catch(err => {
									logger.info(`something went wrong when trying to delete commentsReports corresponding to post ${req.params.id}`)
									res.status(500).json(err)
								})
							})
						} else {
							logger.info(`User ${userId} tried to delete post ${req.params.id}`)
							res.status(401).json({message: `You're not allowed to delete this post !`})
						}
					}).catch(err => {
					logger.info(`something went wrong when trying to find post ${req.params.id}`)
					res.status(404).json(err)
				})
			}).catch(err => {
			logger.info(`something went wrong when trying to find user in function delete(post)`)
			res.status(500).json(err)
		})
	}

}

/**
 * @api {get} /api/posts/:id Read One
 * @apiName ReadOne
 * @apiGroup Posts
 *
 * @apiParam {Number} PostId id(unique)
 *
 * @apiSuccess Object Post info
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *{
    "id": 16,
    "title": "123",
    "content": "123",
    "user_id": 1,
    "url_gif": "http://localhost:3000/images/3637389236.gif",
    "alt_gif": "GIF partagé par l'utilisateur",
    "created_at": "2020-10-08 19:46:33",
    "updated_at": "2020-10-08 22:34:06",
    "createdAt": "2020-10-08 19:46:33",
    "updatedAt": "2020-10-08 22:34:06",
    "UserId": 1,
    "_links": {
        "self": {
            "method": "GET",
            "href": "http://localhost:3000/api/posts/16"
        },
        "create": {
            "method": "POST",
            "href": "http://localhost:3000/api/posts"
        },
        "update": {
            "method": "PUT",
            "href": "http://localhost:3000/api/posts/16"
        },
        "delete": {
            "method": "DELETE",
            "href": "http://localhost:3000/api/posts/16"
        },
        "like": {
            "method": "POST",
            "href": "http://localhost:3000/api/posts/16/like"
        },
        "readLike": {
            "method": "GET",
            "href": "http://localhost:3000/api/posts/16/like"
        },
        "list": {
            "method": "GET",
            "href": "http://localhost:3000/api/posts"
        },
        "report": {
            "method": "POST",
            "href": "http://localhost:3000/api/posts/16/report"
        }
    }
}
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readOne = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function readOne(post)`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
	} else {
		let userId = jwtUtils.getUserId(headerAuth);
		models.Posts.findOne({ where: { id: req.params.id }})
			.then((post) => {
				logger.info(`User ${userId} got post ${req.params.id} info`)
				hateoas(req, res, post, 'api/posts')
			})
			.catch((err) => {
				logger.info(`something went wrong when trying to find post ${req.params.id}`)
				res.status(404).json(err)
			})
	}


}

/**
 * @api {get} /api/posts/ Read All
 * @apiName ReadAll
 * @apiGroup Posts
 *
 * @apiSuccess Array All posts info
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *[
    {
        "id": 17,
        "title": "123",
        "content": "123456789 🤓",
        "user_id": 23,
        "url_gif": "http://localhost:3000/images/2767281896.gif",
        "alt_gif": "GIF partagé par l'utilisateur",
        "created_at": "2020-10-08 23:52:10",
        "updated_at": "2020-10-09 00:27:40",
        "createdAt": "2020-10-08 23:52:10",
        "updatedAt": "2020-10-09 00:27:40",
        "UserId": 23,
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
        "Comments": [
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
                "PostId": 17
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
                "PostId": 17
            }
        ],
        "Likes": [],
        "_links": {
            "self": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts/17"
            },
            "create": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts"
            },
            "update": {
                "method": "PUT",
                "href": "http://localhost:3000/api/posts/17"
            },
            "delete": {
                "method": "DELETE",
                "href": "http://localhost:3000/api/posts/17"
            },
            "like": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts/17/like"
            },
            "readLike": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts/17/like"
            },
            "list": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts"
            },
            "report": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts/17/report"
            }
        }
    },
    {
        "id": 16,
        "title": "123",
        "content": "123",
        "user_id": 1,
        "url_gif": "http://localhost:3000/images/3637389236.gif",
        "alt_gif": "GIF partagé par l'utilisateur",
        "created_at": "2020-10-08 19:46:33",
        "updated_at": "2020-10-08 22:34:06",
        "createdAt": "2020-10-08 19:46:33",
        "updatedAt": "2020-10-08 22:34:06",
        "UserId": 1,
        "User": {
            "id": 1,
            "email": "test@test.fr",
            "password": "$2a$10$SooiZzedLTRPQ0o7YggyWeC3e5hR3PoN0qC3GaAU1JuzUMLwkyZIS",
            "username": "Lulu Baroy",
            "role": "[\"user\",\"admin\"]",
            "bio": "",
            "url_profile_picture": "http://localhost:3000/images/1006202404.gif",
            "alt_profile_picture": "Photo de profil de l'utilisateur",
            "consents": "{\"shareable\":\"false\",\"contactable\":\"false\"}",
            "lastLogin": "2020-10-08 19:50:12",
            "created_at": "2020-10-03 11:19:37",
            "updated_at": "2020-10-08 19:50:12",
            "createdAt": "2020-10-03 11:19:37",
            "updatedAt": "2020-10-08 19:50:12"
        },
        "Comments": [],
        "Likes": [],
        "_links": {
            "self": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts/16"
            },
            "create": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts"
            },
            "update": {
                "method": "PUT",
                "href": "http://localhost:3000/api/posts/16"
            },
            "delete": {
                "method": "DELETE",
                "href": "http://localhost:3000/api/posts/16"
            },
            "like": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts/16/like"
            },
            "readLike": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts/16/like"
            },
            "list": {
                "method": "GET",
                "href": "http://localhost:3000/api/posts"
            },
            "report": {
                "method": "POST",
                "href": "http://localhost:3000/api/posts/16/report"
            }
        }
    }
 ]
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function readAll(post)`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
	} else {
		models.Posts.findAll({ include: [models.Users, models.Comments, models.Likes],
			order: [
				['id', 'DESC']
			]
		})
			.then(posts => {
				logger.info(`user got all posts infos`)
				hateoas(req, res, posts, 'api/posts')
			})
			.catch(err => {
				logger.info(`something went wrong when trying to find all posts`)
				res.status(500).json(err)
			})
	}

}

/**
 * @api {get} /api/posts/from/:user_id Read All From One User
 * @apiName ReadAllFromOneUserId
 * @apiGroup Posts
 *
 * @apiParam {Number} PostId id(unique)
 * @apiParam {Number} UserId id(unique)
 *
 * @apiSuccess Array All posts created by the targeted user + their info + their likes + their comments
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *[
 *	{
 *		"id":17,
 *		"title":"123",
 *		"content":"www.google.fr",
 *		"user_id":3,
 *		"url_gif":"http://localhost:3000/images/7808213270.gif",
 *		"alt_gif":"GIF partagé par l'utilisateur",
 *		"created_at":"2020-09-30 15:13:55",
 *		"updated_at":"2020-09-30 15:14:25",
 *		"createdAt":"2020-09-30 15:13:55",
 *		"updatedAt":"2020-09-30 15:14:25",
 *		"UserId":3,
 *		"Likes":[
 *			{
 *				"id":23,
 *				"user_id":3,
 *				"post_id":17,
 *				"created_at":"2020-10-01 14:59:53",
 *				"updated_at":"2020-10-01 14:59:53",
 *				"createdAt":"2020-10-01 14:59:53",
 *				"updatedAt":"2020-10-01 14:59:53"
 *			}
 *		],
 *		"Comments":[
 *			{
 *				"id":29,
 *				"comment":"123456",
 *				"user_id":3,
 *				"post_id":17,
 *				"created_at":"2020-10-01 14:44:01",
 *				"updated_at":"2020-10-01 14:44:01",
 *				"createdAt":"2020-10-01 14:44:01",
 *				"updatedAt":"2020-10-01 14:44:01",
 *				"UserId":3,
 *				"PostId":17
 *			}
 *		]
 *	},
 *	{
 *		"id":18,
 *		"title":"123",
 *		"content":"123",
 *		"user_id":3,
 *		"url_gif":"http://localhost:3000/images/4629494962.gif",
 *		"alt_gif":"GIF partagé par l'utilisateur",
 *		"created_at":"2020-10-01 14:56:04",
 *		"updated_at":"2020-10-01 14:56:04",
 *		"createdAt":"2020-10-01 14:56:04",
 *		"updatedAt":"2020-10-01 14:56:04",
 *		"UserId":3,
 *		"Likes":[],
 *		"Comments":[]
 *	}
 *]
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *	"message": "You're not authenticated, please log in !"
 *}
 */
exports.readAllFromUserId = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function ReadAllFromUserId`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
	} else {
		models.Posts.findAll({ where: { user_id: req.params.user_id }, include: [models.Likes, models.Comments]}, {
			order: [
				['created_at', 'DESC']
			]
		})
			.then(posts => {
				logger.info(`User got all posts from user ${req.params.user_id}`)
				res.status(200).json(posts)
			})
			.catch(err => {
				logger.info(`something went wrong when trying to find all posts from user ${req.params.user_id}`)
				res.status(500).json(err)
			})
	}

}

/**
 * @api {post} /api/posts Create Post Report
 * @apiName CreatePostReport
 * @apiGroup Posts
 *
 * @apiSuccess Object Message + new post report info
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *{
 *	"message":"Your report has been sent, we'll eventually contact you if we need more information !",
 *	"report":{
 *		"id":11,
 *		"PostId":"18",
 *		"UserId":3,
 *		"report":"123",
 *		"status":"pending",
 *		"updatedAt":"2020-10-01T13:26:27.036Z",
 *		"createdAt":"2020-10-01T13:26:27.036Z"
 *	}
 *}
 * @apiErrorExample Error-Response: User not Authenticated
 * HTTP/1.1 400 Bad Request
 *{
 *  	"message": "You're not authenticated, please log in !"
 *}
 */
exports.createReport = (req, res, next) => {
	let regex = /[\|\/\\\*\+&#\{\(\[\]\}\)<>$£%=\^`]/
	const headerAuth = req.headers['authorization'];
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to function createReport(post)`)
		res.status(400).json({ message: `You're not authenticated, please log in ! `})
	} else {
		if (req.body.report === null) {
			res.status(400).json({ message: `Report is required`})
		} else if (validator.matches(req.body.report, regex)) {
			res.status(422).json({message: `Wrong format - Please don't use : |/*+&#{([]})<>$£€%=^`})
		} else {
			let userId = jwtUtils.getUserId(headerAuth);
			models.PostsReport.create({
				PostId: req.params.id,
				UserId: userId,
				report: xss(req.body.report),
				status: 'pending'
			})
				.then((report) => {
					logger.info(`User ${userId} has created a post report for post ${req.params.id}`)
					res.status(201).json({
						message: `Your report has been sent, we'll eventually contact you if we need more information !`,
						report
					})
				}).catch((err) => {
				logger.info(`something went wrong when trying to create report for post ${req.params.id}`)
				res.status(500).json(err)
			})
		}
	}

}

