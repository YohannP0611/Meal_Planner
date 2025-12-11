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
router.post("/", extractUser, (req, res) => {
  console.log("Creating recipe with data:", req.body);
  
  const data = { ...req.body };
  if (req.user) data.IDAcc = req.user.id;
  
  db.query("INSERT INTO Recipes SET ?", data, (err, result) => {
    if (err) {
      console.error("Error creating recipe:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, ...data });
  });
});

// UPDATE recipe
router.put("/:id", extractUser, (req, res) => {
  db.query("SELECT IDAcc FROM Recipes WHERE IDRecipes = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Recipe not found" });
    
    const recipe = rows[0];
    // Allow: owner, admin, or no owner (legacy)
    const isOwner = recipe.IDAcc && req.user && req.user.id === recipe.IDAcc;
    const isAdmin = req.user && req.user.role === 'admin';
    if (recipe.IDAcc && !isOwner && !isAdmin) {
      return res.status(403).json({ error: "You don't have permission to edit this recipe" });
    }
    
    db.query("UPDATE Recipes SET ? WHERE IDRecipes = ?", [req.body, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, ...req.body });
    });
  });
});

// DELETE recipe
router.delete("/:id", extractUser, (req, res) => {
  db.query("SELECT IDAcc FROM Recipes WHERE IDRecipes = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Recipe not found" });
    
    const recipe = rows[0];
    // Allow: owner, admin, or no owner (legacy)
    const isOwner = recipe.IDAcc && req.user && req.user.id === recipe.IDAcc;
    const isAdmin = req.user && req.user.role === 'admin';
    if (recipe.IDAcc && !isOwner && !isAdmin) {
      return res.status(403).json({ error: "You don't have permission to delete this recipe" });
    }
    
    db.query("DELETE FROM Recipes WHERE IDRecipes = ?", [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(204).send();
    });
  });
});

module.exports = router;

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