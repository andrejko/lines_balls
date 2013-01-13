//(function() {
	var BORD_WIDTH = 10;
	var BORD_HEIGHT = 150;
	var BORD_PADDING = 10;
	var BALL_RADIUS = 10;
	var MOVE_STEP = 10;

	// q = 81, a = 65, top = 38, bottom = 40
	var controls1 = [81, 65];
	var controls2 = [38, 40];

	/**
	 * [Player class]
	 * @param string name   
	 * @param Bord bord     
	 * @param array controls 
	 * @param int ballLeft 
	 */
	function Player(name, bord, controls, ballLeft) {
		this.name = name;
		this.bord = bord;
		this.controls = controls;
		this.ballLeft = ballLeft;
		this.hasBall = false;
	}

	/**
	 * [Bord class]
	 * @param int top 
	 * @param int left
	 */
	function Bord(top, left) {
		this.top = top;
		this.left = left;

		var rect = new fabric.Rect({
			width: BORD_WIDTH,
			height: BORD_HEIGHT,
			top: this.top,
			left: this.left
		});
		this.rectObj = rect;

		this.placeOnField = function(field) {
			field.add(this.rectObj);
			return this;
		};

		this.move = function(dir) {
			if (dir == 'top') {
				this.rectObj.top += MOVE_STEP;
			}

			if (dir == 'bottom') { 
				this.rectObj.top -= MOVE_STEP;
			}
		}
	}

	/**
	 * [Ball class]
	 */
	function Ball() {
		var ball = new fabric.Circle({
			radius: BALL_RADIUS,
			fill: "#f00"
		});

		this.speed = 0;
		this.giveTo = function(player) {
			ball.top = player.bord.top;
			ball.left = player.ballLeft;

			field.add(ball);
		}
	}

	var field = new fabric.Canvas('canvas');

	/*var rect = new fabric.Rect({
			width: BORD_WIDTH,
			height: BORD_HEIGHT,
			top: 200,
			left: 200
		});
	field.add(rect);*/

	// create bords and place them centered by vertical
	var p1Bord = new Bord(field.height/2, BORD_PADDING+BORD_WIDTH/2).placeOnField(field);
	var p2Bord = new Bord(field.height/2, field.width - (BORD_PADDING+BORD_WIDTH/2)).placeOnField(field);

	// create players
	var player1 = new Player('player A', p1Bord, controls1, BORD_PADDING+BORD_WIDTH+BALL_RADIUS);
	var player2 = new Player('player B', p2Bord, controls2, field.width-(BORD_PADDING+BORD_WIDTH+BALL_RADIUS));

	// create ball and give it to player PLAYER_WITH_BALL
	var ball = new Ball();
	ball.giveTo(player1);


	$(document).keydown(function(e) {
		var kc = e.keyCode;

		if (($.inArray(kc, controls1) != -1) || ($.inArray(kc, controls2) != -1)) {
			e.preventDefault();


		}
	});

//})();
