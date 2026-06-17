import {
    deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  uploadVideo,
} from "../controllers/video.controller.js";
import protect from "../middleware/authMiddleware.js";

export function videoRoutes(app) {
  app.get("/api/videos", getAllVideos);
  app.get("/api/videos/:id", getVideoById);
  app.post("/api/videos", protect, uploadVideo);
  app.put("/api/videos/:id", protect, updateVideo);
  app.delete("/api/videos/:id", protect, deleteVideo);
}
