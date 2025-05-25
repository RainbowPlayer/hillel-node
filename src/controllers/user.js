const userService = require('../services/userService');

const getById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving user' });
  }
};

const countOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    const count = await userService.countUserOrders(userId);
    
    res.json({ count });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  getById,
  countOrders
}; 