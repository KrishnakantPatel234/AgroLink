import express from "express";
import multer from "multer";
import { sendVoiceMessage, getChat } from "../controllers/messageController.js";

const router = express.Router();

// Use multer to handle audio uploads
const upload = multer({ dest: "uploads/audio/" });

// Send voice message
router.post("/send", upload.single("audio"), sendVoiceMessage);

// Get chat between two users
router.get("/:user1/:user2", getChat);

export default router;
