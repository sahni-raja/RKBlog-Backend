import express from "express";
import { toggleFollowUser } from "../controllers/follow.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Follow / Unfollow user
router.put("/:userId", protect, toggleFollowUser);

export default router;
