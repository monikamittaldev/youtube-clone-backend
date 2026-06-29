import { register, login, getMe } from "../controllers/auth.controller.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

export function authRoutes(app) {
  app.post("/api/auth/register", upload.single("avatar"), register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", protect, getMe);
}