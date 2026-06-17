/* =========================================================================
   video.controller.js - Video Business Logic
   Handles video CRUD, likes and dislikes
   ========================================================================= */
import Video from "../models/video.model.js";
import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";
/* =========================================================================
   GET ALL VIDEOS - GET /api/videos
   Supports ?search= and ?category= query params
   ========================================================================= */
export const getAllVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      // If search text exists — filter by title only
      query.title = { $regex: search, $options: "i" };
    } else if (category && category !== "All") {
      // If no search — filter by category only
      query.category = category;
    }
    // If neither — return all videos

    const videos = await Video.find(query)
      .populate("channelId", "channelName channelAvatar handle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
/* =========================================================================
   GET SINGLE VIDEO - GET /api/videos/:id
   Also increments view count
   ========================================================================= */
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("channelId", "channelName channelAvatar handle");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================================
   UPLOAD VIDEO - POST /api/videos
   ========================================================================= */
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, channelId, category } =
      req.body;

    // Validate required fields
    if (!title || !videoUrl || !channelId) {
      return res.status(400).json({
        success: false,
        message: "Title, video URL and channel are required",
      });
    }

    // Verify channel ownership
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to upload to this channel",
      });
    }

    // fetch user to get username
    const user = await User.findById(req.user.id);

    // Create video
    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      channelId,
      uploader: req.user.id,
      uploaderName: user.username,
      category: category || "All",
    });

    // Add video to channel
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videos: video._id },
    });

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    const msg = "server error: " + error;
    res.status(500).json({
      success: false,
      message: msg,
    });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, category } = req.body;

    // Find Video
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    //Check Ownership
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this video",
      });
    }
    //Update Video
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { title, description, thumbnailUrl, videoUrl, category },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    const msg = "server error: " + error;
    res.status(500).json({
      success: false,
      message: msg,
    });
  }
};

/* =========================================================================
   DELETE VIDEO - DELETE /api/videos/:id
   ========================================================================= */
export const deleteVideo = async (req, res) => {
  try {
    // Find video
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this video",
      });
    }

    // Remove video from channel
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id },
    });

    // Delete video
    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error,
    });
  }
};

/* =========================================================================
   LIKE VIDEO - POST /api/videos/:id/like
   ========================================================================= */
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const userId = req.user.id;
    const alreadyLiked = video.likes.includes(userId);

    if (alreadyLiked) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.dislikes.pull(userId);
    }
    await video.save();
    res.status(200).json({
      success: true,
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error,
    });
  }
};


/* =========================================================================
   DISLIKE VIDEO - POST /api/videos/:id/dislike
   ========================================================================= */
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const userId = req.user.id;
    const alreadyDisliked = video.dislikes.includes(userId);

    if (alreadyDisliked) {
      // Remove dislike
      video.dislikes.pull(userId);
    } else {
      // Add dislike and remove like if exists
      video.dislikes.push(userId);
      video.likes.pull(userId);
    }

    await video.save();

    res.status(200).json({
      success: true,
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};