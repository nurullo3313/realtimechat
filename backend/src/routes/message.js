import {Router} from "express"
import { protectRoute } from "../middleware/auth.js"
import { getMessages, markMessageAsSeen, sendMessage, userForCaht } from "../controllers/message.js"
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


const routerMessage = new Router()
routerMessage.get("/users", protectRoute,userForCaht )
routerMessage.get("/message/:id", protectRoute,getMessages  )
routerMessage.put("/mark/:id", protectRoute,markMessageAsSeen )
routerMessage.post("/send-message/:id", protectRoute, upload.single('image'), sendMessage)



export default routerMessage


