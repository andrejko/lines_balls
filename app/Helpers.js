Helpers = function() {

}

Helpers.prototype.preload = function() {
    Game.phaserGameObj.load.image('board', 'assets/board.jpg');
    Game.phaserGameObj.load.image('ball', 'assets/ball.png');
    Game.phaserGameObj.load.image('bonus-enlarge', 'assets/bonus-enlarge.png');
    Game.phaserGameObj.load.image('bonus-reduce', 'assets/bonus-reduce.png');
    Game.phaserGameObj.load.image('bonus-fast', 'assets/bonus-fast.png');
    Game.phaserGameObj.load.image('bonus-slow', 'assets/bonus-slow.png');
    Game.phaserGameObj.load.image('bonus-reverse', 'assets/bonus-reverse.png');

    Game.phaserGameObj.stage.disableVisibilityChange = true;

    if (Game.options.networkEnabled) {
        network = new Network(Game.options.servetUrl);
        network.start();
    }
};

Helpers.prototype.create = function() {
    var startButton,
        ball;

    Game.phaserGameObj.stage.backgroundColor = '#fff';

    // place players boards
    Game.player1 = new Player(1, Game.phaserGameObj, Game.options.boardSideOffset, 0, 'player1');

    Game.player2 = new Player(2, Game.phaserGameObj, Game.phaserGameObj.width - Game.options.boardSideOffset - Game.options.boardInitialWidth, 0, 'player2');

    // place ball
    ball = Game.phaserGameObj.add.sprite(0, 0, 'ball');
    Game.phaserGameObj.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);
    ball.body.maxVelocity.setTo(1000, 1000);

    Game.ball = ball;

    Game.resetRound();

    startButton = Game.phaserGameObj.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    startButton.onDown.add(Game.startRound);

    gameUI.setName('player1', Game.player1.name);
    gameUI.setName('player2', Game.player2.name);

    gameUI.update();

    $(document).on('keydown', function(e) {
        if (Game.options.usedKeyCodes.indexOf(e.keyCode) != -1) {
            network.sendEvent('keydown', e.keyCode);
        }
    });

    $(document).on('keyup', function(e) {
        if (Game.options.usedKeyCodes.indexOf(e.keyCode) != -1) {
            network.sendEvent('keyup', e.keyCode);
        }
    });
};

Helpers.prototype.update = function() {
    if (!network.isReady()) {
        return;
    }

    var elapsed = Game.phaserGameObj.time.totalElapsedSeconds(),
        bonus,
        boards
    ;

    // movement
    Game.player1.update();
    Game.player2.update();

    Game.phaserGameObj.physics.arcade.collide(Game.player1.board, Game.ball, Game.ballHitPlayer, null, Game);
    Game.phaserGameObj.physics.arcade.collide(Game.player2.board, Game.ball, Game.ballHitPlayer, null, Game);

    if (Game.ball.body.onWall()) {
        Game.updateBallVelocityOnCollision();

        if (Game.gameStarted) {
            Game.checkMissed();
        }
    }

    boards = Game.phaserGameObj.add.group();
    boards.enableBody = true;

    for (var i = Game.player1.flyingBonuses.length - 1; i >= 0; i--) {
        Game.phaserGameObj.physics.arcade.collide(Game.player1.flyingBonuses[i].sprite, Game.player2.board, function(bonus, board) {
            Game.bonusHitPlayer(Game.player1.flyingBonuses[i], board, Game.player2);
            Game.player1.flyingBonuses.pop();
        });
    }

    for (var i = Game.player2.flyingBonuses.length - 1; i >= 0; i--) {
        Game.phaserGameObj.physics.arcade.collide(Game.player2.flyingBonuses[i].sprite, Game.player1.board, function(bonus, board) {
            Game.bonusHitPlayer(Game.player2.flyingBonuses[i], board, Game.player1);
            Game.player2.flyingBonuses.pop();
        });
    }

    if (!Game.gameStarted) {
        return;
    }

    // add bonus to players by turn after random time
    if ((elapsed - Game.lastBonusTime) >= Game.nextBonusTimeDelta) {
        bonus = bonusFactory.getRandomBonus();

        bonus.giveToPlayer(Game[Game.nextBonusPlayer]);

        Game.lastBonusTime = elapsed;
        Game.nextBonusTimeDelta = _.random(1, 10);
    }
};