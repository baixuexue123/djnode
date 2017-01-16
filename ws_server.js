'use strict';

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', function (ws) {

    console.log(wss.clients);

    console.log(typeof ws);

    ws.on('message', function (message) {
        try {
            var msg = JSON.parse(message);
        }
        catch (e) {
            console.log(e);
        }
        console.log('Received: %s', message);
    });

    ws.send("Hello, It's Server");

    ws.on('close', function (code, message) {
        console.log(code);
        console.log(message);
        console.log('close');
    });
});
