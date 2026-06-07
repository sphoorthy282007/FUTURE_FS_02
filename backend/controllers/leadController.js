const db = require("../config/db");

// GET ALL LEADS
const getLeads = (req, res) => {
  const sql = "SELECT * FROM leads";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// ADD NEW LEAD
const addLead = (req, res) => {
  const { name, email, phone, source, status } = req.body;

  const sql = `
    INSERT INTO leads
    (name, email, phone, source, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, phone, source, status],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Lead Added Successfully",
        id: result.insertId,
      });
    }
  );
};

// UPDATE LEAD
const updateLead = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, source, status } = req.body;

  const sql = `
    UPDATE leads
    SET
      name = ?,
      email = ?,
      phone = ?,
      source = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, email, phone, source, status, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Lead Updated Successfully",
      });
    }
  );
};

// DELETE LEAD
const deleteLead = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM leads WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json({
      message: "Lead Deleted Successfully",
    });
  });
};

module.exports = {
  getLeads,
  addLead,
  updateLead,
  deleteLead,
};