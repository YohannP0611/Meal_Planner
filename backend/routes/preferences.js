const express = require("express");
const router = express.Router();
const db = require("../models/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

console.log('[PREFERENCES] Routes loaded');

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; // { id, email, displayName }
    next();
  });
}

// ============ RECIPE PREFERENCES ============

// GET user's recipe preferences
router.get("/recipes", verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT IDRecipes, Status FROM UserRecipePreferences WHERE IDAcc = ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows);
    }
  );
});

// POST/UPDATE recipe preference (like or pass)
router.post("/recipes/:id", verifyToken, (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.id;
  const { status } = req.body; // 'liked' or 'passed'

  if (!status || (status !== "liked" && status !== "passed")) {
    return res.status(400).json({ error: "Status must be 'liked' or 'passed'" });
  }

  // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both create and update
  db.query(
    `INSERT INTO UserRecipePreferences (IDAcc, IDRecipes, Status)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE Status = ?`,
    [userId, recipeId, status, status],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true, recipeId, status });
    }
  );
});

// DELETE recipe preference (remove like/pass)
router.delete("/recipes/:id", verifyToken, (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.id;

  db.query(
    "DELETE FROM UserRecipePreferences WHERE IDAcc = ? AND IDRecipes = ?",
    [userId, recipeId],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true, recipeId });
    }
  );
});

// ============ INGREDIENT PREFERENCES ============

// GET user's ingredient preferences
router.get("/ingredients", verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT IDIngredients, Status FROM UserIngredientPreferences WHERE IDAcc = ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows);
    }
  );
});

// POST/UPDATE ingredient preference (like or pass)
router.post("/ingredients/:id", verifyToken, (req, res) => {
  const userId = req.user.id;
  const ingredientId = req.params.id;
  const { status } = req.body; // 'liked' or 'passed'

  if (!status || (status !== "liked" && status !== "passed")) {
    return res.status(400).json({ error: "Status must be 'liked' or 'passed'" });
  }

  db.query(
    `INSERT INTO UserIngredientPreferences (IDAcc, IDIngredients, Status)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE Status = ?`,
    [userId, ingredientId, status, status],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true, ingredientId, status });
    }
  );
});

// DELETE ingredient preference (remove like/pass)
router.delete("/ingredients/:id", verifyToken, (req, res) => {
  const userId = req.user.id;
  const ingredientId = req.params.id;

  db.query(
    "DELETE FROM UserIngredientPreferences WHERE IDAcc = ? AND IDIngredients = ?",
    [userId, ingredientId],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true, ingredientId });
    }
  );
});

module.exports = { router, verifyToken };
