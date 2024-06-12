const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let id = 1;

const rooms = new Map();

wss.on("connection", function (socket) {
  // Send the unique ID to the client
  wss.clients.forEach(function each(client) {
    client.send(
      JSON.stringify({ userId: id, message: `User ${id} connected`, justConnected: true })
    );
  });

  id += 1;

  socket.on("message", function (message) {
    let data = JSON.parse(String(message));
    wss.clients.forEach(function each(client) {
        client.send(
          JSON.stringify({ userId: `User ${data.userId}`, message: data.message })
        );
    });
  });
});

server.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});