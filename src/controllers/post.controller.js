import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDelete.js";
import { createNotification } from "../utils/notify.js";


import fs from "fs";

export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "rkblog_posts"
      });

      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const post = await Post.create({
      title,
      content,
      tags,
      image: imageUrl,
      author: req.user.id
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("CREATE POST ERROR:", error.message);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const tag = req.query.tag || "";

    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts
    });
  } catch (error) {
    console.error("GET POSTS ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your posts" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not confirm" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (post.image) {
  await deleteFromCloudinary(post.image);
}

await post.deleteOne();

res.json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body || {};
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this post"
      });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;

    if (req.file) {
  if (post.image) {
    await deleteFromCloudinary(post.image);
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "rkblog_posts"
  });

  post.image = result.secure_url;
  fs.unlinkSync(req.file.path);
}


    const updatedPost = await post.save();
    res.json(updatedPost);

  } catch (error) {
    console.error("UPDATE POST ERROR:", error.message);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
     
      post.likes.push(userId);

      
      await createNotification({
        user: post.author,     
        sender: userId,       
        type: "LIKE",
        post: post._id
      });
    }

    await post.save();

    res.json({
      liked: !isLiked,
      totalLikes: post.likes.length
    });
  } catch (error) {
    console.error("LIKE ERROR:", error.message);
    res.status(500).json({ message: "Failed to like post" });
  }
};

export const toggleBookmarkPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    const isBookmarked = post.bookmarks.includes(userId);

    if (isBookmarked) {
      post.bookmarks.pull(userId); 
    } else {
      post.bookmarks.push(userId); 
    }

    await post.save();

    res.json({
      bookmarked: !isBookmarked,
      totalBookmarks: post.bookmarks.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to bookmark post" });
  }
};

