import { createContext, useContext, useEffect, useRef } from"react";
import {useDispatch, useSelector } from"react-redux";
import { connectSocket, disconnectSocket, getSocket } from "../utils/socket";
import { setOnlineUsers } from "../redux/slices/authSlice";

const SocketContext = createContext(null);

export const SocketProvider= ({ children }) => {
 const dispatch = useDispatch();
const {user} = useSelector((state) => state.auth);
const socketRef = useRef(null);
const hasConnected = useRef(false);

 useEffect(() => {
 if (user?._id && !hasConnected.current) {
   console.log("🔌 Connecting Socket for user:", user._id);
      
     // Connect socket with user ID
   const socket = connectSocket(user._id);
     socketRef.current = socket;

     // Listen for online users update
    socket.on("getOnlineUsers", (onlineUserIds) => {
     console.log("👥 Online users updated:", onlineUserIds);
       dispatch(setOnlineUsers(onlineUserIds));
     });

     hasConnected.current = true;

     // Cleanup on unmount or logout
   return () => {
     console.log("🔌 Disconnecting Socket");
       disconnectSocket();
      hasConnected.current = false;
     };
   }
 }, [user, dispatch]);

 return (
   <SocketContext.Provider value={{ socket: getSocket(), connected: hasConnected.current }}>
     {children}
   </SocketContext.Provider>
 );
};

export const useSocket = () => {
 const context = useContext(SocketContext);
 if (!context) {
  throw new Error("useSocket must be used within SocketProvider");
  }
 return context;
};
