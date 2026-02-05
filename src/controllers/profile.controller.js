import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("username email likes bookmarks")
      .populate("likes", "title image")
      .populate("bookmarks", "title image");

    const myPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 });

    const myComments = await Comment.find({ author: userId })
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.json({
      user,
      posts: myPosts,
      comments: myComments
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error.message);
    res.status(500).json({ message: "Failed to load profile" });
  }
};
