import express from "express";
import {
  getMyNotifications,
  getUnreadCount,        
  markAsRead,
  markAllAsRead,
  deleteNotification,    
  clearAllNotifications,
  clearReadNotifications
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 1. Get Notifications & Count
router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadCount); 

// 2. Mark as Read
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

// 3. Delete Notifications
router.delete("/:id", protect, deleteNotification);   
router.delete("/", protect, clearAllNotifications);  
router.delete("/clear-read", protect, clearReadNotifications);

export default router;
