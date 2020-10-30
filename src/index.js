require("dotenv").config();
const port = process.env.PORT;
const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//  paths
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

app.get("", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  console.log("New network connection");

  socket.emit("message", generateMessage("Welcome!"));
  socket.broadcast.emit("message", generateMessage("A new user has joined"));

  socket.on("sendMessage", (message, callback) => {
    io.emit("message", generateMessage(message));
    callback("Delivered!");
  });

  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps/?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback("Server side OK!");
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left the room"));
  });
});

server.listen(port, () => {
  console.log(`server's up on port ${port}`);
});
