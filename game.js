//(function() {
	var BORD_WIDTH = 10;
	var BORD_HEIGHT = 120;
	var BORD_PADDING = 10;
	var BALL_RADIUS = 10;
	var MOVE_STEP = 20;
	var MOVE_DURATION = 10;

	// q = 81, a = 65, top = 38, bottom = 40
	
	var controls = {
		'81': ['top', 'p1'],
		'65': ['bottom', 'p1'],
		'38': ['top', 'p2'],
		'40': ['bottom', 'p2']
	}

	var controls1 = [81, 65];
	var controls2 = [38, 40];

	var allControls = controls1.concat(controls2);
	var keysPressed = [];

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

		bord.player = this;
	}

	/**
	 * [Bord class]
	 * @param int top 
	 * @param int left
	 */
	function Bord(top, left) {
		this.top = top;
		this.left = left;
		this.field = null;
		this.player = null;

		var rect = new fabric.Rect({
			width: BORD_WIDTH,
			height: BORD_HEIGHT,
			top: this.top,
			left: this.left
		});
		this.rectObj = rect;

		this.placeOnField = function(field) {
			field.add(this.rectObj);
			this.field = field;
			return this;
		};

		this.move = function(dir) {
			if (dir == 'top') {
				var y = this.rectObj.top-BORD_HEIGHT/2;
				y -= MOVE_STEP;

				if (y >= 0) {
					this.rectObj.animate('top', '-'+MOVE_STEP, {
						duration: MOVE_DURATION,
						onChange: this.field.renderAll.bind(this.field)
					});

					if ((this.player.hasBall) && (ball.speed == 0)) {
						ball.moveWithBoard(this.rectObj.top-MOVE_STEP);
					}
				} else {
					y = 0;
				}
			}

			if (dir == 'bottom') { 
				var y = this.rectObj.top+BORD_HEIGHT/2;
				y += MOVE_STEP;

				if (y <= this.field.height) {
					this.rectObj.animate('top', '+'+MOVE_STEP, {
						duration: MOVE_DURATION,
						onChange: this.field.renderAll.bind(this.field)
					});

					if ((this.player.hasBall) && (ball.speed == 0)) {
						ball.moveWithBoard(this.rectObj.top+MOVE_STEP);
					}
				} else {
					y = this.field.height;
				}
			}
		}
	}

	/**
	 * [Ball class]
	 */
	function Ball() {
		var circle = new fabric.Circle({
			radius: BALL_RADIUS,
			fill: "#f00"
		});
		this.circleObj = circle;

		this.speed = 0;

		this.giveTo = function(player) {
			this.circleObj.top = player.bord.top;
			this.circleObj.left = player.ballLeft;
			player.hasBall = true;

			field.add(this.circleObj);
		}

		this.moveWithBoard = function(y) {
			this.circleObj.animate('top', y, {
				duration: MOVE_DURATION,
				onChange: field.renderAll.bind(field)
			});
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

	function checkMove(keysPressed) {
		if (keysPressed[81] == 1) {
			p1Bord.move('top');
		}

		if (keysPressed[65] == 1) {
			p1Bord.move('bottom');
		}

		if (keysPressed[38] == 1) {
			p2Bord.move('top');
		}

		if (keysPressed[40] == 1) {
			p2Bord.move('bottom');
		}

		/*if (kc == controls1[0]) {
			var dir = 'top';
		} else {
			var dir = 'bottom';
		}

		//p1Bord.move(dir);

		if (kc == controls2[0]) {
			var dir = 'top';
		} else {
			var dir = 'bottom';
		}

		//p2Bord.move(dir);*/
	}

	$(document).keydown(function(e) {
		var kc = e.keyCode;

		if ($.inArray(kc, allControls) != -1) {
			keysPressed[kc] = 1;
			checkMove(keysPressed);
			e.preventDefault();
		}
	});

	$(document).keyup(function(e) {
		var kc = e.keyCode;

		if ($.inArray(kc, allControls) != -1) {
			keysPressed[kc] = 0;
			checkMove(keysPressed);
			e.preventDefault();
		}
	});

//})();
