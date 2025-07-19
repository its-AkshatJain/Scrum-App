// server/server.js
import express from "express";
import { createServer } from "http";
import cors from "cors";
import initSocket from "./socket/index.js";
import corsOptions from "./config/cors.js";

const app = express();
app.use(cors(corsOptions));

// Health-check route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const server = createServer(app);

// Initialize Socket.IO
initSocket(server, corsOptions);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
