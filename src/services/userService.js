const User = require('../models/user');
const db = require('../config/database');

async function getUserById(id) {
  try {
    return User.findById(id);
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

async function countUserOrders(userId) {
  try {
    const user = User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    const stmt = db.db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ?');
    const result = stmt.get(userId);
    return result.count;
  } catch (error) {
    throw error;
  }
}

module.exports = { 
  getUserById,
  countUserOrders
}; 