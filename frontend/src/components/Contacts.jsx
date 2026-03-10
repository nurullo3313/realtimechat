import React, {useEffect, useState } from"react";

import { Dropdown, Menu, Button} from "antd";
import { LogoutOutlined, MessageOutlined, MoreOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import {useNavigate } from"react-router-dom";
import {useDispatch, useSelector } from"react-redux";
import { logout} from "../redux/slices/authSlice";
import axios from "../utils/axios";
import toast from"react-hot-toast";
import { getSocket } from "../utils/socket";

export default function Contacts({setSelectedUser, selectedUser }) {
 const navigate = useNavigate()
 const dispatch = useDispatch()
 const {user, onlineUsers } = useSelector((state) => state.auth);
const [contacts, setContacts] = useState([]);
const [loading, setLoading] = useState(false);
const [unreadCounts, setUnreadCounts] = useState({});

  // Fetch contacts
 const fetchContacts = async () => {
 if (!user?._id) return;
  
  try {
  setLoading(true);
 const { data} = await axios.get("/message/users");
  setContacts(data.users || []);
  setLoading(false);
   
    // Calculate unread counts for each contact
  if(data.unseenMessages) {
    setUnreadCounts(data.unseenMessages);
     }
    } catch (error) {
 console.error("Error fetching contacts:", error);
  setLoading(false);
    toast.error("Не удалось загрузить контакты");
    }
  };

 useEffect(() => {
  fetchContacts();
 }, [user]);

// Listen for new messages and update unread count
useEffect(() => {
 const socket = getSocket();
 if (!socket) return;

const handleNewMessage = (newMessage) => {
   // If message is for current user and from a contact in the list
 if(newMessage.receiverId === user?._id && newMessage.senderId) {
     setUnreadCounts(prev => ({
       ...prev,
        [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
      }));
     }
   };

  socket.on("newMessage", handleNewMessage);

 return () => {
  if(socket){
      socket.off("newMessage", handleNewMessage);
     }
   };
 }, [user?._id]);

// Reset unread count when selecting a user
useEffect(() => {
 if(selectedUser?._id) {
   setUnreadCounts(prev => ({
      ...prev,
       [selectedUser._id]: 0
     }));
    }
  }, [selectedUser]);

const items = [
    {
      key: "profile",
      label: "Профил",
      icon: <UserOutlined/>,
      onClick: ()=> navigate("/profile")
    },
    {
      key: "logout",
      label: "Выйти",
      danger: true,
      icon :<LogoutOutlined />,
       onClick: ()=>{dispatch(logout()) , navigate("/login") , localStorage.removeItem("token")}
    },
  ];
  return (
    <div
      className={`${selectedUser ? "w-[27.5%]" : "w-[40%]"} bg-gradient-to-br from-violet-900/40 to-indigo-900/30 backdrop-blur-xl p-4 rounded-2xl text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <MessageOutlined className="text-xl" />
          </div>
          <div>
            <div className="text-lg font-semibold">Онлайн чат</div>
            <div className="text-xs text-white/60">Друзья и сообщения</div>
          </div>
        </div>
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <Button
            type="text"
            icon={<MoreOutlined style={{ color: "white", fontSize: 20 }} />}
          />
        </Dropdown>
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-2">
          <SearchOutlined className="text-white/70" />
          <input
            type="text"
            className="w-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/50"
            placeholder="Поиск собеседника"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 h-[60vh] overflow-auto pr-2">
        {loading ? (
          <div className="text-center text-white/60">Загрузка...</div>
        ) : (
         contacts.map((contact, index) => (
            <div
              key={contact._id}
              onClick={() => setSelectedUser(contact)}
             className={`flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/5 transition-shadow duration-150 cursor-pointer ${
               selectedUser && selectedUser._id === contact._id ? "bg-white/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={contact.profilImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                    alt={contact.username}
                   className="w-12 h-12 rounded-full object-cover border border-white/10"
                  />
                  {/* Online indicator */}
                  {onlineUsers.includes(contact._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white/20"></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{contact.username}</span>
                  <span className="text-xs text-white/60 max-w-xs truncate">{contact.bio || 'Нет био'}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
               {unreadCounts[contact._id] > 0 && (
                 <div className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                   {unreadCounts[contact._id]}
                 </div>
               )}
                <span className="text-xs text-white/60">
                  {onlineUsers.includes(contact._id) ? 'Онлайн' : 'Оффлайн'}
                </span>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
