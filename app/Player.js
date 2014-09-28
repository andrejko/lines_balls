Player = function(index, game, startX, startY, name) {
    this.index = 'player' + index;
    this.name = name;
    this.game = game;
    this.lose = false;
    this.lives = null;
    this.board = game.add.sprite(startX, startY, 'board');
    this.boardSpeed = Game.options.defaultBoardSpeed;
    this.reverse = false;
    this.bonusesInStash = [];
    this.lastLaunchTime = 0;
    this.lastUseTime = 0;
    this.flyingBonuses = [];
    this.local = false;

    game.physics.arcade.enable(this.board);

    this.board.body.collideWorldBounds = true;
    this.board.body.immovable = true;
}

Player.prototype.update = function() {
    var board = this.board;

    board.body.velocity.x = 0;
    board.body.velocity.y = 0;

    if (Game.options.controls[Game.localPlayerIndex + "UP"].isDown) {
        board.body.velocity.y = (this.reverse ? 1 : -1) * this.boardSpeed;
    }
    if (Game.options.controls[Game.localPlayerIndex + "DOWN"].isDown) {
        board.body.velocity.y = (this.reverse ? -1 : 1) * this.boardSpeed;
    }
    if (Game.options.controls[Game.localPlayerIndex + "Launch"].isDown) {
        if ((this.lastLaunchTime + Game.options.launchBonusInterval) > Game.phaserGameObj.time.totalElapsedSeconds()) {
            return;
        }

        if (this.bonusesInStash.length == 0) {
            return;
        }

        this.launchBonus();
    }
    if (Game.options.controls[Game.localPlayerIndex + "Use"].isDown) {
        if ((this.lastUseTime + Game.options.launchBonusInterval) > Game.phaserGameObj.time.totalElapsedSeconds()) {
            return;
        }

        if (this.bonusesInStash.length == 0) {
            return;
        }

        this.useBonus();
    }
}

Player.prototype.lose = function() {

}

Player.prototype.missed = function() {
    this.lives--;
    gameUI.setLives(this.index, this.lives);

    if (this.lives <= 0) {
        this.lose = true;
    }
}

Player.prototype.launchBonus = function() {
    var bonus = this.bonusesInStash.splice(0, 1)[0];

    bonus.sprite.body.x = this.board.body.x + (this.index == 'player1' ? this.board.body.width : -(this.board.body.width + bonus.sprite.body.height));
    bonus.sprite.body.y = this.board.body.center.y - this.board.body.height / 2;
    bonus.sprite.body.velocity.x = (this.index == 'player1' ? 1 : -1) * Game.options.bonusFlySpeed;

    this.flyingBonuses.push(bonus);

    this.lastLaunchTime = Game.phaserGameObj.time.totalElapsedSeconds();

    gameUI.updatePlayerBonuses(this);
}

Player.prototype.useBonus = function() {
    var bonus = this.bonusesInStash.splice(0, 1)[0];

    bonus.applyOnPlayer(this);

    this.lastUseTime = Game.phaserGameObj.time.totalElapsedSeconds();

    gameUI.updatePlayerBonuses(this);
}