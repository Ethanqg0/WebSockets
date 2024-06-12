// console.log("Web socket:", wss);
// console.log("Web sockets clients:", wss.clients);

const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let id = 1;

wss.on("connection", function (socket) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send("CONNECTION FROM: " + id);
    }
  });

  id += 1;
});

server.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});
