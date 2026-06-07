const db = require("../config/db");

const getStats = (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS totalLeads,
      SUM(CASE WHEN status='New' THEN 1 ELSE 0 END) AS newLeads,
      SUM(CASE WHEN status='Converted' THEN 1 ELSE 0 END) AS convertedLeads
    FROM leads
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(result[0]);
  });
};

module.exports = {
  getStats,
};