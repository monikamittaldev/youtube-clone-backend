import Video from "../models/video.model.js";

export const getAllVideos = async (req, res) => {
  try {
    const { search,category } = req.query;

    let videos;
    if (search) {
      videos = await Video.find({
        title: {
          $regex: search,
          $options: "i",
        },
      }).sort({ createdAt: -1 });
    } else if (category && category !== "All") {
      videos = await Video.find({
        category,
      }).sort({ createdAt: -1 });
    } else {
      videos = await Video.find().sort({ createdAt: -1 });
    }
    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
