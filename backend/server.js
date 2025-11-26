import 'dotenv/config';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
// ROUTES
import authRoutes from "./routes/authRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import mitraRoutes from "./routes/mitraRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import topRoutes from "./routes/topRoutes.js"

// 1️⃣ CONNECT DB ONCE
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 2️⃣ ROUTES LOADED IN ORDER

app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/mitra", mitraRoutes);
app.use("/api/post", postRoutes);
app.use("/api/products" , productRoutes);
app.use("/api", topRoutes);

// 3️⃣ SOCKET SERVER
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("registerUser", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("sendVoiceMessage", (data) => {
    const receiverSocket = onlineUsers[data.receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveVoiceMessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});


const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log("🚀 Backend running on port 5000");
});
