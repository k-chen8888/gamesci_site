module.exports = function(db) {
	var Schema = db.mongoose.Schema,
		model = db.mongoose.model;
	
	BlogPost = {};
	
	// Define Schema
	BlogPost.Schema = new Schema({
		title: String,
		author: {
			type: String,
			default: 'Kevin Chen'
		},
		body: String,
		date: {
			type: Date,
			default: Date.now
		}
	});
	
	// Convert the Schema into a model
	BlogPost.model = model('BlogPost', BlogPost.Schema, 'blogposts');
	
	
	/* Instance Methods */
	
	// Add a blog post
	BlogPost.Schema.methods.addBlogPost = function(options) {
		return new Promise(function(resolve, reject) {
			if (!options.title || !options.body) reject(new Error('Cannot make blog post'));
			
			var post = new BlogPost.model(options);
			post.save((err) => { reject(err); });
		});
	};
	
	
	// Output
	db.BlogPost = BlogPost;
};