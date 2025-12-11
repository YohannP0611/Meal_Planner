const express = require("express");
const router = express.Router();
const db = require("../models/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

function extractUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
    });
  }
  next();
}

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
router.post("/", extractUser, (req, res) => {
  const data = { ...req.body };
  if (req.user) data.IDAcc = req.user.id;
  
  db.query("INSERT INTO Ingredients SET ?", data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, ...data });
  });
});

// UPDATE ingredient
router.put("/:id", extractUser, (req, res) => {
  db.query("SELECT IDAcc FROM Ingredients WHERE IDIngredients = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Ingredient not found" });
    
    const ingredient = rows[0];
    // Allow: owner, admin, or no owner (legacy)
    const isOwner = ingredient.IDAcc && req.user && req.user.id === ingredient.IDAcc;
    const isAdmin = req.user && req.user.role === 'admin';
    if (ingredient.IDAcc && !isOwner && !isAdmin) {
      return res.status(403).json({ error: "You don't have permission to edit this ingredient" });
    }
    
    db.query("UPDATE Ingredients SET ? WHERE IDIngredients = ?", [req.body, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, ...req.body });
    });
  });
});

// DELETE ingredient
router.delete("/:id", extractUser, (req, res) => {
  db.query("SELECT IDAcc FROM Ingredients WHERE IDIngredients = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Ingredient not found" });
    
    const ingredient = rows[0];
    // Allow: owner, admin, or no owner (legacy)
    const isOwner = ingredient.IDAcc && req.user && req.user.id === ingredient.IDAcc;
    const isAdmin = req.user && req.user.role === 'admin';
    if (ingredient.IDAcc && !isOwner && !isAdmin) {
      return res.status(403).json({ error: "You don't have permission to delete this ingredient" });
    }
    
    db.query("DELETE FROM Ingredients WHERE IDIngredients = ?", [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(204).send();
    });
  });
});

module.exports = router;