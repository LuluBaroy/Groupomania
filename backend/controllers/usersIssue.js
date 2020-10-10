'use strict';
require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');
const logger = require('../middlewares/winston');
const validator = require('validator');
const xss = require('xss')
const hateoasIssues = require('../services/hateoasIssueReport')

/**
 * @api {post} /api/issue Create
 * @apiName Create
 * @apiGroup User Issue
 *
 * @apiSuccess Issue Issue created
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 201 Created
 *{
 *	"id":6,
 *	"lastName":"Baroy",
 *	"firstName":"Lulu",
 *	"email":"test@test.fr",
 *	"issue":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
 *	incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
 *	ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
 *	in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
 *	non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
 *	"status":"pending",
 *	"updatedAt":"2020-09-30T17:55:08.939Z",
 *	"createdAt":"2020-09-30T17:55:08.939Z"
 *}
 */
exports.create = (req, res, next) => {
	if(validator.matches(req.body.lastName, /[\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`0-9]/) || validator.matches(req.body.firstName, /[\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`0-9]/) ) {
		return res.status(422).json({ message: `Last name and first name must contain only letters, spaces, hyphens or apostrophe`})
	} else if (validator.matches(req.body.issue, /[\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/)) {
		return res.status(422).json({ message: `Issue must not contain |/*+&#{[]})<>$£€%=^`})
	} else if (!validator.isEmail(req.body.email)){
		return res.status(422).json({ message: `Email must be a valid email`})
	} else {
		let body = req.body
		body.lastName = xss(req.body.lastName)
		body.firstName = xss(req.body.firstName)
		body.email = xss(req.body.email)
		body.issue = xss(req.body.issue)
		models.UserIssues.create({
			...body,
			status: 'pending'
		})
			.then(issue => {
				logger.info('An user has created a new issue')
				res.status(201).json(issue)
			})
			.catch(err => {
				logger.info('Something went wrong when an user tried to create an issue')
				res.status(500).json(err)
			})
	}
}

/**
 * @api {put} /api/issue/:id Update
 * @apiName Update
 * @apiGroup User Issue
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiParam {Number} IssueId id(unique)
 *
 * @apiSuccess message message issue updated
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 * "message":"User Issue updated"
 *}
 *
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to access this route"
 * }
 */
exports.update = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({ where: {id: userId}})
		.then(user => {
			if (!user) {
				logger.info('An unauthenticated user tried to access to updateIssue function')
				res.status(400).json({message: `We couldn't authenticate you, please log in or sign up !`})
			} else {
				let roles = JSON.parse(user.role)
				if (!roles.includes('admin')) {
					logger.info(`User ${userId} tried to access to updateIssue function`)
					res.status(403).json({message: `You're not allowed to access this route`})
				} else {
					models.UserIssues.update({status: 'treated'}, {where: {id: req.params.id}})
						.then(() => {
							logger.info(`UserIssue ${req.params.id} has been updated`)
							res.status(200).json({ message: `User Issue updated`})
						})
						.catch(err => {
							logger.info(`Something went wrong when trying to update UserIssue ${req.params.id}`)
							res.status(500).json(err)
						})
				}
			}
		}).catch(err => {
			logger.info(`Something went wrong when trying to search for user ${userId} in function updateIssue`)
		res.status(500).json(err)
	})
}

