const pool = require('./pool');

module.exports = async function findAvailableRooms(date) {
  const sql = `
    SELECT r.*
    FROM rooms r
    WHERE NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.room_id = r.id
        AND ? BETWEEN b.start_date AND b.end_date
    );
  `;
  const [rows] = await pool.query(sql, [date]);
  return rows;
};