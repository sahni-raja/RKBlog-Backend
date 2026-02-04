import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // const user = await User.findById(userId)
    //   .select("username email");

    const user = await User.findById(userId)
  .select("username email followers following")
  .populate("followers", "username email")
  .populate("following", "username email");


    const myPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 });

    const likedPosts = await Post.find({ likes: userId })
      .select("title image author")
      .populate("author", "username");

    const bookmarkedPosts = await Post.find({ bookmarks: userId })
      .select("title image author")
      .populate("author", "username");

    const myComments = await Comment.find({ author: userId })
      .populate("post", "title")
      .sort({ createdAt: -1 });

    // Stats
    const totalLikesReceived = myPosts.reduce(
      (sum, post) => sum + post.likes.length,
      0
    );

    const totalBookmarksReceived = myPosts.reduce(
      (sum, post) => sum + post.bookmarks.length,
      0
    );

    res.json({
      user,
      stats: {
        totalPosts: myPosts.length,
        totalFollowers: user.followers.length,
        totalFollowing: user.following.length,
        totalLikesReceived,
        totalBookmarksReceived,
        totalComments: myComments.length
      },
      myPosts,
      likedPosts,
      bookmarkedPosts,
      myComments
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error.message);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
