/* =========================================================================
   comment.routes.js - Comment Routing Configuration
   ========================================================================= */
import {
  getComments,
  addComment,
  editComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import protect from "../middleware/authMiddleware.js";

export function commentRoutes(app) {
 // Get comments (public)
  app.get("/api/comments/:videoId", getComments);
  
  // Add comment (protected)
  app.post("/api/comments/:videoId", protect, addComment);

  // Edit comment (protected)
  app.put("/api/comments/:videoId/:commentId", protect, editComment);

  // Delete comment (protected)
  app.delete("/api/comments/:videoId/:commentId", protect, deleteComment);
}