function LinesBallsGame() {
    this.options = {
        startPlayerLives: 3,
        ballAcceleration: 5,
        boardMovementSpeed: 500,
        boardSideOffset: 10,
        boardInitialWidth: 12,
        boardInitialHeight: 100,
        defaultSpeed: 500,
        gameContainerID: 'game-container',
        controls: {}
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
        var delta = (this.ball.body.velocity.x > 0 ? 1 : -1) * this.options.ballAcceleration;

        this.ball.body.velocity.setTo(Math.floor(this.ball.body.velocity.x + delta), Math.floor(this.ball.body.velocity.y + delta));
        //console.log(ball.body.velocity);
    },

    checkMissed: function() {
        if (this.ball.body.blocked.right) {
            this.player2.missed();

            if (this.player2.lose) {
                Game.lastWinner = Game.player1;
            }
        }

        if (this.ball.body.blocked.left) {
            this.player1.missed();

            if (this.player1.lose) {
                Game.lastWinner = Game.player2;
            }
        }

        if (this.player1.lose || this.player2.lose) {
            // to prevent blocking pop-up before UI updated 
            setTimeout(function() {
                Game.endRound();
                Game.resetRound();
            }, 10);
        }
    },

    resetRound: function() {
        this.ball.x = (this.phaserGameObj.width - this.ball.width) / 2;
        this.ball.y = (this.phaserGameObj.height - this.ball.height) / 2;

        Game.player1.lives = Game.options.startPlayerLives;
        Game.player1.lose = false;
        Game.player2.lives = Game.options.startPlayerLives;
        Game.player2.lose = false;

        this.phaserGameObj.add.tween(Game.player1.board.body).to( {y: (Game.phaserGameObj.height - Game.options.boardInitialHeight) / 2}, 100, null, true);
        this.phaserGameObj.add.tween(Game.player2.board.body).to( {y: (Game.phaserGameObj.height - Game.options.boardInitialHeight) / 2}, 100, null, true);

        gameUI.update();
    },

    startRound: function() {
        Game.pushBall();
        Game.gameStarted = true;
    },

    endRound: function() {
        this.ball.body.velocity.setTo(0);

        this.player1.board.body.velocity.setTo(0);
        this.player2.board.body.velocity.setTo(0);

        gameUI.showEndRoundMessage();
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
    }
}

var gameHelpers, 
    Game,
    gameUI
;

$(function() {
    gameHelpers = new Helpers();
    Game = new LinesBallsGame();
    gameUI = new UI();

    Game.init();
});