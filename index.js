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

app.get('/play'), function(req, res) {
	res.send('<h1>A list of games and demos found on this site</h1>');
});

// RandoMaze
app.get('/RandoMaze', games.RandoMaze);

// AstralProjector
app.get('/AstralProjector', games.AstralProjector);

// AstralProjector
app.get('/play/PickMeUp', games.PickMeUp);


/* Download a hosted file */
app.get('/download', function(req, res){
	if (!req.query.name || !req.query.version || !req.query.ext) res.sendFile('/pages/error/404.html');
	else res.download(__dirname + '/pages/downloads/' + req.query.name + '/' + req.query.name + '-v' + req.query.version + '.' + req.query.ext);
});


/* Starts up the server */
http.listen(port, function() {
	console.log('Listening on port *:' + port);
});