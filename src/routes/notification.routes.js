import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  clearReadNotifications
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

// import {
//   getMyNotifications,
//   markAsRead,
//   markAllAsRead
// } from "../controllers/notification.controller.js";


const router = express.Router();

router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

// Clear all notifications
router.delete("/clear-all", protect, clearAllNotifications);

// Clear only read notifications
router.delete("/clear-read", protect, clearReadNotifications);



export default router;
