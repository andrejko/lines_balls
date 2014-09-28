Network = function(url) {
    this.url = url;
    this.socket = null;
    this.pingTime = 0;
    this.sendingPing = false;
}

Network.prototype.ping = function() {
    console.log('ping');
    if (this.sendingPing) {
        return;
    }
    this.sendingPing = true;
    this.startDate = new Date();
    this.socket.send("ping");
}

Network.prototype.start = function() {
    var socket = new WebSocket(this.url);

    this.socket = socket;

    socket.onopen = function () {
        socket.send(JSON.stringify({
            command: 'ping',
            commandData: '',
        }));
    };

    socket.onerror = function (error) {
        console.log('WebSocket Error ', error);
    };

    socket.onmessage = function (e) {
        console.log('Server: ' + e.data);

        var data = $.parseJSON(e.data);

        // set player
        if (data.command == 'set_as') {
            Game.setLocalPlayer(data.commandData);
        }

        // keydown
        if (data.command == 'keydown') {
            Game.handleKeyDown(data.commandData);
        }

        // keyup
        if (data.command == 'keyup') {
            Game.handleKeyUp(data.commandData);
        }
    };
}

Network.prototype.isConnected = function() {
    return (this.socket.readyState == 1);
}

Network.prototype.isReady = function() {
    if (Game.localPlayerIndex == null) {
        return false;
    }

    return true;
}

Network.prototype.sendEvent = function(event, data) {
    console.log(event + ' ' + data);
    this.socket.send(JSON.stringify({
        command: event,
        commandData: data
    }));
}