// backend/routes/chatRoutes.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/private/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  }).sort({ timestamp: 1 });

  res.json(messages);
});

router.get("/unread/:userId", async (req, res) => {
  const count = await Message.countDocuments({
    receiver: req.params.userId,
    read: false,
  });
  res.json({ unreadCount: count });
});

export default router;
