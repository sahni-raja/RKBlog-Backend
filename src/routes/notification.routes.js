import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  clearReadNotifications
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

router.delete("/clear-all", protect, clearAllNotifications);

router.delete("/clear-read", protect, clearReadNotifications);



export default router;
