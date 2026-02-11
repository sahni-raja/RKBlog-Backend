import express from "express";
import { 
  getPublicUserProfile, 
  updateUserProfile 
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // <--- Import Multer

const router = express.Router();

// Public: View anyone's profile
router.get("/:userId", getPublicUserProfile);

// Private: Update profile (Now supports file upload)
// We use "avatar" as the field name for the file
router.put("/update", protect, upload.single("avatar"), updateUserProfile);

export default router;
