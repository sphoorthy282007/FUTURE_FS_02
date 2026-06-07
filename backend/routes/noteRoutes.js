const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addNote,
  getNotesByLead,
  deleteNote,
} = require("../controllers/noteController");

router.post("/", protect, addNote);

router.get("/:leadId", protect, getNotesByLead);

router.delete("/:id", protect, deleteNote);

module.exports = router;