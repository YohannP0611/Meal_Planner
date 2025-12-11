require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded files and existing frontend assets from /uploads
// this points first to backend/public/uploads, then to frontend/src/assets
const uploadsPath = path.resolve(__dirname, 'public', 'uploads');
const assetsPath = path.resolve(__dirname, '..', 'frontend', 'src', 'assets');
console.log('Serving /uploads from:', uploadsPath);
console.log('Serving /uploads fallback from:', assetsPath);
console.log('Path exists:', fs.existsSync(uploadsPath));
if (fs.existsSync(uploadsPath)) {
  try {
    console.log('Files in uploads:', fs.readdirSync(uploadsPath).slice(0, 10));
  } catch (err) {
    console.error('Error reading uploads directory:', err.message);
  }
}

app.use('/uploads', express.static(uploadsPath));
app.use('/uploads', express.static(assetsPath));

// routes
const { router: authRouter } = require("./routes/auth");
const { router: preferencesRouter } = require("./routes/preferences");
console.log('Registering routes...');
console.log('Auth router:', typeof authRouter);
console.log('Preferences router:', typeof preferencesRouter);
app.use("/api/auth", authRouter);
app.use("/api/preferences", preferencesRouter);
console.log('Preferences routes registered at /api/preferences');
app.use("/api/ingredients", require("./routes/ingredients"));
app.use("/api/recipes", require("./routes/recipes"));
app.use('/api/upload', require('./routes/upload'));
app.use("/api/shops", require("./routes/shops"));
app.use("/api/connects", require("./routes/connects"));
app.use("/api/meals", require("./routes/meals"));


app.listen(3000, () => console.log("Backend running on port 3000"));
