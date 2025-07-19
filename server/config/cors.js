import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST"]
};

export default corsOptions;
