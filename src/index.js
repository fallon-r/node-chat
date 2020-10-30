require("dotenv").config();
const port = process.env.PORT;
const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const { disconnect } = require("process");

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

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined");

  socket.on("sendMessage", (message, callback) => {
    io.emit("message", message);
    callback("Delivered!")
  });

  socket.on('sendLocation', (coords)=>{
    io.emit('message', `https://google.com/maps/?q=${coords.latitude},${coords.longitude}`)
  })

  socket.on('disconnect', ()=>{
    io.emit("message", "A user has left the room")
  })
});

server.listen(port, () => {
  console.log(`server's up on port ${port}`);
});
