/* =========================================================================
   auth.routes.js - Authentication Routing Configuration
   ========================================================================= */
import { register, login, getMe } from "../controller/auth.controller.js";
import protect from "../middleware/auth.js";

export function authRoutes(app) {
  // Register new user
  app.post("/api/auth/register", register);

  // Login user
  app.post("/api/auth/login", login);

  // Get current logged in user (protected)
  app.get("/api/auth/me", protect, getMe);
}