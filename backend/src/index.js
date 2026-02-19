import express from "express"
import authRoute from "./routes/auth.js"
import { connectDB } from "./utils/connectDB.js"
import "dotenv/config";
import { PORT } from "./config.js";
import routerMessage from "./routes/message.js";
import {Server} from "socket.io"
import cors from "cors"

import http from "http"




const app = express()
app.use(express.json({limit : "4mb"}))

const server  = http.createServer(app)

export  const io =  new Server(server,({
    cors : {origin:"*"}
}))

export const userSocketMap ={}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user on", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User off", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});




connectDB()



app.use("/api/auth" , authRoute)
app.use("/api/message" , routerMessage)





server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})