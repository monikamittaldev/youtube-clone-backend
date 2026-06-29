import { createChannel, getChannel, updateChannel } from "../controllers/channel.controller.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

export function channelRoutes(app) {
  app.post("/api/channel", protect, upload.single("channelAvatar"), createChannel);
  app.get("/api/channel/:id", getChannel);
  app.put("/api/channel/:id", protect, upload.single("channelAvatar"), updateChannel);
} 