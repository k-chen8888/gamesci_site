module.exports = function(uri, mongoose) {
	if (!uri) return undefined;
	
	var exports = {};
	
	// Connect to the database
	exports.mongoose = mongoose;
	exports.mongoose.connect(uri);
	
	
	/* Database Collections */
	
	// Blog posts
	require('./schemas/blogpost.js')(exports);
	
	
	return exports;
};