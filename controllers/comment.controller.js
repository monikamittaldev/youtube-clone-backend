/* =========================================================================
   comment.controller.js - Comment Business Logic
   Handles adding, editing and deleting comments on videos
   ========================================================================= */
import Video from "../models/video.model.js";
import User from "../models/user.model.js";

/* =========================================================================
   ADD COMMENT - POST /api/comments/:videoId
   ========================================================================= */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    // Validate required fields
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Find video
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Fetch user to get username
    const user = await User.findById(req.user.id);

    // Add comment
    video.comments.push({
      userId: req.user.id,
      username: user.username,
      text: text.trim(),
    });

    await video.save();

    // Return the newly added comment
    const newComment = video.comments[video.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================================
   EDIT COMMENT - PUT /api/comments/:videoId/:commentId
   ========================================================================= */
export const editComment = async (req, res) => {
  try {
    const { text } = req.body;

    // Validate required fields
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Find video
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Find comment
    const comment = video.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this comment",
      });
    }

    // Update comment
    comment.text = text.trim();
    await video.save();

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================================
   DELETE COMMENT - DELETE /api/comments/:videoId/:commentId
   ========================================================================= */
export const deleteComment = async (req, res) => {
  try {
    // Find video
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Find comment
    const comment = video.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Delete comment
    comment.deleteOne();
    await video.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};