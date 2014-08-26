UI = function() {
	this.player1 = {
		name: $(".player-data[data-player=1] .name"),
		lives: $(".player-data[data-player=1] .lives"),
	};

	this.player2 = {
		name: $(".player-data[data-player=2] .name"),
		lives: $(".player-data[data-player=2] .lives")
	}
}

UI.prototype.setLives = function(player, value) {
	this[player]["lives"].text(value);
	
	if (value < 3) {
		this[player]["lives"].removeClass("label-default").addClass("label-warning");
	}

	if (value < 2) {
		this[player]["lives"].removeClass("label-warning").addClass("label-danger");
	}
}

UI.prototype.update = function() {
	this.setLives('player1', Game.player1.lives);
	this.setLives('player2', Game.player2.lives);
}