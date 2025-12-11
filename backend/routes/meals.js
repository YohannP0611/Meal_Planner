// routes/meals.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET /api/meals?accountId=1&dateMeal=2025-12-13
router.get("/", (req, res) => {
  const { accountId, dateMeal } = req.query;

  if (!accountId || !dateMeal) {
    return res.status(400).json({ message: "Missing accountId or dateMeal." });
  }

  // Use REAL column names: Connects.IDRecipes, Connects.IDAcc
  const sql = `
    SELECT
      c.MealType,
      r.IDRecipes,
      r.Title,
      r.Description
    FROM Connects c
    JOIN Recipes r ON r.IDRecipes = c.IDRecipes
    WHERE c.IDAcc = ?
      AND c.DateMeal = ?
    ORDER BY c.MealType, r.Title
  `;

  db.query(sql, [accountId, dateMeal], (err, rows) => {
    if (err) {
      console.error("Error fetching meals:", err);
      return res.status(500).json({
        message: "Database error fetching meals.",
        error: err.message,
      });
    }

    // rows: [{ MealType, IDRecipes, Title, Description, ... }, ...]
    res.json(rows);
  });
});

module.exports = router;
