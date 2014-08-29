BonusFactory = function() {
	this.createBonus = function(name) {
		var bonus;

		if (name == 'enlarge') {
			bonus = new BonusEnlarge();
		} else if (name == 'reduce') {
			bonus = new BonusReduce();
		} else if (name == 'slow') {
			bonus = new BonusSlow();
		} else if (name == 'fast') {
			bonus = new BonusFast();
		} else if (name == 'reverse') {
			bonus = new BonusReverse();
		}

		bonus.name = name;
		bonus.sprite = Game.phaserGameObj.add.sprite(-100, -100, 'bonus-' + name);
		Game.phaserGameObj.physics.arcade.enable(bonus.sprite);

		// player is Player object
		bonus.giveToPlayer = function(player) {
			Game.nextBonusPlayer = 'player' + (player.index == 'player1' ? '2' : '1');

			player.bonusesInStash.push(this);

			if (player.bonusesInStash.length > 3) {
				player.bonusesInStash.splice(0, player.bonusesInStash.length - 3);
			}

			gameUI.updatePlayerBonuses(player);
		}

		return bonus;
	};

	this.getRandomBonus = function() {
		var key = _.random(0, 4);

		return this.createBonus(Game.bonuses[key]);
	};
}

BonusEnlarge = function() {
	var delta = 30;

	this.applyOnPlayer = function(player) {
		if ((player.board.height + delta) <= 160) {
			player.board.height += 30;
		}
	}
}

BonusReduce = function() {
	var delta = 30;

	this.applyOnPlayer = function(player) {
		if ((player.board.height - delta) >= 40) {
			player.board.height -= 30;
		}
	}
}

BonusFast = function() {
	var delta = 200;

	this.applyOnPlayer = function(player) {
		if ((player.boardSpeed + delta) <= 900) {
			player.boardSpeed += 200;
		}
	}
}

BonusSlow = function() {
	var delta = 200;

	this.applyOnPlayer = function(player) {
		if ((player.boardSpeed - delta) >= 100) {
			player.board.height -= 200;
		}
	}
}

BonusReverse = function() {
	this.applyOnPlayer = function(player) {
		player.reverse = !player.reverse;
	}
}