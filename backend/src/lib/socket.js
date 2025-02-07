import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:["http://localhost:5173"],
    credentials: true
  }
})

// { userId: socketId }
const userSockMap = {}; 

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSockMap[userId] = socket.id; 

  // .emit is for sending to all users
  io.emit("getOnlineUsers", Object.keys(userSockMap));

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    delete userSockMap[userId];
  })
})

export { io, server, app }
