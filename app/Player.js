Player = function(index, game, startX, startY) {
    this.index = 'player' + index;
    this.game = game;
    this.lose = false;
    this.lives = null;
    this.board = game.add.sprite(startX, startY, 'board');

    game.physics.arcade.enable(this.board);

    this.board.body.collideWorldBounds = true;
    this.board.body.immovable = true;
}

Player.prototype.update = function() {
    var board = this.board;

    board.body.velocity.x = 0;
    board.body.velocity.y = 0;

    if (Game.cursors.up.isDown) {
        board.body.velocity.y = -Game.options.defaultSpeed;
        board.animations.play('right');
    } else if (Game.cursors.down.isDown) {
        board.body.velocity.y = Game.options.defaultSpeed;
        board.animations.play('right');
    }
}

Player.prototype.lose = function() {

}

Player.prototype.missed = function() {
    this.lives--;
    gameUI.setLives(this.index, this.lives);

    if (this.lives == 0) {
        this.lose = true;
    }
}