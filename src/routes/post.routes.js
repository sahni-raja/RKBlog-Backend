import express from "express";
import {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyPosts,
  deletePost,
  updatePost
} from "../controllers/post.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  toggleLikePost,
  toggleBookmarkPost
} from "../controllers/post.controller.js";


const router = express.Router();

router.get("/", getAllPosts);
router.get("/me", protect, getMyPosts);
router.get("/:id", getSinglePost);
router.post("/", protect, upload.single("image"), createPost);
router.delete("/:id", protect, deletePost);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updatePost
);

// Like / Unlike post
router.put("/:id/like", protect, toggleLikePost);

// Bookmark / Unbookmark post
router.put("/:id/bookmark", protect, toggleBookmarkPost);


export default router;
