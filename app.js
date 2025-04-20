const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const users = [
  { name: 'Alice', age: 28, email: 'alice@example.com' },
  { name: 'Bob',   age: 35, email: 'bob@example.com'   },
  { name: 'Carol', age: 22, email: 'carol@example.com' },
];

app.get('/users', (req, res) => {
  res.render('users', { users });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
