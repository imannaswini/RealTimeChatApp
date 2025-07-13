// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Store userId -> Set of socket ids (to support multiple tabs)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("📱 New socket connected:", socket.id);

  // Register the socket with the user
  socket.on("register_user", (userId) => {
    if (!userId) return;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    socket.userId = userId;

    console.log(`✅ Registered: ${userId} → ${[...onlineUsers.get(userId)].join(", ")}`);
  });

  // Group Chat: Join Room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`🟢 ${socket.id} joined room ${room}`);
  });

  // Group Message
  socket.on("send_message", async ({ room, username, text }) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    io.to(room).emit("receive_message", { username, text, time });

    const message = new Message({ room, username, text });
    await message.save();
  });

  // Private Message
  socket.on("send_private_message", async ({ senderId, receiverId, content }) => {
    if (!senderId || !receiverId || !content) {
      console.warn("❌ Missing data in private message");
      return;
    }

    let message = new Message({ sender: senderId, receiver: receiverId, content });
    await message.save();
    message = await message.populate("sender", "username");

    const receiverSockets = onlineUsers.get(receiverId) || new Set();
    const senderSockets = onlineUsers.get(senderId) || new Set();

    for (const sockId of receiverSockets) {
      io.to(sockId).emit("receive_private_message", message);
    }

    for (const sockId of senderSockets) {
      io.to(sockId).emit("receive_private_message", message);
    }

    console.log(`📨 Private message from ${senderId} to ${receiverId}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    const userId = socket.userId;
    if (userId && onlineUsers.has(userId)) {
      const userSockets = onlineUsers.get(userId);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