/**
 * @api {get} /api/issue/ Read All
 * @apiName ReadAll
 * @apiGroup User Issue
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiSuccess Array array All issues
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *[
    {
        "id": 1,
        "lastName": "212123456789",
        "firstName": "Lulu",
        "email": "test@test.fr",
        "issue": "123456",
        "status": "treated",
        "created_at": "2020-10-06 06:10:43",
        "updated_at": "2020-10-08 17:15:46",
        "createdAt": "2020-10-06 06:10:43",
        "updatedAt": "2020-10-08 17:15:46",
        "_links": {
            "self": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue"
            },
            "update": {
                "method": "PUT",
                "href": "http://localhost:3000/api/issue/1"
            },
            "delete": {
                "method": "DELETE",
                "href": "http://localhost:3000/api/issue/1"
            },
            "allWaiting": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue/all/messageWaiting"
            },
            "create": {
                "method": "POST",
                "href": "http://localhost:3000/api/issue"
            },
            "allPending": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue/all/pending"
            }
        }
    },
    {
        "id": 2,
        "lastName": "212123456789",
        "firstName": "Lulu",
        "email": "test@test.fr",
        "issue": "123456",
        "status": "treated",
        "created_at": "2020-10-06 06:11:51",
        "updated_at": "2020-10-08 17:15:50",
        "createdAt": "2020-10-06 06:11:51",
        "updatedAt": "2020-10-08 17:15:50",
        "_links": {
            "self": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue"
            },
            "update": {
                "method": "PUT",
                "href": "http://localhost:3000/api/issue/2"
            },
            "delete": {
                "method": "DELETE",
                "href": "http://localhost:3000/api/issue/2"
            },
            "allWaiting": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue/all/messageWaiting"
            },
            "create": {
                "method": "POST",
                "href": "http://localhost:3000/api/issue"
            },
            "allPending": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue/all/pending"
            }
        }
    },
    {
        "id": 3,
        "lastName": "212123456789",
        "firstName": "Lulu",
        "email": "test@test.fr",
        "issue": "123456",
        "status": "treated",
        "created_at": "2020-10-06 06:12:46",
        "updated_at": "2020-10-08 17:15:55",
        "createdAt": "2020-10-06 06:12:46",
        "updatedAt": "2020-10-08 17:15:55",
        "_links": {
            "self": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue"
            },
            "update": {
                "method": "PUT",
                "href": "http://localhost:3000/api/issue/3"
            },
            "delete": {
                "method": "DELETE",
                "href": "http://localhost:3000/api/issue/3"
            },
            "allWaiting": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue/all/messageWaiting"
            },
            "create": {
                "method": "POST",
                "href": "http://localhost:3000/api/issue"
            },
            "allPending": {
                "method": "GET",
                "href": "http://localhost:3000/api/issue/all/pending"
            }
        }
    }
 ]
 */
exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({ where: {id: userId}})
		.then(user => {
			if (!user) {
				logger.info('Un unauthenticated user tried to access to function readAllIssue')
				res.status(404).json({message: `We couldn't authenticate you, please log in or sign up !`})
			} else {
				let roles = JSON.parse(user.role)
				if (!roles.includes('admin')) {
					logger.info(`User ${userId} tried to access to function readAllIssues`)
					res.status(403).json({message: `You're not allowed to access this route`})
				} else {
					models.UserIssues.findAll()
						.then(issue => {
							logger.info(`User ${userId} got all user issues`)
							let issues = hateoasIssues(req, issue, 'api/issue')
							res.status(200).json(issues)
						}).catch(err => {
							logger.info(`Something went wrong when trying to get all user issues`)
						res.status(500).json(err)
					})
				}
			}
		}).catch(err => {
			logger.info(`Something went wrong when trying to find user ${userId} in function ReadAllIssues`)
		res.status(500).json(err)
	})
}

/**
 * @api {get} /api/issue/all/pending Read All Pending
 * @apiName ReadAllPending
 * @apiGroup User Issue
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiSuccess Array All issues with status 'pending'
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *[
 *	{
 *		"id":6,
 *		"lastName":"Baroy",
 *		"firstName":"Lulu",
 *		"email":"test@test.fr",
 *		"issue":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor i",
 *		"status":"pending",
 *		"created_at":"2020-09-30 19:55:08",
 *		"updated_at":"2020-09-30 19:55:08",
 *		"createdAt":"2020-09-30 19:55:08",
 *		"updatedAt":"2020-09-30 19:55:08"
 *	}
 *]
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to access this route"
 * }
 */
