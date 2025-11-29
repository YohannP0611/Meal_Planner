const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET all ingredients
router.get("/", (req, res) => {
  db.query("SELECT * FROM Ingredients", (err, rows) => {
    if (err) {
      console.error("Error fetching ingredients:", err);
      return res.status(500).json({ error: err });
    }
    res.json(rows);
  });
});

// GET one ingredient by id
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM Ingredients WHERE IDIngredients = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error("Error fetching ingredient by id:", err);
        return res.status(500).json({ error: err });
      }
      if (rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(rows[0]);
    }
  );
});

// CREATE ingredient
router.post("/", (req, res) => {
  // On ne met ici QUE les colonnes qui existent vraiment dans la table
  const ingredient = {
    Name: req.body.Name ?? "",
    Properties: req.body.Properties ?? null,
    Calories: req.body.Calories ?? null,
    Fat: req.body.Fat ?? null,
    Carbs: req.body.Carbs ?? null,
    Fibers: req.body.Fibers ?? null,
    Protein: req.body.Protein ?? null,
    Salt: req.body.Salt ?? null,
    Sugar: req.body.Sugar ?? null,
    IngredientPicture: req.body.IngredientPicture ?? null
  };

  db.query("INSERT INTO Ingredients SET ?", ingredient, (err, result) => {
    if (err) {
      console.error("Error inserting ingredient:", err);
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ id: result.insertId, ...ingredient });
  });
});

// UPDATE ingredient
router.put("/:id", (req, res) => {
  db.query(
    "UPDATE Ingredients SET ? WHERE IDIngredients = ?",
    [req.body, req.params.id],
    (err, result) => {
      if (err) {
        console.error("Error updating ingredient:", err);
        return res.status(500).json({ error: err });
      }
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// DELETE ingredient
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM Ingredients WHERE IDIngredients = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("Error deleting ingredient:", err);
        return res.status(500).json({ error: err });
      }
      res.status(204).send();
    }
  );
});

module.exports = router;
