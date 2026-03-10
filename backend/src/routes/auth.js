import { Router } from "express";
import { checkAuth, editProfileUser, login, register } from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";
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

const router = new Router();

router.post("/login", login);
router.post("/register", register);
router.put("/edit-profile", protectRoute, upload.single('profilImage'), editProfileUser);
router.get("/check-auth", protectRoute, checkAuth);

export default router;