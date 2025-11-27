// backend/middleware/uploadPostMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// 🔹 Sirf images allow
const imageFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) return cb(null, true);
  cb("Error: Images only!");
};

// 🔹 Posts ke liye dedicated storage: uploads/posts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/posts";
    fs.mkdirSync(dir, { recursive: true }); // folder nahi ho to bana de
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadPostMiddleware = multer({
  storage,
  fileFilter: imageFileFilter,
});
