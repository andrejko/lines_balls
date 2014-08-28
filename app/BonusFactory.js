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
	this.apply = function(player) {
		player.board.height += 50;
	}
}

BonusReduce = function() {
	this.apply = function(player) {
		player.board.height -= 50;
	}
}

BonusFast = function() {
	this.apply = function(player) {
		player.boardSpeed += 200;
	}
}

BonusSlow = function() {
	this.apply = function(player) {
		player.board.height -= 200;
	}
}

BonusReverse = function() {
	this.apply = function(player) {
		player.reverse = true;
	}
}