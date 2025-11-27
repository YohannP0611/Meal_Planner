const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET all ingredients
router.get("/", (req, res) => {
  db.query("SELECT * FROM Ingredients", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// GET one ingredient by id
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM Ingredients WHERE IDIngredients = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  });
});

// CREATE ingredient
router.post("/", (req, res) => {
  // req.body should be an object with the columns of your table
  db.query("INSERT INTO Ingredients SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// UPDATE ingredient
router.put("/:id", (req, res) => {
  db.query(
    "UPDATE Ingredients SET ? WHERE IDIngredients = ?",
    [req.body, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// DELETE ingredient
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Ingredients WHERE IDIngredients = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(204).send();
  });
});

module.exports = router;