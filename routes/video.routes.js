/* =========================================================================
   video.routes.js - Video Routing Configuration
   ========================================================================= */
import {
  getAllVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from "../controllers/video.controller.js";
import protect from "../middleware/authMiddleware.js";

export function videoRoutes(app) {
  // Get all videos (public) - supports ?search= and ?category=
  app.get("/api/videos", getAllVideos);

  // Get single video (public)
  app.get("/api/videos/:id", getVideoById);

  // Upload video (protected)
  app.post("/api/videos", protect, uploadVideo);

  // Update video (protected)
  app.put("/api/videos/:id", protect, updateVideo);

  // Delete video (protected)
  app.delete("/api/videos/:id", protect, deleteVideo);

  // Like video (protected)
  app.post("/api/videos/:id/like", protect, likeVideo);

  // Dislike video (protected)
  app.post("/api/videos/:id/dislike", protect, dislikeVideo);
}