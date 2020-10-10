module.exports = function (req, res, users, baseUrl){

	function generate(req, user, baseUrl){

		const ref = 'http://' + req.get('host') + '/' + baseUrl;
		let newUser = user.toJSON();
		newUser._links = {};
		newUser._links.self = {
			method: 'GET',
			href: ref + '/' + newUser.id
		};
		newUser._links.update = {
			method: 'PUT',
			href: ref + '/' + newUser.id
		};
		newUser._links.delete = {
			method: 'DELETE',
			href: ref + '/' + newUser.id
		};
		newUser._links.updatePrivilege = {
			method: 'PUT',
			href: ref + '/' + newUser.id + '/update_privilege'
		};
		newUser._links.signup = {
			method: 'POST',
			href: ref + '/signup'
		};
		newUser._links.login = {
			method: 'POST',
			href: ref + '/login'
		};
		newUser._links.list = {
			method: 'GET',
			href: ref
		};
		newUser._links.posts = {
			method: 'GET',
			href: 'http://' + req.get('host') + '/api/posts/from/' + newUser.id
		}
		return newUser;
	}
	if(Array.isArray(users)){
		let returnUser = [];
		users.forEach(function (user) {
			returnUser.push(generate(req, user, baseUrl));
		});
		res.status(200).json(returnUser);
	}
	else{
		if(users == null){
			res.status(404).json('No result found for id '+ req.params.id);
		} else {
			let returnUser = generate(req, users, baseUrl);
			res.status(200).json(returnUser);
		}
	}
}