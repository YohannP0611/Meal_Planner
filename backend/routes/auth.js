const express = require("express");
const router = express.Router();
const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).json({ error: "Email, password, and display name are required" });
  }

  try {
    db.query("SELECT * FROM Account WHERE Email = ?", [email], async (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (rows.length > 0) return res.status(409).json({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO Account (Email, Password, DisplayName, Role) VALUES (?, ?, ?, 'user')",
        [email, hashedPassword, displayName],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Failed to create account" });

          const token = jwt.sign(
            { id: result.insertId, email, displayName, role: 'user' },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          res.status(201).json({
            message: "Account created successfully",
            token,
            user: { id: result.insertId, email, displayName, role: 'user' }
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.query("SELECT * FROM Account WHERE Email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length === 0) return res.status(401).json({ error: "Invalid email or password" });

    const user = rows[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.Password);
      if (!passwordMatch) return res.status(401).json({ error: "Invalid email or password" });

      const token = jwt.sign(
        { id: user.IDAcc, email: user.Email, displayName: user.DisplayName, role: user.Role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.IDAcc,
          email: user.Email,
          displayName: user.DisplayName,
          role: user.Role
        }
      });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
});

// GET current user info
router.get("/me", verifyToken, (req, res) => {
  db.query("SELECT IDAcc, Email, DisplayName, Role FROM Account WHERE IDAcc = ?", [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = rows[0];
    res.json({
      id: user.IDAcc,
      email: user.Email,
      displayName: user.DisplayName,
      role: user.Role
    });
  });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { router, verifyToken };
