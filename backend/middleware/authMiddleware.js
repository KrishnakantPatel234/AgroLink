// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, error: "User not found" });
      }

      next();
    } catch (err) {
      console.error("Auth error:", err);
      return res
        .status(401)
        .json({ success: false, error: "Not authorized, token failed" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, error: "No token provided" });
  }
};

export const isFarmer = (req, res, next) => {
  if (req.user && req.user.role === "farmer") {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, error: "Access denied: farmer only" });
};

export const isBuyer = (req, res, next) => {
  if (req.user && req.user.role === "buyer") {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, error: "Access denied: buyer only" });
};
