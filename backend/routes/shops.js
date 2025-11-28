const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET all shops
router.get("/", (req, res) => {
  db.query("SELECT * FROM Shop", (err, rows) => {
    if (err) {
      console.error("Error in GET /api/shops:", err);
      return res.status(500).json({ error: err });
    }
    res.json(rows);
  });
});

// (optionnel) GET one shop by id
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM Shop WHERE IDShop = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      if (rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(rows[0]);
    }
  );
});

module.exports = router;
