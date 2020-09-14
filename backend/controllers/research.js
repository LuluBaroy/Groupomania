const models = require('../models');

exports.research = (req, res, next) => {
	if(req.body.research === '' || req.body.research === null) {
		res.status(400).json({ message: `Please complete the field before clicking on the search button`})
	} else {
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
			}).catch(err => res.status(500).json(err))
	}
}