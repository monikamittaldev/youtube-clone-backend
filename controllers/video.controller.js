/* =========================================================================
   video.controller.js - Video Business Logic
   Handles video CRUD, likes and dislikes
   ========================================================================= */
import Video from "../models/video.model.js";
import Channel from "../models/channel.model.js";

/* =========================================================================
   GET ALL VIDEOS - GET /api/videos
   Supports ?search= and ?category= query params
   ========================================================================= */
export const getAllVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Filter by title search
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

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
      { new: true }
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
