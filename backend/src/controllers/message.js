import Messages from "../models/Messages.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import { io , userSocketMap } from "../index.js";

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

      const {text, image} = req.body
      const receiverId = req.params.id
      const senderId = req.user._id
      let imageUrl
      if(image){
        const uploadResponse =  await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
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
