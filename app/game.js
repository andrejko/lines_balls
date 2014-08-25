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
    player1 = game.add.sprite(10, 250, 'board');
    player2 = game.add.sprite(780, 250, 'board');

    // place ball
    ball = game.add.sprite(0, 0, 'ball');
    ball.x = (game.width - ball.width) / 2;
    ball.y = (game.height - ball.height) / 2;
    game.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);
    ball.body.acceleration.setTo(0.1, 0.1);

    game.physics.arcade.enable(player1);
    game.physics.arcade.enable(player2);
    player1.body.collideWorldBounds = true;
    player2.body.collideWorldBounds = true;
    player1.body.immovable = true;
    player2.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();

    startButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    startButton.onDown.add(pushBall, this);
}

function update() {
    // movement
    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;

    if (cursors.left.isDown) {
        player1.body.velocity.x = -defaultSpeed;
        player1.animations.play('left');
    } else if (cursors.right.isDown) {
        player1.body.velocity.x = defaultSpeed;
        player1.animations.play('right');
    } else if (cursors.up.isDown) {
        player1.body.velocity.y = -defaultSpeed;
        player1.animations.play('right');
    } else if (cursors.down.isDown) {
        player1.body.velocity.y = defaultSpeed;
        player1.animations.play('right');
    }

    game.physics.arcade.collide(player1, ball, ballHitPlayer, null, this);
    game.physics.arcade.collide(player2, ball, ballHitPlayer, null, this);
}

function pushBall() {
    ball.body.moves = true;
    Xvector = (player2.x - ball.x);
    Yvector = (player2.y - ball.y);
    ball.body.velocity.setTo(Xvector, Yvector);
}

function ballHitPlayer(player, ball) {
    console.log(ball.body.acceleration);
    ball.body.acceleration.setTo(ball.body.acceleration.x + 0.1, ball.body.acceleration.y + 0.1);
    console.log('hit');
}