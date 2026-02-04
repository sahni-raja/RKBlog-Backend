import express from "express";
import {
  addComment,
  getPostComments,
  deleteComment
} from "../controllers/comment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

import { replyToComment } from "../controllers/comment.controller.js";


const router = express.Router();

// Add comment to post
router.post("/:postId", protect, addComment);

// Get comments of a post
router.get("/:postId", getPostComments);

// Delete comment
router.delete("/:commentId", protect, deleteComment);
// Reply to a comment
router.post("/:postId/:commentId/reply", protect, replyToComment);


export default router;
