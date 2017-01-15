'use strict';

const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);


io.on('connection', function (socket) {
    socket.on('event', function(data){
      console.log(data);
    });
    socket.on('disconnect', function(){
      console.log('disconnect');
    });
});

server.listen(3000);