exports.readAllPending = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info('An unauthenticated user tried to access to function readAllPendingIssues')
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to function readAllPendingIssues`)
					res.status(403).json({message: `You're not allowed for this route !`})
				} else {
					models.UserIssues.findAll({where: {status: 'pending'}}, {
						order: [
							['id', 'DESC']
						]
					})
						.then(issues => {
							if(issues.length === 0){
								logger.info(`User ${userId} got all issues with status 'pending' - here zero`)
								res.status(200).json({ message: `There is no user issue with status 'pending' !`})
							} else {
								logger.info(`User ${userId} got all issues with status 'pending'`)
								res.status(200).json(issues)
							}
						}).catch(err => {
						logger.info(`Something went wrong when trying to search for all issues with status 'pending'`)
						res.status(500).json(err)
					})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to find a user in function readAllPendingIssues`)
			res.status(500).json(err)
		})
	}
}

/**
 * @api {delete} /api/issue/:id Delete
 * @apiName Delete
 * @apiGroup User Issue
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiParam {Number} IssueId id(unique)
 *
 * @apiSuccess Message message
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *     "message": "The user issue has been deleted !"
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
		logger.info(`An unauthenticated user tried to access to function deleteIssue`)
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to function deleteIssue`)
					res.status(403).json({message: `You're not allowed for this route !`})
				} else {
					models.UserIssues.destroy({where: {id: req.params.id}})
						.then(() => {
							logger.info(`User ${userId} has deleted userIssue ${req.params.id}`)
							res.status(200).json({ message: `The user issue has been deleted !`})
						}).catch(err => {
						logger.info(`Something went wrong when trying to delete an user issue`)
						res.status(500).json(err)
					})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to find user in function deleteIssue`)
			res.status(500).json(err)
		})
	}
}

/**
 * @api {get} /api/issue/all/messageWaiting Read Waiting Messages
 * @apiName ReadMessageWaiting
 * @apiGroup User Issue
 *
 * @apiDescription ⚠️Admin role needed
 *
 * @apiSuccess Waiting All issues and reports waiting
 *
 * @apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *	"issues":[
 *		{
 *			"id":6,
 *			"lastName":"Baroy",
 *			"firstName":"Lulu",
 *			"email":"test@test.fr",
 *			"issue":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor i",
 *			"status":"pending",
 *			"created_at":"2020-09-30 19:55:08",
 *			"updated_at":"2020-09-30 19:55:08",
 *			"createdAt":"2020-09-30 19:55:08",
 *			"updatedAt":"2020-09-30 19:55:08"
 *		}
 *	],
 *	"postReports":[
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
 *		}
 *	],
 *	"commentReports":[],
 *	"total":4
 *}
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to access this route"
 * }
 */
exports.readMessageWaiting = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	let userId = jwtUtils.getUserId(headerAuth);
	if(!headerAuth){
		logger.info(`An unauthenticated user tried to access to readMessageWaiting function`)
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					logger.info(`User ${userId} tried to access to readMessageWaiting function`)
					res.status(403).json({message: `You're not allowed for this route !`})
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
										logger.info(`User ${userId} got all waiting messages`)
										res.status(200).json({issues, postReports, commentReports, total})
									})
									.catch(err => {
										logger.info(`Something went wrong when trying to get all commentsReports with status 'pending' in function readMessageWaiting`)
										res.status(500).json(err)
									})
							}).catch(err => {
							logger.info(`Something went wrong when trying to get all postsReports with status 'pending' in function readMessageWaiting`)
							res.status(500).json(err)
						})
					}).catch(err =>{
						logger.info(`Something went wrong when trying to get all userIssues with status 'pending' in function readMessageWaiting`)
						res.status(500).json(err)
					})
				}
			}).catch(err => {
			logger.info(`Something went wrong when trying to find user in function readMessageWaiting`)
			res.status(500).json(err)
		})
	}
}