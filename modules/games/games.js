module.exports = function(games_dir) {
	return {
		'RandoMaze' : function(req, res) {
			res.sendFile(games_dir + '/RandoMaze/index.html');
		},
		'AstralProjector' : function(req, res) {
			res.sendFile(games_dir + '/AstralProjector/index.html');
		}
		'PickMeUp' : function(req, res) {
			res.sendFile(games_dir + '/PickMeUp/index.html');
		}
	};
}