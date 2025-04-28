const pool = require('./pool');

module.exports = async function addGuest(fullName, email, phone) {
  const [existing] = await pool.query(
    'SELECT id FROM guests WHERE email = ?', [email]
  );
  if (existing.length) return existing[0].id;

  const sql = `INSERT INTO guests (full_name, email, phone) VALUES (?, ?, ?)`;
  const [res] = await pool.execute(sql, [fullName, email, phone]);
  return res.insertId;
};