import { Notification } from "../models/notification.model.js";

/* ================= GET MY NOTIFICATIONS ================= */
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    })
      .populate("sender", "username")
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ================= MARK AS READ ================= */
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

/* ================= MARK ALL AS READ ================= */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("MARK ALL READ ERROR:", error.message);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

/* ================= CLEAR ALL NOTIFICATIONS ================= */
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user.id
    });

    res.json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("CLEAR ALL NOTIFICATIONS ERROR:", error.message);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
};

/* ================= CLEAR READ NOTIFICATIONS ================= */
export const clearReadNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user.id,
      isRead: true
    });

    res.json({ message: "Read notifications cleared" });
  } catch (error) {
    console.error("CLEAR READ NOTIFICATIONS ERROR:", error.message);
    res.status(500).json({ message: "Failed to clear read notifications" });
  }
};
