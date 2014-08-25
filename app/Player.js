Player = function(index, game, startX, startY) {
    this.game = game;
    this.lose = false;
    this.lives = config.startPlayerLives;
    this.board = game.add.sprite(startX, startY, 'board');

    game.physics.arcade.enable(this.board);

    this.board.body.collideWorldBounds = true;
    this.board.body.immovable = true;
}

Player.prototype.update = function() {
    var board = this.board;

    board.body.velocity.x = 0;
    board.body.velocity.y = 0;

    if (cursors.left.isDown) {
        board.body.velocity.x = -defaultSpeed;
        board.animations.play('left');
    } else if (cursors.right.isDown) {
        board.body.velocity.x = defaultSpeed;
        board.animations.play('right');
    } else if (cursors.up.isDown) {
        board.body.velocity.y = -defaultSpeed;
        board.animations.play('right');
    } else if (cursors.down.isDown) {
        board.body.velocity.y = defaultSpeed;
        board.animations.play('right');
    }
}

Player.prototype.lose = function() {

}

Player.prototype.missed = function() {
    this.lives--;

    if (this.lives == 0) {
        this.lose = true;
    }
}