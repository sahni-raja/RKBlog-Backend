import { User } from "../models/user.model.js";
import { createNotification } from "../utils/notify.js";

export const toggleFollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId; 
    const currentUserId = req.user.id;      

    if (targetUserId === currentUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
     
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await createNotification({
        user: targetUserId,
        sender: currentUserId,
        type: "FOLLOW"
      });
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      following: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    console.error("FOLLOW ERROR:", error.message);
    res.status(500).json({ message: "Failed to follow user" });
  }
};
