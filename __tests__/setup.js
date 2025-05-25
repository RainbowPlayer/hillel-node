const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const TEST_DB_PATH = path.join(__dirname, '../test-database.sqlite');

function clearDatabase() {
  if (fs.existsSync(TEST_DB_PATH)) {
    try {
      fs.unlinkSync(TEST_DB_PATH);
    } catch (error) {
      console.error('Error deleting test database:', error);
    }
  }
}

function initTestDatabase() {
  clearDatabase();
  
  try {
    const db = new Database(TEST_DB_PATH, { fileMustExist: false });
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    return db;
  } catch (error) {
    console.error('Error creating test database:', error);
    throw error;
  }
}

module.exports = {
  initTestDatabase,
  clearDatabase,
  TEST_DB_PATH
}; 