import { addComment } from "../controllers/comment.controller.js";
import protect from "../middleware/authMiddleware.js";

export function commentRoutes(app){
    app.post("/api/comment/:videoId",protect,addComment)
}