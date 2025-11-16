import { createClient } from "@deepgram/sdk";
import fs from "fs";
import Memory from "../models/Memory.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// -------------------------
// TEXT → TEXT
// -------------------------
export const textToText = async (req, res) => {
  try {
    const { userId, message, language } = req.body;

    let mem = await Memory.findOne({ userId });
    if (!mem) mem = await Memory.create({ userId, messages: [] });

    mem.messages.push({ role: "user", content: message });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are Mitra, an agriculture expert.
      Answer in ${language}.
      Keep it simple for farmers.
      Conversation:
      ${mem.messages.map(m => `${m.role}: ${m.content}`).join("\n")}
    `;

    const aiRes = await model.generateContent(prompt);
    const reply = aiRes.response.text();

    mem.messages.push({ role: "assistant", content: reply });
    await mem.save();

    res.json({ reply });

  } catch (err) {
    console.log("🔥 TEXT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// -------------------------
// VOICE → TEXT → CHATBOT TEXT
// -------------------------
export const voiceToTextChat = async (req, res) => {
  try {
    const { userId, language } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Audio file missing" });
    }

    // 1️⃣ Deepgram STT
    const audioBuffer = fs.readFileSync(req.file.path);

    const dgResponse = await deepgram.listen.prerecorded.transcribeFile(
    audioBuffer,
    {
        model: "nova-2",
        smart_format: true,
        language: language || "hi",
        mimetype: req.file.mimetype
    }
    );


    const userText =
      dgResponse.result?.channel?.alternatives?.[0]?.transcript ||
      "Unable to recognize voice" || " ";

    // 2️⃣ Gemini reply
    let mem = await Memory.findOne({ userId });
    if (!mem) mem = await Memory.create({ userId, messages: [] });

    mem.messages.push({ role: "user", content: userText });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are Mitra, an agriculture expert.
      Reply in ${language}.
      User said: ${userText}
      Chat history:
      ${mem.messages.map(m => `${m.role}: ${m.content}`).join("\n")}
    `;

    const aiRes = await model.generateContent(prompt);
    const reply = aiRes.response.text();

    mem.messages.push({ role: "assistant", content: reply });
    await mem.save();

    res.json({
      heardText: userText,
      replyText: reply
    });

  } catch (err) {
    console.log("🔥 VOICE CHAT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// -------------------------
// IMAGE DISEASE DETECTION
// -------------------------
export const diseaseDetect = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image missing" });
    }

    const imageBuffer = fs.readFileSync(req.file.path);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const aiRes = await model.generateContent([
      "Analyze this crop image and explain disease, reasons, solution in simple farmer language.",
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ]);

    res.json({ diagnosis: aiRes.response.text() });

  } catch (err) {
    console.log("🔥 DISEASE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
