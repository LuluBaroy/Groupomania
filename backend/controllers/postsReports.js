//IF ADMIN
'use strict';
require('dotenv').config();
const models = require('../models');
const jwtUtils = require('../middlewares/jwt');
const logger = require('../middlewares/winston');
const hateoasReport = require('../services/hateoasIssueReport')

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
    "postReports": [
        {
            "id": 8,
            "post_id": 17,
            "user_id": 23,
            "report": "123",
            "status": "pending",
            "created_at": "2020-10-09 00:26:25",
            "updated_at": "2020-10-09 00:26:25",
            "createdAt": "2020-10-09 00:26:25",
            "updatedAt": "2020-10-09 00:26:25",
            "UserId": 23,
            "PostId": 17,
            "_links": {
                "self": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/report"
                },
                "update": {
                    "method": "PUT",
                    "href": "http://localhost:3000/api/report/8"
                },
                "delete": {
                    "method": "DELETE",
                    "href": "http://localhost:3000/api/report/8"
                },
                "allWaiting": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/issue/all/messageWaiting"
                }
            }
        },
        {
            "id": 7,
            "post_id": 16,
            "user_id": 1,
            "report": "123456789",
            "status": "pending",
            "created_at": "2020-10-08 20:17:20",
            "updated_at": "2020-10-08 20:17:20",
            "createdAt": "2020-10-08 20:17:20",
            "updatedAt": "2020-10-08 20:17:20",
            "UserId": 1,
            "PostId": 16,
            "_links": {
                "self": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/report"
                },
                "update": {
                    "method": "PUT",
                    "href": "http://localhost:3000/api/report/7"
                },
                "delete": {
                    "method": "DELETE",
                    "href": "http://localhost:3000/api/report/7"
                },
                "allWaiting": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/issue/all/messageWaiting"
                }
            }
        }
    ],
    "commentReports": [
        {
            "id": 10,
            "comment_id": 14,
            "user_id": 23,
            "post_id": 17,
            "report": "123456",
            "status": "pending",
            "created_at": "2020-10-09 00:29:11",
            "updated_at": "2020-10-09 00:29:11",
            "createdAt": "2020-10-09 00:29:11",
            "updatedAt": "2020-10-09 00:29:11",
            "UserId": 23,
            "PostId": 17,
            "CommentId": 14,
            "_links": {
                "self": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/report"
                },
                "update": {
                    "method": "PUT",
                    "href": "http://localhost:3000/api/report/comment/10"
                },
                "delete": {
                    "method": "DELETE",
                    "href": "http://localhost:3000/api/report/comment/10"
                },
                "allWaiting": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/issue/all/messageWaiting"
                }
            }
        },
        {
            "id": 9,
            "comment_id": 12,
            "user_id": 1,
            "post_id": 15,
            "report": "123456789",
            "status": "treated",
            "created_at": "2020-10-08 19:31:09",
            "updated_at": "2020-10-08 19:32:34",
            "createdAt": "2020-10-08 19:31:09",
            "updatedAt": "2020-10-08 19:32:34",
            "UserId": 1,
            "PostId": 15,
            "CommentId": 12,
            "_links": {
                "self": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/report"
                },
                "update": {
                    "method": "PUT",
                    "href": "http://localhost:3000/api/report/comment/9"
                },
                "delete": {
                    "method": "DELETE",
                    "href": "http://localhost:3000/api/report/comment/9"
                },
                "allWaiting": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/issue/all/messageWaiting"
                }
            }
        },
        {
            "id": 8,
            "comment_id": 5,
            "user_id": 1,
            "post_id": 12,
            "report": "123456",
            "status": "treated",
            "created_at": "2020-10-08 17:01:03",
            "updated_at": "2020-10-08 19:41:38",
            "createdAt": "2020-10-08 17:01:03",
            "updatedAt": "2020-10-08 19:41:38",
            "UserId": 1,
            "PostId": 12,
            "CommentId": 5,
            "_links": {
                "self": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/report"
                },
                "update": {
                    "method": "PUT",
                    "href": "http://localhost:3000/api/report/comment/8"
                },
                "delete": {
                    "method": "DELETE",
                    "href": "http://localhost:3000/api/report/comment/8"
                },
                "allWaiting": {
                    "method": "GET",
                    "href": "http://localhost:3000/api/issue/all/messageWaiting"
                }
            }
        }
    ]
}
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
						.then(postReport => {
							models.CommentsReport.findAll({
								order: [
									['id', 'DESC']
								]
							}).then(commentReport => {
								logger.info(`User ${userId} got all reports`)
								let postReports = hateoasReport(req, postReport, 'api/report')
								let commentReports = hateoasReport(req, commentReport, 'api/report/comment')
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