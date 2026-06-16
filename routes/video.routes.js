import { getAllVideos } from "../controllers/video.controller.js";

export function videoRoutes(app){
    app.get('/api/videos', getAllVideos)
}