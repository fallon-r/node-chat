require("dotenv").config();
const port = process.env.PORT;
const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const giphy = process.env.GIPHY_URL_START;
const { findGif } = require("./utils/giphy");
const {
  generateMessage,
  generateLocationMessage,
  generateGif,
} = require("./utils/messages");
const {
  addUser,
  getUser,
  getUserInRoom,
  removeUser,
} = require("./utils/users");

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
  // * Join room
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      ...options,
    });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    // *Welcome Message
    socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("Admin", `${user.username} has joined`));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });

  // *send message
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback("Delivered!");
  });

  // *send gif
  socket.on("sendGif", (url, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("gifMessage", generateGif(user.username, url));

    callback("Delivered!");
  });

  // *Location send
  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps/?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback("Server side OK!");
  });

  // *Disconnect Message
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    const removed = removeUser(user.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left the room`)
      );
    }
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
  });
});

server.listen(port, () => {
  console.log(`server's up on port ${port}`);
});
