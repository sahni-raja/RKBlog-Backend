import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { createNotification } from "../utils/notify.js";


/* ================= ADD COMMENT ================= */
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId
    });

    await createNotification({
  user: postExists.author,
  sender: req.user.id,
  type: "COMMENT",
  post: postId,
  comment: comment._id
});


    res.status(201).json(comment);
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error.message);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* ================= GET COMMENTS (NESTED) ================= */
export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username")
      .lean();

    // Build map
    const commentMap = {};
    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    const rootComments = [];

    comments.forEach(comment => {
      if (comment.parentComment) {
        commentMap[comment.parentComment]?.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    res.json(rootComments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};


/* ================= DELETE COMMENT ================= */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

/* ================= REPLY TO COMMENT ================= */
export const replyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId, commentId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
      parentComment: commentId
    });

    await createNotification({
  user: parentComment.author,
  sender: req.user.id,
  type: "REPLY",
  post: postId,
  comment: reply._id
});


    res.status(201).json(reply);
  } catch (error) {
    console.error("REPLY COMMENT ERROR:", error.message);
    res.status(500).json({ message: "Failed to reply to comment" });
  }
};
