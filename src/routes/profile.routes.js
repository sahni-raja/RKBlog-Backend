import express from "express";
import { getMyProfile } from "../controllers/profile.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

export default router;
