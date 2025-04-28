const pool = require('./pool');

module.exports = async function calculateRevenue(month, year) {
  const start = `${year}-${String(month).padStart(2,'0')}-01`;
  const next  = new Date(year, month, 1).toISOString().slice(0,10);
  const [rows] = await pool.query(
    `SELECT SUM(total_price) AS revenue
     FROM bookings
     WHERE start_date >= ? AND start_date < ?`,
    [start, next]
  );
  return rows[0].revenue || 0;
};