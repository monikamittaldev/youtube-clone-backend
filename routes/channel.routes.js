/* =========================================================================
   channel.routes.js - Channel Routing Configuration
   ========================================================================= */
import {
  createChannel,
  getChannel,
  updateChannel,
} from "../controllers/channel.controller.js";
import protect from "../middleware/authMiddleware.js";

export function channelRoutes(app) {
  // Create channel (protected)
  app.post("/api/channel", protect, createChannel);

  // Get channel by id
  app.get("/api/channel/:id", getChannel);

  // Update channel (protected)
  app.put("/api/channel/:id", protect, updateChannel);
}