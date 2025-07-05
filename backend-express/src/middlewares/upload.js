const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Ekstensi gambar yang diizinkan
const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // Mengarahkan file yang diupload ke folder 'uploads/'
  },

  // Menentukan nama file yang disimpan
  filename: (req, file, cb) => {
    const fileHash = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${fileHash}${ext}`);
  },
});

// Filter file multer
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Ekstensi gambar tidak valid"), false);
  }
};

// Konfigurasi upload multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Membatasi ukuran file maksimum hingga 5 MB
});

module.exports = upload;
