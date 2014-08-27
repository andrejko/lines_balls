Helpers = function() {

}

Helpers.prototype.preload = function() {
    Game.phaserGameObj.load.image('board', 'assets/board.jpg');
    Game.phaserGameObj.load.image('ball', 'assets/ball.png');
};

Helpers.prototype.create = function() {
    var startButton,
        ball;

    Game.phaserGameObj.stage.backgroundColor = '#fff';

    // place players boards
    Game.player1 = new Player(1, Game.phaserGameObj, Game.options.boardSideOffset, 0);
    Game.player2 = new Player(2, Game.phaserGameObj, Game.phaserGameObj.width - Game.options.boardSideOffset - Game.options.boardInitialWidth, 0);

    // place ball
    ball = Game.phaserGameObj.add.sprite(0, 0, 'ball');
    Game.phaserGameObj.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);

    Game.ball = ball;

    Game.cursors = Game.phaserGameObj.input.keyboard.createCursorKeys();

    Game.resetRound();

    startButton = Game.phaserGameObj.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    startButton.onDown.add(Game.startRound);

    gameUI.update();
};

Helpers.prototype.update = function() {
    // movement
    Game.player1.update();
    Game.player2.update();

    Game.phaserGameObj.physics.arcade.collide(Game.player1.board, Game.ball, Game.ballHitPlayer, null, Game);
    Game.phaserGameObj.physics.arcade.collide(Game.player2.board, Game.ball, Game.ballHitPlayer, null, Game);

    if (Game.ball.body.onWall()) {
        Game.increaseBallVelocityOnCollision();

        if (Game.gameStarted) {
            Game.checkMissed();
        }
    }
};