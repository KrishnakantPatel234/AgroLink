import Message from "../models/Message.js";

export const sendVoiceMessage = async (req, res) => {
  try {
    const msg = new Message({
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      audioURL: req.file.path,
      duration: req.body.duration
    });

    await msg.save();

    res.json({ message: "Voice Message Sent", msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChat = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const msgs = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
