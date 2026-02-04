import express from "express";
import { getPublicUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

// Public user profile
router.get("/:userId", getPublicUserProfile);

export default router;
