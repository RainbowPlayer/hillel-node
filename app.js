const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();

nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express:   app,
  watch:     false
});

app.set('view engine', 'njk');

const users = [
  { name: 'Олексій', age: 30, email: 'oleksiy@example.com' },
  { name: 'Марія',   age: 24, email: 'maria@example.com'   },
  { name: 'Іван',    age: 28, email: 'ivan@example.com'    },
];

app.get('/', (req, res) => {
  res.render('users', { users });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
