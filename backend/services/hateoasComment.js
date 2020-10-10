module.exports = function (req, res, comments, baseUrl){

	function generate(req, res, comment, baseUrl){
		const ref = 'http://' + req.get('host') + '/' + baseUrl;
		let newComment = comment.toJSON();
		newComment._links = {};
		newComment._links.self = {
			method: 'GET',
			href: ref + '/' + newComment.id
		};
		newComment._links.create = {
			method: 'POST',
			href: ref + '/comments'
		};
		newComment._links.update = {
			method: 'PUT',
			href: ref + '/' + newComment.id
		};
		newComment._links.delete = {
			method: 'DELETE',
			href: ref +  '/' + newComment.id
		};
		newComment._links.list = {
			method: 'GET',
			href: ref + '/all/comments'
		};
		newComment._links.report = {
			method: 'POST',
			href: ref + '/' + newComment.id + '/report'
		};
		return newComment;
	}
	if(Array.isArray(comments)){
		let returnComment = [];
		comments.forEach(function (comment) {
			returnComment.push(generate(req, res, comment, baseUrl));
		});
		res.status(200).json(returnComment);
	}
	else{
		if(comments == null){
			res.status(404).json('No result found for id '+ req.params.id);
		}
		let returnComment = generate(req, res, comments, baseUrl);
		res.status(200).json(returnComment);
	}
}