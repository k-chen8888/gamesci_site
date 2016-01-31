module.exports = function(db) {
	var Schema = db.mongoose.Schema,
		model = db.mongoose.model;
	
	BlogPost = {count: 0};
	
	// Define Schema
	BlogPost.Schema = new Schema({
		title: String,
		post_id: Number,
		author: {
			type: String,
			default: 'Kevin Chen'
		},
		body: String,
		created_on: {
			type: Date,
			default: Date.now
		},
		edited_on: {
			type: Date,
			default: Date.now
		}
	});
	BlogPost.Schema.set('autoIndex', false);
	BlogPost.Schema.index({'post_id': 1});
	
	// Convert the Schema into a model
	BlogPost.model = model('BlogPost', BlogPost.Schema, 'blogposts');
	
	
	/* Utility Methods */
	
	// Add a blog post
	BlogPost.addBlogPost = function(options) {
		return new Promise(function(resolve, reject) {
			if (!options.title || !options.body) reject(new Error('Cannot make blog post'));
			
			// Create the post...
			options.post_id = BlogPost.count + 1;
			var post = new BlogPost.model(options);
			
			// ...and save it
			post.save((err) => {
				if (err) reject(err);
				else {
					BlogPost.count += 1;
					resolve(post);
				}
			});
		});
	};
	
	// Grab a blog post
	BlogPost.getBlogPost = function(options, sort) {
		return new Promise(function(resolve, reject) {
			if (!options) reject(new Error('Blog post not found'));
			
			if (typeof options == 'number') {
				// Assume searching by ID
				BlogPost.model.find({'post_id': options}, function(err, posts) {
					if (err || !posts[0]) reject(err || new Error('Blog post not found'));
					else resolve(posts[0]);
				});
			} else if (typeof options == 'string') {
				// Assume searching by title
				BlogPost.model.find({'title': options}, function(err, posts) {
					if (err || !posts[0]) reject(err || new Error('Blog post not found'));
					else resolve(posts[0]);
				});
			} else {
				// Assume that a query object was passed in
				BlogPost.model.find(options)
				.sort(sort || {post_id: 1})
				.exec(function(err, posts) {
					if (err || !posts[0]) reject(err || new Error('Blog post not found'));
					else resolve(posts[0]);
				});
			}
		};
	};
	
	
	// Output
	db.BlogPost = BlogPost;
};