function GameListWindow(gamesJSON) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false
	});
	var data = [];
	for (var i = 0; i < gamesJSON.length; i++) {
		game = gamesJSON[i];
		game_data = {
			title : game.game_friendly_name,
			game_id : game.game_id,
			game_password : game.game_password,
		};
		game_data.alive = (game.alive == 'True');
		game_data.started = (game.started == 'True');
		game_data.completed = (game.completed == 'True');
		data.push(game_data);
	}
	// create table view
	var tableview = Titanium.UI.createTableView({
		data : data
	});
	self.add(tableview);
	return self;
};

module.exports = GameListWindow;
