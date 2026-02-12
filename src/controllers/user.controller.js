import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";

// 1. GET PUBLIC PROFILE (Kept exactly the same)
export const getPublicUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .select("username avatar bio followers following createdAt") 
      .populate("followers", "username avatar")
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
        avatar: user.avatar,
        bio: user.bio,
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

// 2. UPDATE PROFILE (Updated to support File Uploads)
export const updateUserProfile = async (req, res) => {
  try {
    // 1. Get text data
    const { bio } = req.body;
    const userId = req.user.id;
    let avatarUrl;

    // 2. Check if a file was uploaded (via Multer)
    if (req.file) {
      // Upload to Cloudinary folder "avatars"
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        width: 500,     // Resize for better performance
        height: 500,
        crop: "fill",   // Ensure it's a square
        gravity: "face" // Center on the face automatically
      });
      
      avatarUrl = result.secure_url;
    }

    // 3. Prepare the update object
    const updateData = { 
      bio: bio 
    };

    // Only update avatar if a new image was actually uploaded
    if (avatarUrl) {
      updateData.avatar = avatarUrl;
    }

    // 4. Update the Database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true } // Return the updated document
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
