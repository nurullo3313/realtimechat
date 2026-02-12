import React from "react";

import { Dropdown, Menu, Button } from "antd";
import { LogoutOutlined, MessageOutlined, MoreOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import UserContact from "./UserContact";
import {userDummyData} from "../assets/assets"
import { useNavigate } from "react-router-dom";

export default function Contacts({ setSelectedUser, selectedUser }) {
   const navigate = useNavigate()
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
       onClick: ()=> navigate("/login")
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
        {userDummyData.map((user, index) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/5 transition-shadow duration-150 cursor-pointer ${
              selectedUser && selectedUser._id === user._id ? "bg-white/10" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={user.profilePic}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover border border-white/10"
              />
              <div className="flex flex-col">
                <span className="font-medium">{user.fullName}</span>
                <span className="text-xs text-white/60 max-w-xs truncate">{user.bio}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-white/60">12:34</span>
              <div className={`text-xs font-semibold text-white ${index === 0 ? 'bg-rose-500 px-2 py-0.5 rounded-full' : ''}`}>
                {index === 0 ? 4 : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
