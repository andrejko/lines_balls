Player = function(index, game, startX, startY) {
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

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', { 
    preload: preload, 
    create: create, 
    update: update 
});

var player1,
    player2,
    ball,
    startButton,
    defaultSpeed = 500
;

function preload() {
    game.load.image('board', 'assets/board.jpg');
    game.load.image('ball', 'assets/ball.png?t=1');
}

function create() {
    game.stage.backgroundColor = '#fff';

    // place players boards
    player1 = new Player(1, game, 10, 250);
    player2 = new Player(2, game, 780, 250);

    // place ball
    ball = game.add.sprite(0, 0, 'ball');
    ball.x = (game.width - ball.width) / 2;
    ball.y = (game.height - ball.height) / 2;
    game.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);

    cursors = game.input.keyboard.createCursorKeys();

    startButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    startButton.onDown.add(pushBall, this);
}

function update() {
    // movement
    player1.update();
    player2.update();

    game.physics.arcade.collide(player1.board, ball, ballHitPlayer, null, this);
    game.physics.arcade.collide(player2.board, ball, ballHitPlayer, null, this);

	if (ball.body.onWall()) {
        increaseBallVelocityOnCollision();
    }
}

function pushBall() {
    ball.body.moves = true;
    Xvector = (player2.board.x - ball.x);
    Yvector = (player2.board.y - ball.y);
    ball.body.velocity.setTo(Xvector, Yvector);
}

function ballHitPlayer(player, ball) {
	increaseBallVelocityOnCollision();
}

function increaseBallVelocityOnCollision() {
    var elapsed = game.time.totalElapsedSeconds();
    var delta = (ball.body.velocity.x > 0 ? 1 : -1) * elapsed;

    ball.body.velocity.setTo(Math.floor(ball.body.velocity.x + delta), Math.floor(ball.body.velocity.y + delta));
    console.log(ball.body.velocity);
}