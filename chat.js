'use strict';

const http = require('http');
const server = http.createServer().listen(4000);
const io = require('socket.io').listen(server);
const cookie_reader = require('cookie');
const querystring = require('querystring');

const redis = require("redis");
const sub = redis.createClient();

// 订阅chat channel
sub.subscribe('chat');

// 配置socket.io来存储Django设置的cookie
io.configure(function(){
    io.set('authorization', function(data, accept){
        if(data.headers.cookie){
            data.cookie = cookie_reader.parse(data.headers.cookie);
            return accept(null, true);
        }
        return accept('error', false);
    });
    io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {

    // 把信息从Redis发送到客户端
    sub.on('message', function(channel, message){
        socket.send(message);
    });

    // 客户端通过socket.io发送消息
    socket.on('send_message', function (message) {
        var values = querystring.stringify({
            comment: message,
            sessionid: socket.handshake.cookie['sessionid']
        });

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/node_api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': values.length
            }
        };

        // 使用Django server发消息
        var req = http.get(options, function(res){
            res.setEncoding('utf8');

            // 输出错误信息
            res.on('data', function(message){
                if(message != 'Everything worked :)'){
                    console.log('Message: ' + message);
                }
            });
        });

        req.write(values);
        req.end();
    });
});
