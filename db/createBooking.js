const pool = require('./pool');

module.exports = async function createBooking(guestId, roomId, startDate, endDate) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [priceRow] = await conn.query(
      'SELECT price FROM rooms WHERE id = ?', [roomId]
    );
    if (!priceRow.length) throw new Error('Room not found');
    const days = (new Date(endDate) - new Date(startDate)) / (1000*60*60*24) + 1;
    const totalPrice = priceRow[0].price * days;
    const [res] = await conn.execute(
      `INSERT INTO bookings (guest_id, room_id, start_date, end_date, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [guestId, roomId, startDate, endDate, totalPrice]
    );
    await conn.commit();
    return res.insertId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};