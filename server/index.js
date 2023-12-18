const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  let rm = -1;

  socket.on("join_room", (room) => {
    socket.join(room);

    if (rm !== -1){
      const data = { message: `User ${socket.id} disconnected`, rm };
      socket.to(rm).emit("leaveMessage", data);
    }

    rm = room;

    const data = { message: `User ${socket.id} joined`, room };
    socket.to(room).emit("joinMessage", data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    const data = { message: `User ${socket.id} disconnected`, rm };
    socket.to(rm).emit("leaveMessage", data);
  });
});


server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
