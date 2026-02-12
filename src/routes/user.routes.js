import express from "express";
import { 
  getPublicUserProfile, 
  updateUserProfile 
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; 

const router = express.Router();

router.get("/:userId", getPublicUserProfile);

router.put("/update", protect, upload.single("avatar"), updateUserProfile);

export default router;
