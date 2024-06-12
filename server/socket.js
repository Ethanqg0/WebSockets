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
  // Send the unique ID to the client
  socket.send(JSON.stringify({ id: id }));

  id += 1;

  socket.on("message", function (message) {
    let data = JSON.parse(String(message));
    console.log(data)
    wss.clients.forEach(function each(client) {
        client.send(
          JSON.stringify({ user: `User ${data.id}`, message: data.message })
        );
    });
  });
});

server.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});