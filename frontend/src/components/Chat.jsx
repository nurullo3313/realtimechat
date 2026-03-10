import {
  InfoCircleOutlined,
  MessageOutlined,
  PictureOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Image } from 'antd';
import React, {useEffect, useRef, useState } from"react";
import assets from "../assets/assets";
import axios from "../utils/axios";
import toast from"react-hot-toast";
import { getSocket } from "../utils/socket";
import {useSelector } from"react-redux";

export default function Chat({ setSelectedUser, selectedUser }) {
 const scrollEnd = useRef()
 const [messages, setMessages] = useState([]);
const [messageText, setMessageText] = useState("");
const [imageFile, setImageFile] = useState(null);
const [loading, setLoading] = useState(false);
const {user} = useSelector((state) => state.auth);

 // Fetch messages when selected user changes
 const fetchMessages = async () => {
 if (!selectedUser?._id || !user?._id) return;
   
  try {
   setLoading(true);
  const { data} = await axios.get(`/message/message/${selectedUser._id}`);
  setMessages(data.messages || []);
   setLoading(false);
   } catch (error) {
  console.error("Error fetching messages:", error);
   setLoading(false);
    toast.error("Не удалось загрузить сообщения");
   }
 };

// Listen for new messages - Global listener(runs once)
 useEffect(() => {
 const socket = getSocket();
 if (!socket) return;

 const handleGlobalNewMessage = (newMessage) => {
   console.log("📨 New message received:", newMessage);
    
    // Check if message is from/to selected user
  if (selectedUser && (
       (newMessage.senderId === selectedUser._id && newMessage.receiverId === user?._id) ||
       (newMessage.senderId === user?._id && newMessage.receiverId === selectedUser._id)
     )) {
    setMessages((prev) => [...prev, newMessage]);
      
      // Show notification if message is from other user
    if (newMessage.senderId === selectedUser._id) {
        toast.success(`Новое сообщение от ${selectedUser.username}`);
       }
     } else if (newMessage.receiverId === user?._id) {
       // Message from another user- show notification
       toast.success(`Новое сообщение от пользователя`);
      }
    };

  socket.on("newMessage", handleGlobalNewMessage);
 console.log("✅ Socket listener registered");

 return () => {
   if(socket){
      socket.off("newMessage", handleGlobalNewMessage);
     console.log("❌ Socket listener removed");
     }
   };
 }, [user?._id]); // Only re-run when user changes

// Listen for selected user change and fetch messages
useEffect(() => {
 if(selectedUser?._id){
    fetchMessages();
   }
 }, [selectedUser?._id]);

// Scroll to bottom when new message arrives
useEffect(() => {
 if(scrollEnd.current){
    scrollEnd.current.scrollIntoView({behavior: "smooth"})
   }
 }, [messages])

 // Mark messages as read when opening chat
 useEffect(() => {
 if(selectedUser?._id && messages.length > 0) {
    // Mark all unread messages from this user as read
   const unreadMessages = messages.filter(
      msg => msg.senderId === selectedUser._id && !msg.seen
     );
     
   if(unreadMessages.length > 0) {
      // Send mark as read requests
      unreadMessages.forEach(async (msg) => {
      try {
         await axios.put(`/message/mark/${msg._id}`);
         } catch (error) {
         console.error("Error marking message as read:", error);
         }
       });
       
       // Update local state to mark as seen
      setMessages(prev => prev.map(msg => 
         unreadMessages.find(u => u._id === msg._id) 
           ? {...msg, seen: true} 
           : msg
       ));
      }
    }
  }, [selectedUser?._id]);

const sendMessage = async () => {
  if (!messageText.trim() && !imageFile) return;
  if (!selectedUser?._id) return;

  try {
    const formData = new FormData();
     formData.append("text", messageText);
    if (imageFile) {
       formData.append("image", imageFile);
     }

    const { data} = await axios.post(`/message/send-message/${selectedUser._id}`, formData, {
      headers: {
         "Content-Type": "multipart/form-data",
       },
     });

    setMessageText("");
    setImageFile(null);
     
     // Add message to local state immediately
    setMessages((prev) => [...prev, data.newMessage]);
   } catch (error) {
    console.error("Error sending message:", error);
     toast.error("Ошибка отправки сообщения");
   }
 };

const handleKeyPress = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
     e.preventDefault();
    sendMessage();
   }
 };

 if (!selectedUser) {
   return (
     <div
      className={`${selectedUser ? "w-[45%]" : "w-[60%]"} relative flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border-l border-r border-white/10 p-6`}
     >
       <div className="text-white flex flex-col justify-center items-center gap-5 text-center">
         <div className="p-4 bg-white/5 rounded-full">
           <MessageOutlined className="text-6xl" />
         </div>
         <div>
           <h2 className="text-3xl font-semibold mb-2">Онлайн чат</h2>
           <p className="text-white/60 text-sm">Выберите контакт для начала чата</p>
         </div>
       </div>
     </div>
    );
  }

 return selectedUser ? (
   <div
    className={`${selectedUser ? "w-[45%]" : "w-[60%]"} bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border-l border-r border-white/10 p-4 flex flex-col h-screen text-white`}
   >
     <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
       <div className="flex items-center gap-3">
         <img
           src={selectedUser.profilImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
           alt=""
          className="w-10 h-10 rounded-full border border-white/20 object-cover"
         />
         <div>
           <span className="font-semibold block">{selectedUser.username}</span>
           <span className="text-xs text-white/60 flex items-center gap-1">
             {/* Online status will be handled by Socket.IO */}
             <span className="p-1 rounded-full bg-green-500 inline-block"></span>онлайн
           </span>
         </div>
       </div>
       <InfoCircleOutlined
        className="text-xl cursor-pointer hover:text-white/80 transition"
         style={{ color: "currentColor" }}
       />
     </header>
     
     {/* chat */}
     <div className="h-[62vh] overflow-y-auto p-4 space-y-4 pr-2 scrollbar-thin">
       {loading ? (
         <div className="text-center text-white/60">Загрузка сообщений...</div>
       ) : (
         messages.map((msg) => {
          const isMe = msg.senderId === user?._id;

          return (
             <div
               key={msg._id}
              className={`flex items-end gap-2 ${
                 isMe ? "justify-end" : "justify-start"
               }`}
             >
               {!isMe && (
                 <img
                   src={selectedUser.profilImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                   alt={selectedUser.username}
                  className="w-8 h-8 rounded-full object-cover"
                 />
               )}

               <div
                className={`max-w-xs sm:max-w-sm md:max-w-md rounded-2xl px-4 py-2.5 shadow-md transition-all
                   ${isMe
                     ? "bg-violet-600 text-white rounded-br-none shadow-violet-500/20"
                     : "bg-white/10 text-white/90 rounded-bl-none border border-white/20 backdrop-blur-sm"
                   }`}
               >
                 {msg.text && (
                   <p className="text-sm leading-relaxed break-words">
                     {msg.text}
                   </p>
                 )}

                 {msg.image && (
                   <Image
                     src={msg.image.startsWith('http') ? msg.image : `http://localhost:3313${msg.image}`}
                     alt="chat-img"
                    className="mt-2 rounded-lg max-h-60 object-cover"
                   />
                 )}

                 <div
                  className={`text-[10px] mt-1.5 flex items-center gap-1
                   ${isMe ? "text-white/70 justify-end" : "text-white/50"}`}
                 >
                   {new Date(msg.createdAt).toLocaleTimeString([], {
                     hour: "2-digit",
                     minute: "2-digit",
                   })}

                   {isMe && <span>{msg.seen ? "✓✓" : "✓"}</span>}
                 </div>
               </div>

               {isMe && (
                 <img
                   src={user?.profilImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                   alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                 />
               )}
             </div>
           );
         })
       )}
       {/* <div ref={scrollEnd}></div> */}
     </div>
     {/* end chat */}
     
     <div className="mt-4 flex gap-2 bg-white/5 rounded-full px-4 py-0.5 border border-white/10 backdrop-blur-sm">
       <div className="flex items-center w-full">
         <label htmlFor="file" className="cursor-pointer hover:text-violet-300 transition">
           <PictureOutlined className="text-lg" />
         </label>
         <input 
           type="file" 
           id="file" 
          className="hidden" 
           accept="image/png, image/jpeg"
           onChange={(e) => setImageFile(e.target.files[0])}
         />
         {imageFile && (
           <span className="text-xs text-white/60 ml-2">{imageFile.name}</span>
         )}
         <input
           type="text"
           placeholder="Сообщение..."
          className="w-full bg-transparent outline-none px-3 py-2 text-white placeholder:text-white/50"
           value={messageText}
           onChange={(e) => setMessageText(e.target.value)}
           onKeyPress={handleKeyPress}
         />
       </div>
       <button
         onClick={sendMessage}
        className="hover:text-violet-300 transition p-2"
       >
         <SendOutlined className="text-lg" />
       </button>
     </div>
   </div>
  ) : null
}
