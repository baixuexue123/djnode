'use strict';

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8888 });


wss.on('connection', function (ws) {

    ws.on('open', function () {
        console.log('open');
    });

    ws.on('message', function (message) {
        console.log('received: %s', message);
    });

    ws.send('something');

    ws.on('close', function (code, message) {
        console.log('close');
    });
});
