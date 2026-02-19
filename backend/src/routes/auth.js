import  {Router} from "express"
import { checkAuth, editProfileUser, login, register } from "../controllers/auth.js"
import { protectRoute } from "../middleware/auth.js"


const router = new Router()

router.post("/login" , login)
router.post("/register" , register)
router.put("/edit-profile" ,protectRoute, editProfileUser)
router.get("/check-auth", protectRoute, checkAuth)



export default router