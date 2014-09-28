UI = function() {
	this.player1 = {
		name: $(".player-data[data-player=1] .name"),
		lives: $(".player-data[data-player=1] .lives"),
	};

	this.player2 = {
		name: $(".player-data[data-player=2] .name"),
		lives: $(".player-data[data-player=2] .lives")
	}

	this.logContainer = $("#log-container");
}

UI.prototype.setLives = function(player, value) {
	this[player]["lives"].text(value);
	
	if (value < 3) {
		this[player]["lives"].removeClass("label-default").addClass("label-warning");
	} else {
		this[player]["lives"].removeClass().addClass("label label-default");
	}

	if (value < 2) {
		this[player]["lives"].removeClass("label-warning").addClass("label-danger");
	}
}

UI.prototype.setName = function(player, value) {
	this[player]["name"].text(value);
}

UI.prototype.update = function() {
	this.setLives('player1', Game.player1.lives);
	this.setLives('player2', Game.player2.lives);

	this.setName('player1', Game.player1.name);
	this.setName('player2', Game.player2.name);

	this.updatePlayerBonuses(Game.player1);
	this.updatePlayerBonuses(Game.player2);
}

UI.prototype.showEndRoundMessage = function(message) {
	confirm(message);
}

UI.prototype.updatePlayerBonuses = function(player) {
	var container = $(".player-data[data-player=" + player.index.replace('player', '') + "] .bonuses")
		html = '',
		img = ''
	;

	for (var i = 2; i >= 0; i--) {
		img = '';

		if (typeof player.bonusesInStash[i] != 'undefined') {
			img = '<img class="bonus-icon" src="assets/' + player.bonusesInStash[i].sprite.key + '.png" />';
		}

		html += '<div class="bonus-box">' + img + '</div>';
	};

	container.html(html);
}

UI.prototype.logMessage = function(msg) {
	this.logContainer.append('<div class="log-message">' + msg + '</div>');
}