var Express = require('Express');

module.exports = function(app) {
	// Attach middleware to get static content for each game
	app.use(Express.static(__dirname + '/RandoMaze'));
	
	return {
		'RandoMaze' : __dirname + '/RandoMaze/index.html'
	};
}