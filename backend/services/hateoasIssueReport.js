module.exports = function (req, postReports, baseUrl){
	function generate(req, postReport, baseUrl){
		const ref = 'http://' + req.get('host') + '/' + baseUrl;
		let newPostReport = postReport.toJSON()
		newPostReport._links = {};
		if(baseUrl === 'api/report/comment'){
			newPostReport._links.self = {
				method: 'GET',
				href: 'http://' + req.get('host') + '/api/report'
			};
		} else {
			newPostReport._links.self = {
				method: 'GET',
				href: ref
			};
		}
		newPostReport._links.update = {
			method: 'PUT',
			href: ref + '/' + newPostReport.id
		};
		newPostReport._links.delete = {
			method: 'DELETE',
			href: ref + '/' + newPostReport.id
		};
		newPostReport._links.allWaiting = {
			method: 'GET',
			href: 'http://' + req.get('host') + '/api/issue/all/messageWaiting'
		};
		if(baseUrl === 'api/issue'){
			newPostReport._links.create = {
				method: 'POST',
				href: ref
			};
			newPostReport._links.allPending = {
				method: 'GET',
				href: ref + '/all/pending'
			};
		}
		return newPostReport;
	}
	if(Array.isArray(postReports)){
		let returnPost = [];
		postReports.forEach(function (postReport) {
			returnPost.push(generate(req, postReport, baseUrl));
		});
		return returnPost
	}
	else{
		if(postReports !== null){
			return generate(req, postReports, baseUrl);
		}
	}
}