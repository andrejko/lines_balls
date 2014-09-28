var WS = new require('ws');
var players = {
	"#1": null, 
	"#2": null
};
var server = new WS.Server({port: 3000});
var _ = require('lodash');

server.on('connection', function(conn) {
	if (players["#1"] == null) {
		var clientID = '#1';
		var player1 = {
			connection: conn,
		}

		players[clientID] = player1;

		conn.send(JSON.stringify({
			command: 'set_as',
			commandData: 'player1',
		}));
	} else {
		var clientID = '#2';
		var player2 = {
			connection: conn,
		}

		players[clientID] = player2;

		conn.send(JSON.stringify({
			command: 'set_as',
			commandData: 'player2',
		}));
	}

	console.log("New connection " + clientID);

    conn.on("message", function(mess) {
    	console.log('Received ' + mess);

        for (var key in players) {
        	if (players[key] != null) {
            	players[key].connection.send(mess);
        	}
        }
    });

    conn.on("close", function () {
        console.log("Connection closed " + clientID);

        delete players[clientID];
    });
});