import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.json({ message: "User Registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
