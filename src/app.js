const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const atlassianRoutes = require('./routes/atlassian');

const app = express();

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/atlassian', atlassianRoutes);

module.exports = app; 