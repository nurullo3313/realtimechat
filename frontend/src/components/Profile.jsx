import React, {useState, useEffect} from"react";
import assets from "../assets/assets";
import { Image} from "antd";
import {useDispatch, useSelector } from"react-redux";
import {useNavigate } from"react-router-dom";
import axios from "../utils/axios";
import toast from"react-hot-toast";

export default function Profile({selectedUser, setSelectedUser}) {
 const {user} = useSelector((state) => state.auth);
const [mediaMessages, setMediaMessages] = useState([]);
const [loading, setLoading] = useState(false);

 // Fetch media messages when selected user changes
 useEffect(() => {
 if(!selectedUser?._id || !user?._id) return;
   
 const fetchMedia = async () => {
  try {
    setLoading(true);
   const { data} = await axios.get(`/message/message/${selectedUser._id}`);
     
     // Filter messages with images
   const images = (data.messages || []).filter(msg => msg.image);
    setMediaMessages(images);
    setLoading(false);
    } catch (error) {
   console.error("Error fetching media:", error);
    setLoading(false);
    }
  };

  fetchMedia();
 }, [selectedUser, user]);

 return (
   <div className="w-[27.5%] bg-gradient-to-br from-violet-900/40 to-indigo-900/30 backdrop-blur-xl p-6 rounded-2xl text-white max-h-screen overflow-auto">
     <div className="flex flex-col h-full">
       {/* Profile Header */}
      <div className="flex flex-col items-center justify-center gap-4 pb-6 border-b border-white/10">
        <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-white/20 shadow-lg">
          <Image
           src={selectedUser?.profilImage || assets.avatar_icon} 
            alt=""
          className="rounded-full w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
           <span className="p-1.5 rounded-full bg-green-600"></span>
           <span className="font-semibold">{selectedUser?.username || 'Пользователь'}</span>
         </div>
         <p className="text-sm text-white/70">{selectedUser?.bio || 'Нет био'}</p>
        </div>
      </div>

       {/* Media Section */}
       <div className="flex flex-col gap-4 mt-6 flex-1">
         <div>
           <h3 className="font-semibold text-sm text-white/80 mb-3 uppercase tracking-wide">Медиа</h3>
           
           {loading ? (
             <div className="text-center text-white/60 text-sm py-4">Загрузка...</div>
           ) : mediaMessages.length > 0 ? (
             <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
              {mediaMessages.map((msg, index) => (
                <div 
                 key={`${msg._id}-${index}`} 
                className="relative rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-150 hover:shadow-lg hover:shadow-violet-500/20 group cursor-pointer"
               >
                 <Image 
                   src={msg.image.startsWith('http') ? msg.image: `http://localhost:3313${msg.image}`}
                   alt={`Media ${index + 1}`}
                   style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                   preview={true}
                 />
                 {/* Overlay with date on hover */}
                 
               </div>
             ))}
             </div>
           ) : (
             <div className="text-center text-white/60 text-sm py-8">
               Нет медиа файлов
             </div>
           )}
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
