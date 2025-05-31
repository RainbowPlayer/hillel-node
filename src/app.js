const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const atlassianRoutes = require('./routes/atlassian');

const app = express();
app.use(express.json());

app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/atlassian', atlassianRoutes);

module.exports = app; 