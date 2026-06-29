/* =========================================================================
   channel.controller.js - Channel Business Logic
   Handles channel creation, fetching and updating
   ========================================================================= */
import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";

/* =========================================================================
   CREATE CHANNEL - POST /api/channel
   ========================================================================= */
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res
        .status(400)
        .json({ success: false, message: "Channel name is required" });
    }

    const existingChannel = await Channel.findOne({ owner: req.user.id });
    if (existingChannel) {
      return res
        .status(400)
        .json({ success: false, message: "You already have a channel" });
    }

    const handle =
      "@" +
      channelName.replace(/\s+/g, "").toLowerCase() +
      Math.random().toString(36).substring(2, 6);

    // Pick up uploaded file if present
    const channelAvatar = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const channel = await Channel.create({
      channelName,
      handle,
      description,
      channelAvatar,
      channelBanner,
      owner: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, { channel: channel._id });

    res
      .status(201)
      .json({
        success: true,
        message: "Channel created successfully",
        channel,
      });
  } catch (error) {
    console.error("CREATE CHANNEL ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
/* =========================================================================
   GET CHANNEL - GET /api/channel/:id
   ========================================================================= */
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar")
      .populate({
        path: "videos",
        options: {
          sort: { createdAt: -1 }, // Newest first
        },
      });
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    res.status(200).json({
      success: true,
      channel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================================
   UPDATE CHANNEL - PUT /api/channel/:id
   ========================================================================= */

export const updateChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }

    if (channel.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Use new upload if provided, otherwise keep existing
    const channelAvatar = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : channel.channelAvatar;

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      { channelName, description, channelAvatar, channelBanner },
      { new: true },
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Channel updated successfully",
        channel: updatedChannel,
      });
  } catch (error) {
    console.error("UPDATE CHANNEL ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
