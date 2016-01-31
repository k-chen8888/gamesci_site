module.exports = function(util, pages, secret) {
	var exports = {db: util.db};
	
	
	/* Express Routes */
	exports.routes = {};
	
	// Main blog page (GET)
	exports.routes.blogMain = function(req, res) {
		if (req.query.id) exports.routes.viewPost(req, res, req.query.id);
		else {
			if (exports.db) {
				exports.db.BlogPost.getBlogPost({}, {post_id: -1}).then(function(posts) {
					res.render(pages.blog + 'index', {posts: posts});
				}, function (err) {
					res.sendFile(pages.blog + 'index.html');
				});
			} else res.sendFile(pages.blog + 'index.html');
		}
	};
	
	// View a blog post (GET)
	exports.routes.viewPost = function(req, res, id) {
		if (exports.db) {
			exports.db.BlogPost.getBlogPost(Number.parseInt(id), 10).then(function(post) {
				res.render(pages.blog + 'post', {title: post.title, body: post.body});
			}, function(err) {
				res.sendFile(pages.error + '/404.html'); // Display a 404 NOT FOUND
			});
		} else res.sendFile(pages.blog + 'post.html');
	};
	
	// Form for making a blog post (GET)
	exports.routes.writePost = function(req, res) {
		if (req.query.edit && exports.db) {
			exports.db.BlogPost.getBlogPost(edit).then(function(post) {
				res.render(pages.blog + 'newpost', {title: post.title, body: post.body});
			}, function(err) {
				res.render(pages.blog + 'newpost', {title: '', body: ''});
			})
		} else res.render(pages.blog + 'newpost', {title: '', body: ''});
	};
	
	// Form for making a blog post (POST)
	exports.routes.createPost = function(req, res) {
		// Add to database if conditions are met
		if (exports.db && req.body.secret == secret) {
			exports.db.BlogPost.addBlogPost({
				title: req.body.title,
				body: req.body.body
			}).then(function(post) {
				res.redirect('/blog?id=' + post.post_id); // Go to that post
			}, function(err) {
				res.redirect('/blog'); // Go back to the list of blog posts
			});
		} else res.redirect('/blog'); // Go back to the list of blog posts
	};
	
	
	return exports;
};