function LinesBallsGame() {
    this.options = {
        startPlayerLives: 5,
        ballAcceleration: 5,
        boardSideOffset: 10,
        boardInitialWidth: 12,
        boardInitialHeight: 100,
        defaultBoardSpeed: 500,
        bonusFlySpeed: 500,
        launchBonusInterval: 0.5, // 0.5 sec
        gameContainerID: 'game-container',
        controls: {}
    };

    this.bonuses = ["enlarge", "reduce", "fast", "slow", "reverse"];
    this.lastBonusTime = null;
    this.nextBonusTimeDelta = 5; // 5 sec
    this.nextBonusPlayer = 'player' + _.random(1, 2);

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

        this.lastBonusTime = 0;
    },

    ballHitPlayer: function(board, ball) {
        this.updateBallVelocityOnCollision(board.body.velocity);
    },

    updateBallVelocityOnCollision: function(bodyVelocity) {
        var deltaX = (this.ball.body.velocity.x > 0 ? 1 : -1) * this.options.ballAcceleration,
            playerInfluence = 0,
            playerDir,
            ballDir
        ;

        if (typeof bodyVelocity != 'undefined') {
            playerDir = (bodyVelocity.y > 0 ? 1 : -1);
            ballDir = (this.ball.body.velocity.y > 0 ? 1 : -1);

            playerInfluence = bodyVelocity.y / (playerDir == ballDir ? 5 : 3);
        }

        playerInfluence = (typeof bodyVelocity == 'undefined') ? 0 : bodyVelocity.y / 4;

        this.ball.body.velocity.setTo(Math.floor(this.ball.body.velocity.x + deltaX), Math.floor(this.ball.body.velocity.y + deltaX + playerInfluence));
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
        Game.player1.bonusesInStash = [];
        Game.player1.reverse = false;
        Game.player1.boardSpeed = Game.options.defaultBoardSpeed;

        Game.player2.lives = Game.options.startPlayerLives;
        Game.player2.lose = false;
        Game.player2.bonusesInStash = [];
        Game.player2.reverse = false;
        Game.player2.boardSpeed = Game.options.defaultBoardSpeed;

        this.phaserGameObj.add.tween(Game.player1.board.body).to( {y: (Game.phaserGameObj.height - Game.options.boardInitialHeight) / 2}, 100, null, true);
        this.phaserGameObj.add.tween(Game.player2.board.body).to( {y: (Game.phaserGameObj.height - Game.options.boardInitialHeight) / 2}, 100, null, true);

        for (var i = Game.player1.flyingBonuses.length - 1; i >= 0; i--) {
            Game.player1.flyingBonuses[i].sprite.kill();
        }
        for (var i = Game.player2.flyingBonuses.length - 1; i >= 0; i--) {
            Game.player2.flyingBonuses[i].sprite.kill();
        }

        gameUI.update();

        this.phaserGameObj.paused = false;
    },

    startRound: function() {
        Game.pushBall();
        Game.gameStarted = true;
    },

    endRound: function() {
        this.ball.body.velocity.setTo(0);

        this.player1.board.body.velocity.setTo(0);
        this.player2.board.body.velocity.setTo(0);

        this.phaserGameObj.paused = true;
        this.gameStarted = false;

        gameUI.showEndRoundMessage('Player ' + this.lastWinner.index + ' won');
    },

    pushBall: function() {
        if ((this.ball.body.velocity.x == 0) && (this.ball.body.velocity.y == 0)) {
            Xvector = (this.player2.board.x - this.ball.x);
            Yvector = (this.player2.board.y - this.ball.y);
            this.ball.body.velocity.setTo(Xvector, Yvector);
        }
    },

    startGame: function() {
    },

    endGame: function() {
    },

    bonusHitPlayer: function(bonus, playerBoard, player) {
        bonus.applyOnPlayer(player);

        bonus.sprite.kill();
    }
}

var gameHelpers, 
    Game,
    gameUI,
    bonusFactory
;

$(function() {
    gameHelpers = new Helpers();
    Game = new LinesBallsGame();
    gameUI = new UI();
    bonusFactory = new BonusFactory();

    Game.init();
});