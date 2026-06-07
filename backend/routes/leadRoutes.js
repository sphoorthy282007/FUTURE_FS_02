const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getLeads,
  addLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

router.get("/", protect, getLeads);

router.post("/", protect, addLead);

router.put("/:id", protect, updateLead);

router.delete("/:id", protect, deleteLead);

module.exports = router;