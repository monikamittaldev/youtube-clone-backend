/* =========================================================================
   server.js - RESTful API for User Management
   Built with Node.js, Express & MongoDB
   ========================================================================= */

import dotenv from "dotenv";
// Initialize dotenv at the absolute top so variables are available everywhere
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes.js";

// Create an Express application instance
const app = express();

// Define the port using the environment variable, falling back to 3000 if not set
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON payloads (Essential for handling req.body)
app.use(express.json());
app.use(cors());

/* =========================================================================
   1. DATABASE CONNECTION (MongoDB via Mongoose)
   ========================================================================= */

// Connect to MongoDB using the URI from your .env file
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

// Event Listener: Fires once when the connection is successfully established
db.on("open", () => {
  console.log("🚀 Youtube Clone Database connection is successful!");
});

// Event Listener: Fires if the database connection encounters an error
db.on("error", (err) => {
  console.error("❌ Youtube Clone Database connection failed:", err);
});

authRoutes(app);

/* =========================================================================
   2. START THE SERVER
   ========================================================================= */

// Instruct the Express application to begin listening for client requests
app.listen(PORT, () => {
  console.log(`✅ Server is running smoothly at http://localhost:${PORT}`);
});
