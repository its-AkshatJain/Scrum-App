// server/socket/index.js
import { Server } from "socket.io";
import { cleanupOldRooms } from "./rooms.js";
import registerSocketHandlers from "./handlers.js";

export default function initSocket(server, corsOptions) {
  const io = new Server(server, { cors: corsOptions });

  io.on("connection", (socket) => registerSocketHandlers(io, socket));

  // Clean up old rooms every hour
  setInterval(() => cleanupOldRooms(), 60 * 60 * 1000);

  return io;
}
