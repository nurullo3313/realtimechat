import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { SECRET_KEY } from "../config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

export const register = async (req, res) => {
  try {
    const { username, email, password, profilImage, bio } = req.body;

    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res.json({
        msg: "Данный email заняь",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      profilImage,
      bio,
    });
    if (!user) {
      res.status(400).json({
        msg: "Не удалос зарегистрироватся!",
      });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "30d",
    });

    return res.status(201).json({
      msg: "Регстратция прошло успешно!",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ошибка при регстарция",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(404).json({
        msg: "Позователь не сушствуеть!",
      });
    }
    const isCorrectPass = await bcrypt.compare(password, userData.password);

    if (!isCorrectPass) {
      return res.status(401).json({
        msg: "Не правеный email или пароль",
      });
    }

    const token = jwt.sign({ userId: userData._id }, SECRET_KEY, {
      expiresIn: "30d",
    });

    const { password: _, ...userInfo } = userData._doc;

    return res.status(200).json({
      msg: "Успешно авторзован!",
      token,
      userData: userInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ошибка при авторизатция",
    });
  }
};

export const checkAuth = async (req, res) => {
  res.status(200).json({
    msg: "Доступ открыт",
    user: req.user,
  });
};

export const editProfileUser = async (req, res) => {
  try {
    console.log('Received profile edit request:', {
      body: req.body,
      file: req.file,
      user: req.user
    });
    
    const { username, email, bio } = req.body;
    const userId = req.user._id;
    
    let updateData = { username, email, bio };
    
    // Handle file upload if present
    if (req.file) {
      
    
      // For now, let's save the file locally and use a local path
      // In production, you'd want to use Cloudinary or another service
      
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
      const fileUrl = `/uploads/${fileName}`;
      updateData.profilImage = fileUrl;
      
    }

    const editUser= await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    
    
    res.status(200).json({
      msg: "Профиль успешно изменён!",
      user: editUser,
    });
  } catch (error) {
    console.error('Profile edit error:', error);
    return res.status(500).json({
      msg: error.message || "Ошибка сервера при измнения профила!",
    });
  }
};
