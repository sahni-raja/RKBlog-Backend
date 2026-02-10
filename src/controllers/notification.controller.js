// import { Notification } from "../models/notification.model.js";

// export const getMyNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({
//       user: req.user.id
//     })
//       .populate("sender", "username")
//       .populate("post", "title")
//       .sort({ createdAt: -1 });

//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch notifications" });
//   }
// };

// export const markAsRead = async (req, res) => {
//   try {
//     await Notification.findByIdAndUpdate(req.params.id, {
//       isRead: true
//     });

//     res.json({ message: "Notification marked as read" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update notification" });
//   }
// };

// export const markAllAsRead = async (req, res) => {
//   try {
//     await Notification.updateMany(
//       {
//         user: req.user.id,
//         isRead: false
//       },
//       {
//         $set: { isRead: true }
//       }
//     );

//     res.json({ message: "All notifications marked as read" });
//   } catch (error) {
//     console.error("MARK ALL READ ERROR:", error.message);
//     res.status(500).json({ message: "Failed to mark notifications as read" });
//   }
// };

// export const clearAllNotifications = async (req, res) => {
//   try {
//     await Notification.deleteMany({
//       user: req.user.id
//     });

//     res.json({ message: "All notifications cleared" });
//   } catch (error) {
//     console.error("CLEAR ALL NOTIFICATIONS ERROR:", error.message);
//     res.status(500).json({ message: "Failed to clear notifications" });
//   }
// };

// export const clearReadNotifications = async (req, res) => {
//   try {
//     await Notification.deleteMany({
//       user: req.user.id,
//       isRead: true
//     });

//     res.json({ message: "Read notifications cleared" });
//   } catch (error) {
//     console.error("CLEAR READ NOTIFICATIONS ERROR:", error.message);
//     res.status(500).json({ message: "Failed to clear read notifications" });
//   }
// };
import { Notification } from "../models/notification.model.js";

// 1. GET ALL NOTIFICATIONS
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    })
      .populate("sender", "username avatar") // Added avatar in case you need it later
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// 2. GET UNREAD COUNT (For the Navbar Badge)
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

// 3. MARK ONE AS READ
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

// 4. MARK ALL AS READ
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("MARK ALL READ ERROR:", error.message);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

// 5. DELETE SINGLE NOTIFICATION (New - Fixes the trash icon error)
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Security Check: Ensure the user deleting it actually owns it
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this notification" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification removed" });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error.message);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// 6. CLEAR ALL NOTIFICATIONS
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user.id,
    });

    res.json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("CLEAR ALL NOTIFICATIONS ERROR:", error.message);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
};

// 7. CLEAR ONLY READ NOTIFICATIONS (Optional but good to keep)
export const clearReadNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user.id,
      isRead: true,
    });

    res.json({ message: "Read notifications cleared" });
  } catch (error) {
    console.error("CLEAR READ NOTIFICATIONS ERROR:", error.message);
    res.status(500).json({ message: "Failed to clear read notifications" });
  }
};
