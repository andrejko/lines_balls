var LinesBallsGame = {
    options: {
        startPlayerLives: 3,
        ballAcceleration: 1,
        boardMovementSpeed: 500,
        boardSideOffset: 10,
        boardInitialWidth: 12,
        boardInitialHeight: 100,
        gameContainerID: 'game-container'
    },

    // Phaser.Game object
    gameObj: null,

    // is game in process
    gameStarted: false,

    // players
    player1: null,
    player2: null,

    //ball
    ball: null,

    preload: function() {
        this.gameObj.load.image('board', 'assets/board.jpg');
        this.gameObj.load.image('ball', 'assets/ball.png');
    },

    create: function() {
        var me = this,
            startButton,
            ball
        ;

        me.gameObj.stage.backgroundColor = '#fff';

        // place players boards
        me.player1 = new Player(1, me.gameObj, config.boardSideOffset, (me.gameObj.height - config.boardInitialHeight) / 2);
        me.player2 = new Player(2, me.gameObj, me.gameObj.width - config.boardSideOffset - config.boardInitialWidth, (me.gameObj.height - config.boardInitialHeight) / 2);

        // place ball
        ball = me.gameObj.add.sprite(0, 0, 'ball');
        me.gameObj.physics.arcade.enable(ball);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(1, 1);

        me.ball = ball;

        cursors = me.gameObj.input.keyboard.createCursorKeys();

        startButton = me.gameObj.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        startButton.onDown.add(startGame, this);
    },

    update: function() {
        var me = this;

        // movement
        me.player1.update();
        me.player2.update();

        me.gameObj.physics.arcade.collide(me.player1.board, me.ball, me.ballHitPlayer, null, this);
        me.gameObj.physics.arcade.collide(me.player2.board, me.ball, me.ballHitPlayer, null, this);

        if (ball.body.onWall()) {
            increaseBallVelocityOnCollision();
            
            if (this.gameStarted) {
                me.checkMissed();
            }
        }
    },

    // initialization
    init: function(options) {
        var me = this;

        _.assign(this.gameContainerID, options);
        
        this.gameObj = new Phaser.Game(800, 600, Phaser.AUTO, this.options.gameContainerID, { 
            preload: me.preload, 
            create: me.create, 
            update: me.update 
        });
    },

    ballHitPlayer: function() {
        this.increaseBallVelocityOnCollision();
    },

    increaseBallVelocityOnCollision: function() {
        var elapsed = game.time.totalElapsedSeconds();
        var delta = (ball.body.velocity.x > 0 ? 1 : -1) * elapsed * config.ballAcceleration;

        this.ball.body.velocity.setTo(Math.floor(this.ball.body.velocity.x + delta), Math.floor(this.ball.body.velocity.y + delta));
        //console.log(ball.body.velocity);
    },

    checkMissed: function() {
        var me = this;

        if (me.ball.body.blocked.right) {
            me.player1.missed();
        }

        if (me.ball.body.blocked.left) {
            me.player2.missed();
        }

        if (me.player1.lose || me.player2.lose) {
            me.endGame();
        }
    },

    startGame: function() {
        this.pushBall();
        this.gameStarted = true;
    },

    pushBall: function() {
        var me = this;

        me.ball.body.moves = true;
        Xvector = (me.player2.board.x - me.ball.x);
        Yvector = (me.player2.board.y - me.ball.y);
        me.ball.body.velocity.setTo(Xvector, Yvector);
    },

    endGame: function() {
        var me = this;

        this.ball.body.moves = false;
        this.ball.body.velocity.setTo(0);
    },

    resetGame: function() {
        var me = this;
        
        this.ball.x = (this.gameObj.width - this.ball.width) / 2;
        this.ball.y = (this.gameObj.height - this.ball.height) / 2;
    }
}

LinesBallsGame.init();