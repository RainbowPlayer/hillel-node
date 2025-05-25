const { db } = require('../config/database');

const findByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
};

const findById = (id) => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
};

const create = (userData) => {
  const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
  const info = stmt.run(userData.email, userData.password);
  
  return {
    id: info.lastInsertRowid,
    email: userData.email
  };
};

module.exports = {
  findByEmail,
  findById,
  create
}; 