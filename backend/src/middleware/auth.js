import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { SECRET_KEY } from "../config.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "Нет токена, доступ запрещён"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "Пользователь не найден"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      msg: "Недействительный токен"
    });
  }
};


