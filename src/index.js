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
  console.log("New network connection");

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
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined`));

    callback();
  });

  // *send message
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback("Delivered!");
  });

  // *Location send
  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(user.username, 
        `https://google.com/maps/?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback("Server side OK!");
  });

  // *Disconnect Message
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user[0].room).emit(
        "message",
        generateMessage(`${user[0].username} has left the room`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`server's up on port ${port}`);
});
