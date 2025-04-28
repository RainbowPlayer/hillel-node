const initSchema = require('./db/initSchema');
const seedRooms = require('./db/seedRooms');
const findAvailableRooms = require('./db/findAvailableRooms');
const addGuest = require('./db/addGuest');
const createBooking = require('./db/createBooking');
const calculateRevenue = require('./db/calculateRevenue');
const pool = require('./db/pool');

(async () => {
  try {
    await initSchema();
    await seedRooms();

    console.log('Available rooms on 2025-04-20:');
    console.table(await findAvailableRooms('2025-04-20'));

    console.log('\nAdding new guest...');
    const guestId = await addGuest('John Doe', 'john@example.com', '+380631234567');
    console.log('Guest ID:', guestId);

    console.log('\nCreating booking...');
    const bookingId = await createBooking(guestId, 1, '2025-04-10', '2025-04-12');
    console.log('Booking ID:', bookingId);

    console.log('\nCalculating revenue for April 2025...');
    const revenue = await calculateRevenue(4, 2025);
    console.log('Revenue:', revenue);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
})();