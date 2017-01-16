'use strict';

const redis = require("redis");
const client = redis.createClient({host: "127.0.0.1", port: 6379});


client.select(0, redis.print);

client.on("error", function (err) {
    console.log("Error " + err);
});

client.get("abc", redis.print);

client.on("message", function (channel, message) {
    console.log("channel " + channel + ": " + message);
    if (message === "quit") {
        client.unsubscribe();
        client.quit();
    }
});

client.subscribe("push");

// client.quit();
