import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getTtsAudio(text) {
  try {
    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",     // FREE voice
      input: text
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;

  } catch (err) {
    console.log("🔥 OPENAI TTS ERROR:", err);
    throw new Error("TTS failed");
  }
}
