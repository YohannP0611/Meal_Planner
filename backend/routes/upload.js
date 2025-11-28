const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// store uploads in backend/public/uploads
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // keep original name but prefix timestamp to avoid collisions
    const safeName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// single file upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // return a URL relative to server root
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

module.exports = router;
