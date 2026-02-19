import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import "dotenv/config";
import { SECRET_KEY } from "../config.js";
import cloudinary from "../utils/cloudinary.js";

export const register  = async(req, res)=>{

    try {
        const {username, email , password , profilImage , bio} = req.body

        const isExistUser = await User.findOne({email})
        if(isExistUser){
            return res.json({
                msg : "Данный email заняь"
            })
        }
        const hashPassword = await bcrypt.hash(password ,10)
        const user = await User.create({
            username,
             email ,
              password: hashPassword,
              profilImage, 
              bio
        })
        if(!user){
            res.status(400).json({
                msg : "Не удалос зарегистрироватся!"
            })
        }

        const token = jwt.sign({userId: user._id},SECRET_KEY , {expiresIn: "30d"})

        await user.save()
        return res.status(201).json({
            msg: "Регстратция прошло успешно!",
            user,
            token,
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg : "Ошибка при регстарция"
        })
    }

}

export const login  = async (req, res)=>{
        try {
            const { email , password} = req.body
           const userData =  await User.findOne({email})
           if(!userData){
                return res.status(404).json({
                   msg: "Позователь не сушствуеть!" 
                })
           }
            const isCorrectPass = await bcrypt.compare(password ,userData.password )

            if(!isCorrectPass){
                return res.status(401).json({
                    msg : "Не правеный email или пароль"
                })
            }

            const token = jwt.sign({userId : userData._id},SECRET_KEY,{expiresIn  : "30d"} )
         
                const { password: _, ...userInfo } = userData._doc;
            return res.status(200).json({
                msg : "Успешно авторзован!",
                token,
                userData:userInfo
            })
           

        } catch (error) {
            console.log(error)
        res.status(500).json({
            msg : "Ошибка при авторизатция"
        })
        }
}


export const checkAuth = async (req, res)=>{
   res.status(200).json({
    msg : "Доступ открыт",
    user : req.user
    })
}

export const editProfileUser = async (req, res)=>{
    try {
        const {username, email ,profilImage , bio} = req.body
        const userId = req.user._id
        let editUser
      if(!profilImage){
          editUser = await User.findByIdAndUpdate(userId,
            {username, email ,profilImage , bio},
            {new: true}
        )
      }else{
            const upload = await cloudinary.uploader.upload(profilImage)
          editUser = await User.findByIdAndUpdate(userId,
            {username, email , bio , profilImage:upload.secure_url  },
            {new: true}
          )
        }

        res.status(200).json({
            msg : "Профиль успешно изменён!",
            editUser

        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            msg : "Ошибка сервера при измнения профила!"
        })
    }
}