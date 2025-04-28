const pool = require('./pool');

module.exports = async function seedRooms() {
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM rooms');
  if (rows[0].cnt === 0) {
    await pool.query(`
      INSERT INTO rooms (number, type, price) VALUES
        ('101', 'single', 100.00),
        ('102', 'double', 150.00),
        ('201', 'suite', 250.00)
    `);
  }
};