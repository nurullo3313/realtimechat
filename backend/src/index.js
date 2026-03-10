import express from "express"
import authRoute from "./routes/auth.js"
import { connectDB } from "./utils/connectDB.js"
import "dotenv/config";
import { PORT } from "./config.js";
import routerMessage from "./routes/message.js";
import {Server} from "socket.io"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';
import fs from "fs"

import http from"http"

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');
const publicUploadsDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(publicUploadsDir)) {
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

const app = express()
app.use(cors({
  origin: "*",
 credentials: true
}));
app.use(express.json({limit : "4mb"}))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

const server = http.createServer(app)

export const io = new Server(server, {
 cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"]
  }
})

export const userSocketMap = {}

io.on("connection", (socket) => {
 const userId = socket.handshake.query.userId;
 console.log("✅ User connected:", userId, "Socket ID:", socket.id);

 if (userId) {
   userSocketMap[userId] = socket.id;
   console.log("📍 User mapped:", userId, "->", socket.id);
  }

  // Broadcast updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));


  socket.on("disconnect", () => {
   
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

connectDB()

app.use("/api/auth", authRoute)
app.use("/api/message", routerMessage)

server.listen(PORT, () => {
 console.log(`🚀 Server running on http://localhost:${PORT}`)
 console.log(`🔌 Socket.IO ready`)
})
