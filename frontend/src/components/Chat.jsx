import {
  InfoCircleOutlined,
  MessageOutlined,
  PictureOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Image } from 'antd';
import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData, userDummyData } from "../assets/assets";

export default function Chat({ setSelectedUser, selectedUser }) {

  const scrollEnd = useRef()


  useEffect(()=>{
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior: "smooth"})
    }
  },[])

  return selectedUser ? (
    <div
      className={`${selectedUser ? "w-[45%]" : "w-[60%]"} bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border-l border-r border-white/10 p-4 flex flex-col h-screen text-white`}
    >
      <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={assets.profile_martin}
            alt=""
            className="w-10 h-10 rounded-full border border-white/20 object-cover"
          />
          <div>
            <span className="font-semibold block">Нурулло Абдухоликов</span>
            <span className="text-xs text-white/60 flex items-center gap-1"><span className="p-1 rounded-full bg-green-500 inline-block"></span>онлайн</span>
          </div>
        </div>
        <InfoCircleOutlined
          className="text-xl cursor-pointer hover:text-white/80 transition"
          style={{ color: "currentColor" }}
        />
      </header>
      {/* chat */}
    <div className="h-[62vh] overflow-y-auto p-4 space-y-4 pr-2 scrollbar-thin">
        {messagesDummyData.map((msg) => {
          const isMe = msg.senderId === "680f5116f10f3cd28382ed02";
          const user = userDummyData[msg.senderId];

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* AVATAR LEFT */}
              {!isMe && (
                <img
                  src={assets.profile_martin}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              {/* MESSAGE BUBBLE */}
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
   
                    src={msg.image}
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

              {/* AVATAR RIGHT */}
              {isMe && (
                <img
                  src={assets.avatar_icon}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
      
            </div>

          );
        })}
      </div>
      {/* end chat */}
      <div className="mt-4 flex gap-2 bg-white/5 rounded-full px-4 py-0.5 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center w-full">
          <label htmlFor="file" className="cursor-pointer hover:text-violet-300 transition">
            <PictureOutlined className="text-lg" />
          </label>
          <input type="file" id="file" className="hidden" accept="image/png, image/jpeg"/>
          <input
            type="text"
            placeholder="Сообщение..."
            className="w-full bg-transparent outline-none px-3 py-2 text-white placeholder:text-white/50"
          />
        </div>
        <button className="hover:text-violet-300 transition p-2">
          <SendOutlined className="text-lg" />
        </button>
      </div>
 
    </div>
  ) : (
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
