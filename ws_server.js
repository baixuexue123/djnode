'use strict';

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8200 });
const redis = require("redis");
const sub = redis.createClient({host: "127.0.0.1", port: 6379, db: 0});
const log4js = require('log4js');

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/marmot.log', category: 'marmot' }
    ]
});

const logger = log4js.getLogger('marmot');
logger.setLevel('DEBUG');

// 订阅push channel
sub.subscribe('push');


wss.on('connection', function (ws) {

    var sessionid = undefined;
    var origin = ws.upgradeReq.headers.origin;

    logger.info(origin + " is connected!");

    ws.send(JSON.stringify({content: "*********Marmot WebSocketServer************"}));

    // 处理Redis订阅消息
    sub.on('message', function (channel, message) {
        try {
            var msg = JSON.parse(message);
            if (msg.sessionid === sessionid) {
                // 发送消息到客户端
                ws.send(JSON.stringify({content: msg.content}), function (err) {
                    if (typeof err !== "undefined") {
                        logger.log(err);
                    } else {
                        logger.info("Redis published: " + message);
                    }
                });
            }
        } catch (e) {
            logger.error(e);
        }
    });

    ws.on('message', function (message) {
        try {
            var msg = JSON.parse(message);
            sessionid = msg.sessionid;
            logger.debug("Received sessionid: " + sessionid);
        } catch (e) {
            logger.error(e);
        }
    });

    ws.on('close', function (code, message) {
        logger.info(origin + ' is gone!');
    });

});
