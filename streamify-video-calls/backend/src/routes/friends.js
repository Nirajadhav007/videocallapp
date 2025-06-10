// routes/friends.js
import express from "express";
import { StreamChat } from "stream-chat";
import User from "../models/User.js";
const router = express.Router();

router.get("/friends", async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const streamClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_SECRET);
    const channels = await streamClient.queryChannels({
      type: "messaging",
      members: { $in: [userId] },
    });

    const friendIds = new Set();
    for (const channel of channels) {
      const memberIds = channel.state.members.map((m) => m.user_id);
      memberIds.forEach((id) => {
        if (id !== userId) friendIds.add(id);
      });
    }

    const friends = await User.find({ _id: { $in: Array.from(friendIds) } });

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
