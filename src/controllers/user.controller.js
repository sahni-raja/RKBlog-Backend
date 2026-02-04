import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";

/* ================= GET PUBLIC USER PROFILE ================= */
export const getPublicUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .select("username followers following createdAt")
      .populate("followers", "username")
      .populate("following", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: userId })
      .select("title image createdAt")
      .sort({ createdAt: -1 });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        joinedAt: user.createdAt,
        followers: user.followers,
        following: user.following,
        followersCount: user.followers.length,
        followingCount: user.following.length
      },
      posts
    });
  } catch (error) {
    console.error("PUBLIC PROFILE ERROR:", error.message);
    res.status(500).json({ message: "Failed to load user profile" });
  }
};
