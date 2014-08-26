function LinesBallsGame() {
    this.options = {
        startPlayerLives: 3,
        ballAcceleration: 1,
        boardMovementSpeed: 500,
        boardSideOffset: 10,
        boardInitialWidth: 12,
        boardInitialHeight: 100,
        defaultSpeed: 500,
        gameContainerID: 'game-container'
    };

    // Phaser.Game object
    this.phaserGameObj = null;

    // is game in process
    this.gameStarted = false;

    // players
    this.player1 = null;
    this.player2 = null;

    // ball
    this.ball = null;

    // cursors
    this.cursors = null;
}

LinesBallsGame.prototype = {
    // initialization
    init: function(options) {
        _.assign(this.options, options);
        
        this.phaserGameObj = new Phaser.Game(800, 600, Phaser.AUTO, this.options.gameContainerID, {
            preload: function() {
                gameHelpers.preload();
            },
            create: function() {
                gameHelpers.create();
            },
            update: function() {
                gameHelpers.update();
            }
        });
    },

    ballHitPlayer: function() {
        this.increaseBallVelocityOnCollision();
    },

    increaseBallVelocityOnCollision: function() {
        var elapsed = Game.phaserGameObj.time.totalElapsedSeconds();
        var delta = (this.ball.body.velocity.x > 0 ? 1 : -1) * elapsed * this.options.ballAcceleration;

        this.ball.body.velocity.setTo(Math.floor(this.ball.body.velocity.x + delta), Math.floor(this.ball.body.velocity.y + delta));
        //console.log(ball.body.velocity);
    },

    checkMissed: function() {
        if (this.ball.body.blocked.right) {
            this.player2.missed();
        }

        if (this.ball.body.blocked.left) {
            this.player1.missed();
        }

        if (this.player1.lose || this.player2.lose) {
            this.endGame();
        }
    },

    startRound: function() {
        Game.pushBall();
        Game.gameStarted = true;
    },

    pushBall: function() {
        this.ball.body.moves = true;
        Xvector = (this.player2.board.x - this.ball.x);
        Yvector = (this.player2.board.y - this.ball.y);
        this.ball.body.velocity.setTo(Xvector, Yvector);
    },

    startGame: function() {
    },

    endGame: function() {
    },

    endRound: function() {
        this.ball.body.moves = false;
        this.ball.body.velocity.setTo(0);
    },

    resetRound: function() {
        this.ball.x = (this.phaserGameObj.width - this.ball.width) / 2;
        this.ball.y = (this.phaserGameObj.height - this.ball.height) / 2;
    }
}

var gameHelpers, 
    Game,
    UI
;

$(function() {
    gameHelpers = new Helpers();
    Game = new LinesBallsGame();
    gameUI = new UI();

    Game.init();
});