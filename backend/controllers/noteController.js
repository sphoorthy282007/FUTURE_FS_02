const db = require("../config/db");

// ADD NOTE
const addNote = (req, res) => {
  const { lead_id, note_text } = req.body;

  const sql =
    "INSERT INTO notes (lead_id, note_text) VALUES (?, ?)";

  db.query(sql, [lead_id, note_text], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(201).json({
      message: "Note Added Successfully",
    });
  });
};

// GET NOTES FOR A LEAD
const getNotesByLead = (req, res) => {
  const { leadId } = req.params;

  const sql =
    "SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC";

  db.query(sql, [leadId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results);
  });
};

// DELETE NOTE
const deleteNote = (req, res) => {
  const { id } = req.params;

  const sql =
    "DELETE FROM notes WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json({
      message: "Note Deleted Successfully",
    });
  });
};

module.exports = {
  addNote,
  getNotesByLead,
  deleteNote,
};