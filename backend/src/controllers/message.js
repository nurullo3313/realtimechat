import Messages from "../models/Messages.js";
import User from "../models/User.js";
import { io , userSocketMap } from "../index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

export const userForCaht = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );
    if (!filteredUsers) {
      return res.status(404).json({
        msg: "Ползователи не сушетвуеть!",
      });
    }
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Messages.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);

    return res.status(200).json({
      msg: "Всё успешно прошло",
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Что-то пошло не так!",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: selecteUserId } = req.params;
    const myId = req.user._id;
    const messages = await Messages.find({
      $or: [
        { senderId: myId, receiverId: selecteUserId },
        { senderId: selecteUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });
    await Messages.updateMany(
      {
        senderId: selecteUserId,
        receiverId: myId,
      },
      { seen: true },
    );

    return res.status(200).json({
      msg: "Всё успешно прошло",
      messages,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Что-то пошло не так!",
    });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Messages.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true },
    );

    if (!message) {
      return res.status(404).json({ msg: "Сообщение не найдено" });
    }
    return res.status(200).json({ msg: "Сообщения порочитано!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Что-то пошло не так!",
    });
  }
};


export const sendMessage = async (req, res) => {
    try {
      const {text} = req.body
      const receiverId = req.params.id
      const senderId = req.user._id
      let imageUrl = null
      
      // Handle file upload if present
      if (req.file) {
        // Get the directory name properly for ES modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Create a public uploads directory
        const publicUploadsDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(publicUploadsDir)) {
          fs.mkdirSync(publicUploadsDir, { recursive: true });
        }
        
        // Move file to public uploads directory
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const destinationPath = path.join(publicUploadsDir, fileName);
        fs.renameSync(req.file.path, destinationPath);
        
        // Create URL accessible from frontend
        imageUrl = `/uploads/${fileName}`;
      }
      
      const newMessage = await Messages.create({
        text, 
        image: imageUrl,
        senderId,
        receiverId
      })

      const receiverSocketId = userSocketMap[receiverId]
      if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
      }

      return res.status(201).json({
        msg: "Соощения успешно отправлено!",
        newMessage
      })

      
      
    } catch (error) {
      console.log(error.message);
    res.status(500).json({
      msg: "Что-то пошло не так!",
    });
    }
}
