const models = require('../models');

exports.research = (req, res, next) => {
	let username = req.body.research.toUpperCase()
	models.Users.findAll()
		.then(users => {
			if(users.length === 0){
				users = 'There is no user with this username'
				res.status(200).json(users)
			} else {
				let usersCorresponding = []
				for(let i in users){
					if(users[i].username.toUpperCase().includes(username)){
						usersCorresponding.push(users[i])
					}
					if(i == users.length -1){
						res.status(200).json(usersCorresponding)
					}
				}
			}
		}).catch(err => res.status(404).json(err))
}