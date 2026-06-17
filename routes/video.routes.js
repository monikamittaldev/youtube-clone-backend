import { getAllVideos, getVideoById } from "../controllers/video.controller.js";

export function videoRoutes(app) {
  app.get("/api/videos", getAllVideos);
  app.get("/api/videos/:id", getVideoById);
}
