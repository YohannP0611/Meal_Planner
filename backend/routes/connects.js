// routes/connects.js
const express = require("express");
const router = express.Router();
// Use the same DB client as other routes (ingredients, recipes, shops, etc.)
const db = require("../models/db");

// POST /api/connects
// Body: { AccountIDAcc, RecipesIDRecipes, DateMeal, MealType }
router.post("/", (req, res) => {
  const { AccountIDAcc, RecipesIDRecipes, DateMeal, MealType } = req.body;

  // basic validation
  if (!AccountIDAcc || !RecipesIDRecipes || !DateMeal || !MealType) {
    return res.status(400).json({ message: "Missing field in body." });
  }

  // Use REAL column names from your DB: Connects(IDRecipes, IDAcc, DateMeal, MealType)
  const insertSql = `
    INSERT INTO Connects (IDRecipes, IDAcc, DateMeal, MealType)
    VALUES (?, ?, ?, ?)
  `;

  // Order of values must match column order:
  // IDRecipes, IDAcc, DateMeal, MealType
  db.query(
    insertSql,
    [RecipesIDRecipes, AccountIDAcc, DateMeal, MealType],
    (err, result) => {
      if (err) {
        console.error("Error inserting into Connects:", err);
        return res.status(500).json({
          message: "Database error inserting into Connects.",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Meal added to planning.",
        id: result.insertId, // not really used, but ok
      });
    }
  );
});

// DELETE /api/connects
// Body: { AccountIDAcc, RecipesIDRecipes, DateMeal, MealType }
router.delete("/", (req, res) => {
  const { AccountIDAcc, RecipesIDRecipes, DateMeal, MealType } = req.body;

  // basic validation
  if (!AccountIDAcc || !RecipesIDRecipes || !DateMeal || !MealType) {
    return res.status(400).json({ message: "Missing field in body." });
  }

  // Delete exactly one row for this user/recipe/date/mealType
  const deleteSql = `
    DELETE FROM Connects
    WHERE IDRecipes = ?
      AND IDAcc = ?
      AND DateMeal = ?
      AND MealType = ?
  `;

  db.query(
    deleteSql,
    [RecipesIDRecipes, AccountIDAcc, DateMeal, MealType],
    (err, result) => {
      if (err) {
        console.error("Error deleting from Connects:", err);
        return res.status(500).json({
          message: "Database error deleting from Connects.",
          error: err.message,
        });
      }

      res.json({
        message: "Meal removed from planning.",
        affectedRows: result.affectedRows,
      });
    }
  );
});

module.exports = router;
