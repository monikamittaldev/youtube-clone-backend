import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Channel from "./models/channel.model.js";
import Video from "./models/video.model.js";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // ── CREATE USER ──────────────────────────────────────
    const user = await User.create({
      username: "Monika",
      email: "monika@example.com",
      password: "monika123",
    });
    console.log("👤 User created");

    // ── CREATE CHANNEL ───────────────────────────────────
    const channel = await Channel.create({
      channelName: "Monika Dev",
      handle: "@monikadev",
      description: "Web development tutorials and coding tips.",
      owner: user._id,
    });

    // Link channel to user
    await User.findByIdAndUpdate(user._id, { channel: channel._id });
    console.log("📺 Channel created");

    // ── CREATE VIDEOS ────────────────────────────────────
    const videos = await Video.insertMany([
      {
        title: "Learn React in 30 Minutes",
        description:
          "A quick tutorial to get started with React hooks and components.",
        videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        thumbnailUrl: "https://img.youtube.com/vi/Tn6-PIqc4UM/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "React",
        views: 15200,
      },
      {
        title: "Node.js Crash Course",
        description: "Learn Node.js and build a REST API from scratch.",
        videoUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
        thumbnailUrl: "https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "Node.js",
        views: 42000,
      },
      {
        title: "JavaScript Full Course for Beginners",
        description: "Complete JavaScript tutorial from zero to hero.",
        videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        thumbnailUrl: "https://img.youtube.com/vi/PkZNo7MFNFg/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "JavaScript",
        views: 98000,
      },
      {
        title: "CSS Flexbox and Grid Tutorial",
        description: "Master modern CSS layouts with Flexbox and Grid.",
        videoUrl: "https://www.youtube.com/watch?v=phWxA89Dy94",
        thumbnailUrl: "https://img.youtube.com/vi/phWxA89Dy94/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "CSS",
        views: 31500,
      },
      {
        title: "MongoDB Full Tutorial",
        description: "Complete MongoDB tutorial for beginners.",
        videoUrl: "https://www.youtube.com/watch?v=ExcRbA7fy_A",
        thumbnailUrl: "https://img.youtube.com/vi/ExcRbA7fy_A/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "Database",
        views: 27000,
      },
      {
        title: "Python for Beginners Full Course",
        description: "Learn Python programming from scratch.",
        videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        thumbnailUrl: "https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "Python",
        views: 54000,
      },
      {
        title: "Data Structures and Algorithms Full Course",
        description: "Complete DSA course for coding interviews.",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0",
        thumbnailUrl: "https://img.youtube.com/vi/8hly31xKli0/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "Data Structures",
        views: 63000,
      },
      {
        title: "Full Stack Web Development Roadmap 2024",
        description: "Complete roadmap to become a full stack developer.",
        videoUrl: "https://www.youtube.com/watch?v=ysEN5RaKOlA",
        thumbnailUrl: "https://img.youtube.com/vi/ysEN5RaKOlA/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "Web Development",
        views: 88000,
      },
      {
        title: "Docker and Kubernetes Full Course",
        description: "Learn DevOps with Docker and Kubernetes.",
        videoUrl: "https://www.youtube.com/watch?v=Wf2eSG3owoA",
        thumbnailUrl: "https://img.youtube.com/vi/Wf2eSG3owoA/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "DevOps",
        views: 19000,
      },
      {
        title: "Lo-fi Hip Hop Music for Coding",
        description: "Relaxing music to help you focus while coding.",
        videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        thumbnailUrl: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "Music",
        views: 120000,
      },
      {
        title: "GTA 6 Gameplay Walkthrough",
        description: "Full GTA 6 gameplay walkthrough and review.",
        videoUrl: "https://www.youtube.com/watch?v=QdBZExpgErs",
        thumbnailUrl: "https://img.youtube.com/vi/QdBZExpgErs/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "Gaming",
        views: 250000,
      },
      {
        title: "Top 10 Tech News This Week",
        description: "Latest technology news and updates.",
        videoUrl: "https://www.youtube.com/watch?v=1A4KPPCGxJs",
        thumbnailUrl: "https://img.youtube.com/vi/1A4KPPCGxJs/hqdefault.jpg",
        channelId: channel._id,
        uploader: user._id,
        uploaderName: user.username,
        category: "News",
        views: 45000,
      },
    ]);

    // Link videos to channel
    await Channel.findByIdAndUpdate(channel._id, {
      $push: { videos: { $each: videos.map((v) => v._id) } },
    });
    console.log(`🎬 ${videos.length} videos created`);

    console.log("\n✅ Seed complete!");
    console.log("─────────────────────────────");
    console.log("Test credentials:");
    console.log("  Email    : monika@example.com");
    console.log("  Password : monika123");
    console.log("─────────────────────────────");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedDB();
