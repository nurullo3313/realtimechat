import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3313";

let socket = null;

export const connectSocket = (userId) => {
 // Disconnect existing socket if any
 if (socket) {
   socket.disconnect();
   socket = null;
  }

 socket = io(SOCKET_URL, {
   query: {
   userId: userId,
    },
 reconnection: true,
 reconnectionAttempts:5,
 reconnectionDelay: 1000,
  });

 socket.on("connect", () => {
 console.log("✅ Socket connected:", socket.id);
  });

 socket.on("disconnect", () => {
 console.log("❌ Socket disconnected");
  });

 socket.on("connect_error", (error) => {
 console.error("❌ Socket connection error:", error.message);
  });

 return socket;
};

export const disconnectSocket = () => {
 if (socket) {
   socket.disconnect();
   socket = null;
  }
};

export const getSocket = () => socket;

export default socket;
