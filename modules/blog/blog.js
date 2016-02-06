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
					// Generate summaries for each post
					posts = posts.map((curr, i, arr) => {
						// Take about 75% of the contents of the first <p> tag to be the summary, without losing any tags
						var summary = curr.body.substring(curr.body.indexOf('>', curr.body.indexOf('<p')) + 1, curr.body.indexOf('</p>'));
						
						return {
							title: curr.title,
							post_id: curr.post_id,
							summary: '<p class="summary">' + fixTags(summary) + '[<a href="/blog?id="' + curr.post_id + '">...</a>]</p>'
						};
					});
					
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
	
	
	/* Utilities */
	
	// Adds in missing tags
	var fixTags = function(src) {
		var openTags = [];
		
		// Detect all open tags
		var openTagRE = /<[A-Za-z0-9 \.\"=]*>/g,
			temp;
		while ((temp = openTagRE.exec(src)) !== null) {
			// Parse out and save the name of the tag
			var tagName = temp[0].substring(1, temp[0].length - 1);
			openTags.push(tagName.split(' ')[0]);
		}
		
		// Remove tags from the list if they are closed
		var closeTagRE = /<\/[A-Za-z0-9 \.]*>/g,
			openTagIndex = -1;
		while ((temp = closeTagRE.exec(src)) !== null) {
			// If the tag is closed, remove it from the list
			openTagIndex = openTags.indexOf(temp[0].substring(2, temp[0].length - 1));
			if (openTagIndex > -1) openTags.splice(openTagIndex, 1);
		}
		
		// In reverse order found, close all tags
		var endTags = openTags.reduce((prev, curr, i, arr) => {
			return '</' + curr + '>' + prev;
		}, "");
		
		return src + endTags;
	};
	
	
	return exports;
};