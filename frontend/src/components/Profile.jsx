import React from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { Image } from "antd";

export default function Profile({selectedUser, setSelectedUser}) {
  return (
    <div className="w-[27.5%] bg-gradient-to-br from-violet-900/40 to-indigo-900/30 backdrop-blur-xl p-6 rounded-2xl text-white max-h-screen overflow-auto">
      <div className="flex flex-col h-full">
        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center gap-4 pb-6 border-b border-white/10">
          <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-white/20 shadow-lg">
            <Image
            src={assets.profile_martin || assets.avatar_icon} 
            alt=""
            className="rounded-full w-full h-full object-cover"
          />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
            <span className="p-1.5 rounded-full bg-green-600"></span>
            <span className="font-semibold">Нурулло Абдухоликов</span>
          </div>
          <p className="text-sm text-white/70">Lorem ipsum dolor sit amet.</p>
          </div>
        </div>

        {/* Media Section */}
        <div className="flex flex-col gap-4 mt-6 flex-1">
          <div>
            <h3 className="font-semibold text-sm text-white/80 mb-3 uppercase tracking-wide">Медиа</h3>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
            {imagesDummyData.map((img)=>(
              <div key={img} className="relative rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-150 hover:shadow-lg hover:shadow-violet-500/20">
                <Image src={img }  style={{ objectFit: 'cover', width: '100%', height: '100%' }}/>
              </div>
            ))}
            
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button onClick={()=>setSelectedUser(false)} className="mt-6 w-full py-2 px-4 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 transition-all duration-150 rounded-lg shadow-md hover:shadow-lg">
  Выйти из чата
</button>
      </div>
    </div>
  );
}
