var WS = new require('ws');
var players = [];
var server = new WS.Server({port: 3000});

server.on('connection', function(conn) {
    console.log("New connection");

	if (players.length <= 2) {
		if (typeof players[0] == 'undefined') {
			var clientID = 0;
			var player1 = {
				connection: conn,
			}

			players.push(player1);

			conn.send(JSON.stringify({
				command: 'set_as',
				commandData: 'player1',
			}));
		} else {
			var clientID = 1;
			var player2 = {
				connection: conn,
			}

			players.push(player2);

			conn.send(JSON.stringify({
				command: 'set_as',
				commandData: 'player2',
			}));
		}
	}

    conn.on("message", function(mess) {
    	console.log('Received ' + mess);

        for (var key in players) {
            players[key].connection.send(mess);
        }
    });

    conn.on("close", function () {
        console.log("Connection closed " + clientID);

        delete players[clientID];
    });

    console.log(players.length);
});