const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Map();

wss.on("connection", function (socket) {
  let id = uuidv4().substring(0,4);
  socket.send(JSON.stringify({ userId: id, message: `User ${id} connected`, justConnected: true}));

  socket.on("message", function (message) {
    let data = JSON.parse(String(message));
    let room;
    if (clients.has(data.roomId)) {
      clients.get(data.roomId).add(socket);
    } else {
      clients.set(data.roomId, new Set([socket]));
    }


    room = clients.get(data.roomId);
    if (room) {
      room.forEach(function each(client) {
        client.send(
          JSON.stringify({ userId: data.userId, message: data.message, roomId: data.roomId })
        );
      });
    }

  });
});

server.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});