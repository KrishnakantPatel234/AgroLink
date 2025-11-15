import 'dotenv/config';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";

//  ROUTES
import authRoutes from "./routes/authRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import mitraRoutes from "./routes/mitraRoutes.js";

connectDB()
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/mitra", mitraRoutes);


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Track online users
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

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

connectDB();
