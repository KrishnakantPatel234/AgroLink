import express from "express";
import multer from "multer";
import { textToText, voiceToTextChat, diseaseDetect } from "../controllers/mitraController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/text", textToText);
router.post("/voice", upload.single("audio"), voiceToTextChat);
router.post("/disease", upload.single("image"), diseaseDetect);

export default router;
