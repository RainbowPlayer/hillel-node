const express = require('express');
const authRoutes = require('./src/routes/auth');

const app = express();
app.use(express.json());

const PORT = 3000;

app.use('/', authRoutes);

app.listen(PORT);
