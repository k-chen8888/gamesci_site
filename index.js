var Express = require('express');
var app = Express();

var http = require('http').Server(app),
	port = 1337;


// A module that outputs a list games that I've made and where to find them
// Also attaches middleware for finding the static content that Unity3D needs to run
var games = require('./modules/games/games.js')(app, Express);

/* Middleware */

// Static content
app.use(Express.static('pages'));


/* Pages */

// Homepage
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/pages/home/index.html');
});

// Blog
app.get('/blog', function(req, res) {
	res.sendFile(__dirname + '/pages/blog/index.html');
});


/* Games */

// RandoMaze
app.get('/RandoMaze', function(req, res) {
	res.sendFile(games.RandoMaze);
});


/* Starts up the server */
http.listen(port, function() {
	console.log('Listening on port *:' + port);
});