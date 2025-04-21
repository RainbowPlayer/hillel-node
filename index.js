const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hotel_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initSchema() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS guests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE,
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      number VARCHAR(10) NOT NULL UNIQUE,
      type VARCHAR(50) NOT NULL,
      price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
    ) ENGINE=InnoDB;`
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guest_id INT NOT NULL,
      room_id INT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      CHECK (end_date >= start_date)
    ) ENGINE=InnoDB;`
  );
}

async function seedRooms() {
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM rooms');
  if (rows[0].cnt === 0) {
    console.log('Seeding sample rooms...');
    await pool.query(`
      INSERT INTO rooms (number, type, price) VALUES
        ('101', 'single', 100.00),
        ('102', 'double', 150.00),
        ('201', 'suite', 250.00)
    `);
  }
}

async function findAvailableRooms(date) {
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
}

async function addGuest(fullName, email, phone) {
  const [existing] = await pool.query(
    'SELECT id FROM guests WHERE email = ?', [email]
  );
  if (existing.length) {
    console.log(`Guest already exists with ID ${existing[0].id}`);
    return existing[0].id;
  }

  const sql = `
    INSERT INTO guests (full_name, email, phone)
    VALUES (?, ?, ?)
  `;
  const [res] = await pool.execute(sql, [fullName, email, phone]);
  return res.insertId;
}

async function createBooking(guestId, roomId, startDate, endDate) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [priceRow] = await conn.query(
      'SELECT price FROM rooms WHERE id = ?', [roomId]
    );
    if (!priceRow.length) throw new Error('Room not found');
    const price = priceRow[0].price;

    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
    const totalPrice = price * days;
    const insertSql = `
      INSERT INTO bookings (guest_id, room_id, start_date, end_date, total_price)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [res] = await conn.execute(insertSql, [guestId, roomId, startDate, endDate, totalPrice]);
    await conn.commit();
    return res.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function calculateRevenue(month, year) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = new Date(year, month, 1).toISOString().slice(0, 10);
  const sql = `
    SELECT SUM(total_price) AS revenue
    FROM bookings
    WHERE start_date >= ? AND start_date < ?
  `;
  const [rows] = await pool.query(sql, [start, nextMonth]);
  return rows[0].revenue || 0;
}

(async () => {
  try {
    await initSchema();
    await seedRooms();
    console.log('Schema initialized or already exists.');

    console.log('Available rooms on 2025-04-20:');
    console.table(await findAvailableRooms('2025-04-20'));

    console.log('\nAdding new guest...');
    const guestId = await addGuest('John Dou', 'example@example.com', '+380631234567');
    console.log('New guest ID:', guestId);

    console.log('\nCreating booking...');
    const bookingId = await createBooking(guestId, 1, '2025-04-10', '2025-04-12');
    console.log('New booking ID:', bookingId);

    console.log('\nCalculating revenue for April 2025...');
    const revenue = await calculateRevenue(4, 2025);
    console.log('Revenue:', revenue);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
})();
