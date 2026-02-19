import {Router} from "express"
import { protectRoute } from "../middleware/auth.js"
import { getMessages, markMessageAsSeen, sendMessage, userForCaht } from "../controllers/message.js"


const routerMessage = new Router()
routerMessage.get("/users", protectRoute,userForCaht )
routerMessage.get("/message/:id", protectRoute,getMessages  )
routerMessage.put("/mark/:id", protectRoute,markMessageAsSeen )
routerMessage.post("/send-message/:id", protectRoute, sendMessage)



export default routerMessage


