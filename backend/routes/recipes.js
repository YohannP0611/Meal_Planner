const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET all Recipes
router.get("/", (req, res) => {
  console.log("Fetching all recipes...");
  db.query("SELECT * FROM Recipes", (err, rows) => {
    if (err) {
      console.error("Error fetching recipes:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Found ${rows.length} recipes`);
    res.json(rows);
  });
});

// GET one recipe
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM Recipes WHERE IDRecipes = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  });
});

// CREATE recipe
router.post("/", (req, res) => {
  console.log("Creating recipe with data:", req.body);
  const payload = sanitizeRecipePayload(req.body);
  console.log("Sanitized payload:", payload);
  
  db.query("INSERT INTO Recipes SET ?", payload, (err, result) => {
    if (err) {
      console.error("Error creating recipe:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, ...payload });
// UPDATE recipe
router.put("/:id", (req, res) => {
  db.query(
    "UPDATE Recipes SET ? WHERE IDRecipes = ?",
    [req.body, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});   res.json({ id: req.params.id, ...req.body });
    }
  );
});

// DELETE recipe
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Recipes WHERE IDRecipes = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(204).send();
  });
});

router.get("/:id/shopping-list", (req, res) => {
  const sql = `
    SELECT 
      n.IDIngredients,
      n.Quantity,
      n.Unit,
      i.Name,
      i.Calories,
      i.Protein,
      i.Carbs
    FROM Needs n
    JOIN Ingredients i ON i.IDIngredients = n.IDIngredients
    WHERE n.IDRecipes = ?
  `;

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});
module.exports = router;