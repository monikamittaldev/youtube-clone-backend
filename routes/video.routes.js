import {
  getAllVideos,
  getVideoById,
  uploadVideo,
} from "../controllers/video.controller.js";
import protect from "../middleware/authMiddleware.js";

export function videoRoutes(app) {
  app.get("/api/videos", getAllVideos);
  app.get("/api/videos/:id", getVideoById);
  app.post("/api/videos", protect, uploadVideo);
}
