var Express = require('express');
var app = Express();

var http = require('http').Server(app),
	port = process.env.PORT || 1337;

// Parses form data
var bodyParser = require('body-parser');


/* Modules */

// A module for listing out the games I've made
// Contains callback functions that load those games
var games = require('./modules/games/games.js')(__dirname + '/pages/games/');

// Database module
var db = require('./modules/db/db.js')(process.env.MONGOLAB_URI || undefined, require('mongoose'));

// Blog module
var blog = require('./modules/blog/blog.js')({
		db: db
	}, {
		'blog': __dirname + '/pages/blag/',
		'error': __dirname + '/pages/error/'
	},
	process.env.SECRET || 'thisisasecret'
);


/* Middleware */

// Static content
app.use(Express.static('pages'));

// Parses form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Jade templates for blogs
app.set('views', '/pages');
app.set('view engine', 'jade');

app.set('strict routing', true);

/* Pages */

// Homepage
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/pages/home/index.html');
});

// Blog
app.get('/blog', blog.routes.blogMain);
app.get('/blog/write', blog.routes.writePost);
app.post('/blog/write', blog.routes.createPost);


/* Games */

// RandoMaze
app.get('/RandoMaze', games.RandoMaze);


/* Starts up the server */
http.listen(port, function() {
	console.log('Listening on port *:' + port);
});