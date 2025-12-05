const express = require("express");
const router = express.Router();
const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Secret key for JWT (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// REGISTER - Create new account
router.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).json({ error: "Email, password, and display name are required" });
  }

  try {
    // Check if email already exists
    db.query("SELECT * FROM Account WHERE Email = ?", [email], async (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (rows.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new account
      db.query(
        "INSERT INTO Account (Email, Password, DisplayName) VALUES (?, ?, ?)",
        [email, hashedPassword, displayName],
        (err, result) => {
          if (err) {
            console.error("Error creating account:", err);
            return res.status(500).json({ error: "Failed to create account" });
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: result.insertId, email, displayName },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          res.status(201).json({
            message: "Account created successfully",
            token,
            user: {
              id: result.insertId,
              email,
              displayName
            }
          });
        }
      );
    });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN - Authenticate user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.query("SELECT * FROM Account WHERE Email = ?", [email], async (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    try {
      // Compare password with hash
      const passwordMatch = await bcrypt.compare(password, user.Password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.IDAcc, email: user.Email, displayName: user.DisplayName },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.IDAcc,
          email: user.Email,
          displayName: user.DisplayName
        }
      });
    } catch (err) {
      console.error("Error comparing passwords:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
});

// GET current user info (requires valid token)
router.get("/me", verifyToken, (req, res) => {
  db.query("SELECT IDAcc, Email, DisplayName FROM Account WHERE IDAcc = ?", [req.user.id], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    res.json({
      id: user.IDAcc,
      email: user.Email,
      displayName: user.DisplayName
    });
  });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Export both router and middleware
module.exports = { router, verifyToken };
