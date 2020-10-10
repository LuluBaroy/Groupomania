module.exports = function (req, res, posts, baseUrl){

	function generate(req, post, baseUrl){
		const ref = 'http://' + req.get('host') + '/' + baseUrl;
		let newPost = post.toJSON();
		newPost._links = {};
		newPost._links.self = {
			method: 'GET',
			href: ref + '/' + newPost.id
		};
		newPost._links.create = {
			method: 'POST',
			href: ref
		};
		newPost._links.update = {
			method: 'PUT',
			href: ref + '/' + newPost.id
		};
		newPost._links.delete = {
			method: 'DELETE',
			href: ref +  '/' + newPost.id
		};
		newPost._links.like = {
			method: 'POST',
			href: ref + '/' + newPost.id + '/like'
		};
		newPost._links.readLike = {
			method: 'GET',
			href: ref + '/' + newPost.id + '/like'
		};
		newPost._links.list = {
			method: 'GET',
			href: ref
		};
		newPost._links.report = {
			method: 'POST',
			href: ref + '/' + newPost.id + '/report'
		};
		return newPost;
	}
	if(Array.isArray(posts)){
		let returnPost = [];
		posts.forEach(function (post) {
			returnPost.push(generate(req, post, baseUrl));
		});
		res.status(200).json(returnPost);
	}
	else{
		if(posts == null){
			res.status(404).json('No result found for id '+req.params.id);
		} else {
			let returnPost = generate(req, posts, baseUrl);
			res.status(200).json(returnPost);
		}
	}
}