// import express from "express";
// import {
//   getMyNotifications,
//   markAsRead,
//   markAllAsRead,
//   clearAllNotifications,
//   clearReadNotifications
// } from "../controllers/notification.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";


// const router = express.Router();

// router.get("/", protect, getMyNotifications);
// router.put("/:id/read", protect, markAsRead);
// router.put("/read-all", protect, markAllAsRead);

// router.delete("/clear-all", protect, clearAllNotifications);

// router.delete("/clear-read", protect, clearReadNotifications);



// export default router;
import express from "express";
import {
  getMyNotifications,
  getUnreadCount,        // <--- NEW: For the navbar badge
  markAsRead,
  markAllAsRead,
  deleteNotification,    // <--- NEW: For the trash icon
  clearAllNotifications,
  clearReadNotifications
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 1. Get Notifications & Count
router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadCount); // <--- Fixes the Badge logic

// 2. Mark as Read
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

// 3. Delete Notifications
router.delete("/:id", protect, deleteNotification);   // <--- Fixes the Trash Icon
router.delete("/", protect, clearAllNotifications);   // <--- Fixes "Clear All" (Matches frontend path)
router.delete("/clear-read", protect, clearReadNotifications);

export default router;
