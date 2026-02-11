// import express from "express";
// import { getPublicUserProfile } from "../controllers/user.controller.js";

// const router = express.Router();

// // Public user profile
// router.get("/:userId", getPublicUserProfile);

// export default router;
import express from "express";
import { 
  getPublicUserProfile, 
  updateUserProfile 
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // Ensure this path is correct

const router = express.Router();

// Public: View anyone's profile
router.get("/:userId", getPublicUserProfile);

// Private: Update my own profile
router.put("/update", protect, updateUserProfile);

export default router;
