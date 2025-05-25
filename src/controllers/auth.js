const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Password = require('../utils/password');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    if (User.findByEmail(email)) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await Password.hash(password);
    
    const newUser = User.create({
      email,
      password: hashedPassword
    });
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser.id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await Password.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getProfile = (req, res) => {
  res.json({ 
    message: 'Profile access granted', 
    user: {
      id: req.user.id,
      email: req.user.email
    } 
  });
};

module.exports = {
  register,
  login,
  getProfile
}; 