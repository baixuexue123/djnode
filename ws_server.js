'use strict';

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8888 });


wss.on('connection', function (ws) {

    console.log(typeof ws);

    ws.on('message', function (message) {
        var msg = JSON.$.parse(message);
        console.log('received: %s', message);
    });

    ws.send('something');

    ws.on('close', function (code, message) {
        console.log(code);
        console.log(message);
        console.log('close');
    });
});
