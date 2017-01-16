'use strict';

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const redis = require("redis");
const sub = redis.createClient();

// 订阅chat channel
sub.subscribe('push');


wss.on('connection', function (ws) {

    // 把信息从Redis发送到客户端
    sub.on('message', function(channel, message){
        ws.send(message);
    });

    console.log(typeof ws);

    ws.on('message', function (message) {
        try {
            var msg = JSON.parse(message);
        }
        catch (e) {
            // console.log(e);
        }
        console.log('Received: %s', message);
    });

    ws.send("Hello, It's Server");

    ws.on('close', function (code, message) {
        console.log(code);
        console.log(message);
        console.log('close');
    });

    console.log(wss.clients.length);

    console.log(wss.clients);
});
