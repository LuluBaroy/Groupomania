require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');

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
	models.UserIssues.create({
		...req.body,
		status: 'pending'
	})
		.then(issue => res.status(201).json(issue))
		.catch(err => res.status(500).json(err))
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
				res.status(400).json({message: `We couldn't authenticate you, please log in or sign up !`})
			} else {
				let roles = JSON.parse(user.role)
				if (!roles.includes('admin')) {
					res.status(403).json({message: `You're not allowed to access this route`})
				} else {
					models.UserIssues.update({status: 'treated'}, {where: {id: req.params.id}})
						.then(() => {
							res.status(200).json({ message: `User Issue updated`})
						})
						.catch(err => res.status(500).json(err))
				}
			}
		}).catch(err => res.status(500).json(err))
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
 *	{
 *		"id":3,
 *		"lastName":"Baroy",
 *		"firstName":"Lulu",
 *		"email":"test@test.fr",
 *		"issue":"blablablbalbaa",
 *		"status":"treated",
 *		"created_at":"2020-09-27 14:38:34",
 *		"updated_at":"2020-09-27 14:38:49",
 *		"createdAt":"2020-09-27 14:38:34",
 *		"updatedAt":"2020-09-27 14:38:49"
 *	},
 *	{
 *		"id":5,
 *		"lastName":"hgbvd",
 *		"firstName":"gtfdsx",
 *		"email":"htgfds",
 *		"issue":"htgrefegthyuiytr",
 *		"status":"pending",
 *		"created_at":"2020-09-27 19:56:18",
 *		"updated_at":"2020-09-30 19:59:22",
 *		"createdAt":"2020-09-27 19:56:18",
 *		"updatedAt":"2020-09-30 19:59:22"
 *	}
 *]
 * @apiErrorExample Error-Response : User not allowed for this action
 * HTTP/1.1 403 Forbidden
 * {
 *     "message": "You're not allowed to access this route"
 * }
 */
exports.readAll = (req, res, next) => {
	const headerAuth = req.headers['authorization'];
	const userId = jwtUtils.getUserId(headerAuth);
	models.Users.findOne({ where: {id: userId}})
		.then(user => {
			if (!user) {
				res.status(404).json({message: `We couldn't authenticate you, please log in or sign up !`})
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
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					res.status(403).json({message: `You're not allowed for this route !`})
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
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
					res.status(403).json({message: `You're not allowed for this route !`})
				} else {
					models.UserIssues.destroy({where: {id: req.params.id}})
						.then(() => {
							res.status(200).json({ message: `The user issue has been deleted !`})
						}).catch(err => res.status(500).json(err))
				}
			}).catch(err => res.status(500).json(err))
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
		res.status(400).json({message: `You're not authenticated, please log in !`})
	} else {
		models.Users.findOne({where: {id: userId}})
			.then(admin => {
				let role = JSON.parse(admin.role);
				if (!role.includes('admin')) {
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
										res.status(200).json({issues, postReports, commentReports, total})
									})
									.catch(err => res.status(500).json(err))
							}).catch(err => res.status(500).json(err))
					})
				}
			})
	}
}