module.exports = function(games_dir) {
	return {
		'RandoMaze' : function(req, res) {
			res.sendFile(games_dir + '/RandoMaze/index.html');
		}
	};
}