// server/socket/handlers.js
import generateRoomId from "../utils/generateRoomId.js";
import { createRoom, getRoom, addParticipant, removeParticipant } from "./rooms.js";

export default function registerSocketHandlers(io, socket) {
  console.log("User connected:", socket.id);

  socket.on("create-room", (callback) => {
    const roomId = generateRoomId();
    createRoom(roomId);
    console.log(`Room created: ${roomId}`);
    callback(roomId);
  });

  socket.on("join-room", (roomId) => {
    if (!roomId || typeof roomId !== 'string') {
      socket.emit("error", { message: "Invalid room ID" });
      return;
    }

    const room = io.sockets.adapter.rooms.get(roomId);
    if (room && room.size >= 2) {
      socket.emit("error", { message: "Room is full (max 2 participants)" });
      return;
    }

    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    addParticipant(roomId, socket.id);

    socket.to(roomId).emit("user-joined", socket.id);

    const currentRoom = io.sockets.adapter.rooms.get(roomId);
    if (currentRoom) {
      socket.emit("room-info", {
        roomId,
        participantCount: currentRoom.size
      });
    }
  });

  socket.on("leave-room", (roomId) => {
    if (roomId) {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", socket.id);
      removeParticipant(roomId, socket.id);
      console.log(`${socket.id} left room ${roomId}`);
    }
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data);
  });

  socket.on("disconnecting", () => {
    [...socket.rooms].filter(r => r !== socket.id).forEach(roomId => {
      socket.to(roomId).emit("user-left", socket.id);
      removeParticipant(roomId, socket.id);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};
