import dns from 'node:dns';
// Bypass local DNS SRV block (remove in production)
dns.setServers(['1.1.1.1', '8.8.8.8']);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Channel from "./models/channel.model.js";
import Video from "./models/video.model.js";

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// 10 Verified, Live YouTube URLs
// ─────────────────────────────────────────────────────────────────────────────
const youtubeUrls = [
  "https://www.youtube.com/watch?v=SqcY0GlETPk", // React Tutorial – Programming with Mosh
  "https://www.youtube.com/watch?v=UWrSMWI8wbQ", // React Hooks Crash Course – Web Dev Simplified
  "https://www.youtube.com/watch?v=hdI2bqOjy3c", // JS Crash Course – Traversy Media
  "https://www.youtube.com/watch?v=aHrvi2zTlaU", // JS Closures Tutorial – ColorCode
  "https://www.youtube.com/watch?v=p0-_ZGxl7jQ", // Node.js JWT Auth REST API
  "https://www.youtube.com/watch?v=CnH3kAXSrmU", // Express Crash Course – Traversy Media
  "https://www.youtube.com/watch?v=ofme2o29ngU", // MongoDB Crash Course – Web Dev Simplified
  "https://www.youtube.com/watch?v=_uQrJ0TkZlc", // Python Tutorial – Programming with Mosh
  "https://www.youtube.com/watch?v=ft30zcMlFao", // Tailwind CSS Course – freeCodeCamp
  "https://www.youtube.com/watch?v=pg19Z8LL06w", // Docker Crash Course – TechWorld with Nana
];

// ─── Users Mock Data ─────────────────────────────────────────────────────────
const usersData = [
  { username: "monikadev", email: "monika@example.com", password: "password123", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Monika" },
  { username: "techguru", email: "techguru@example.com", password: "password123", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechGuru" },
  { username: "frontendpro", email: "frontend@example.com", password: "password123", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend" },
  { username: "jsdaily", email: "jsdaily@example.com", password: "password123", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JavaScript" },
  { username: "pythonhub", email: "python@example.com", password: "password123", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Python" },
  { username: "devopshub", email: "devops@example.com", password: "password123", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevOps" },
];

// ─── Channels Mock Data ──────────────────────────────────────────────────────
const channelsData = [
  {
    channelName: "Code With Monika",
    handle: "@codewithmonika",
    description: "React, MERN and Full Stack tutorials.",
    channelAvatar: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop"
  },
  {
    channelName: "Tech Guru",
    handle: "@techguru",
    description: "Programming and software engineering content.",
    channelAvatar: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&h=400&fit=crop"
  },
  {
    channelName: "Frontend Mastery",
    handle: "@frontendmastery",
    description: "Frontend development and CSS tutorials.",
    channelAvatar: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&h=400&fit=crop"
  }
];

// ─── Videos Base Metadata ─────────────────────────────────────────────────────
const baseVideosData = [
  { title: "React Tutorial for Beginners", category: "React", description: "Learn React from scratch in this comprehensive starter guide covering hooks, components, and state management rules." },
  { title: "React Hooks Crash Course", category: "React", description: "Deep dive into useState, useEffect, useContext, and custom hooks configurations with live coding patterns." },
  { title: "JavaScript Crash Course 2026", category: "JavaScript", description: "Master core JS foundations, loops, DOM manipulation, arrays, and ES6 features required for modern development." },
  { title: "Closures in JavaScript Explained", category: "JavaScript", description: "Understand closure logic, lexical scoping, memory allocation, and common interview questions on scopes." },
  { title: "Node.js JWT Authentication Tutorial", category: "Node.js", description: "Build secure REST APIs with Node, Express, cookies, and JSON Web Tokens securely mapped." },
  { title: "Express.js Crash Course", category: "Node.js", description: "Build scalable routing architectures, custom middlewares, and controllers using standard Express patterns." },
  { title: "MongoDB Aggregation Pipeline Complete Guide", category: "Database", description: "Learn lookup, match, group, and unwind stages to execute powerful data manipulation within MongoDB." },
  { title: "Python Full Course for Beginners", category: "Python", description: "Comprehensive path to Python layout syntax, loops, object-oriented principles, and modular programming." },
  { title: "Tailwind CSS Layout Mastery Course", category: "CSS", description: "Accelerate frontend styling with utility-first classes, grid systems, and custom configuration set ups." },
  { title: "Docker Container Crash Course", category: "DevOps", description: "Containerize your node, python, or frontend applications with custom Dockerfiles and docker-compose configurations." },
];

const sampleComments = [
  "This cleared up so many concepts for me! Thanks for the clean setup.",
  "Awesome tutorial, exactly what I needed for my project workflow.",
  "The explanation of hooks/logic here is way better than official docs.",
  "Can you do a follow up video with intermediate building next week?",
  "Bookmarking this instantly. Crystal clear sound and coding steps."
];

// ─── Seeding Logic Execution ─────────────────────────────────────────────────
const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully.");

    // Clean Existing Data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    console.log("Cleared old database records.");

    // 1. Seed Users
    const createdUsers = await User.insertMany(usersData);
    console.log(`Seeded ${createdUsers.length} Users.`);

    // 2. Seed Channels (Link to admin users)
    const channelsToInsert = channelsData.map((channel, idx) => ({
      ...channel,
      owner: createdUsers[idx % createdUsers.length]._id,
    }));
    const createdChannels = await Channel.insertMany(channelsToInsert);
    console.log(`Seeded ${createdChannels.length} Channels.`);

    // 3. Seed Videos with correct layout matching schema errors
    const videosToInsert = baseVideosData.map((video, idx) => {
      const assignedChannel = createdChannels[idx % createdChannels.length];
      
      // Look up who owns this channel to satisfy 'uploader' and 'uploaderName'
      const channelOwner = createdUsers.find(user => user._id.toString() === assignedChannel.owner.toString());

      // Map comments to use 'userId' instead of 'user'
      const comments = Array.from({ length: 3 }).map((_, cIdx) => {
        const randomUser = createdUsers[(idx + cIdx) % createdUsers.length];
        return {
          userId: randomUser._id,
          username: randomUser.username,
          avatar: randomUser.avatar,
          text: sampleComments[(idx + cIdx) % sampleComments.length],
          createdAt: new Date(Date.now() - cIdx * 3600000)
        };
      });

      // Map 'likes' to be an Array of User ObjectIds directly instead of a total number
      const likedByUsers = [
        createdUsers[(idx) % createdUsers.length]._id,
        createdUsers[(idx + 1) % createdUsers.length]._id
      ];

      return {
        ...video,
        videoUrl: youtubeUrls[idx],
        channelId: assignedChannel._id, // Fixed: schema requested channelId
        channelName: assignedChannel.channelName,
        channelAvatar: assignedChannel.channelAvatar,
        uploader: channelOwner._id,     // Fixed: schema requested uploader
        uploaderName: channelOwner.username, // Fixed: schema requested uploaderName
        views: Math.floor(Math.random() * 50000) + 1200,
        likes: likedByUsers,             // Fixed: schema requested array of User IDs
        comments: comments,
        createdAt: new Date(Date.now() - idx * 86400000)
      };
    });

    await Video.insertMany(videosToInsert);
    console.log("Successfully seeded 10 working videos with proper comments, likes, views, and structural avatars.");

    await mongoose.disconnect();
    console.log("Database connection closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("Error encountered seeding database:", error);
    process.exit(1);
  }
};

seed();