var Express = require('express');
var app = Express();

var http = require('http').Server(app),
	port = process.env.PORT || 1337;


// A module for listing out the games I've made
// Contains callback functions that load those games
var games = require('./modules/games/games.js')(__dirname + '/pages/games/');

// Database module
var db = require('./modules/db/db.js')(process.env.MONGOLAB_URI || undefined, require('mongoose'));


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
app.get('/RandoMaze', games.RandoMaze);


/* Starts up the server */
http.listen(port, function() {
	console.log('Listening on port *:' + port);
});