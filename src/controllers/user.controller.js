// import { User } from "../models/user.model.js";
// import { Post } from "../models/post.model.js";

// export const getPublicUserProfile = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const user = await User.findById(userId)
//       .select("username followers following createdAt")
//       .populate("followers", "username")
//       .populate("following", "username");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const posts = await Post.find({ author: userId })
//       .select("title image createdAt")
//       .sort({ createdAt: -1 });

//     res.json({
//       user: {
//         _id: user._id,
//         username: user.username,
//         joinedAt: user.createdAt,
//         followers: user.followers,
//         following: user.following,
//         followersCount: user.followers.length,
//         followingCount: user.following.length
//       },
//       posts
//     });
//   } catch (error) {
//     console.error("PUBLIC PROFILE ERROR:", error.message);
//     res.status(500).json({ message: "Failed to load user profile" });
//   }
// };
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";

// 1. GET PUBLIC PROFILE (Updated to show Avatar/Bio)
export const getPublicUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      // Added avatar and bio to the selection
      .select("username avatar bio followers following createdAt") 
      .populate("followers", "username avatar") // Show follower avatars too!
      .populate("following", "username avatar");

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
        avatar: user.avatar, // <--- Sent to frontend
        bio: user.bio,       // <--- Sent to frontend
        joinedAt: user.createdAt,
        followers: user.followers,
        following: user.following,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
      posts,
    });
  } catch (error) {
    console.error("PUBLIC PROFILE ERROR:", error.message);
    res.status(500).json({ message: "Failed to load user profile" });
  }
};

// 2. UPDATE PROFILE (New Feature)
export const updateUserProfile = async (req, res) => {
  try {
    // We get the data from the frontend form
    const { avatar, bio } = req.body;
    const userId = req.user.id; // From the token

    // Find and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: avatar,
          bio: bio
        }
      },
      { new: true } // Return the updated document
    ).select("-password"); // Never send back the password

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
