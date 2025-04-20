const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const products = [
  { name: 'Ноутбук',   price: 25000, inStock: true  },
  { name: 'Мишка',     price:  500, inStock: false },
  { name: 'Клавіатура',price: 1500, inStock: true  },
  { name: 'Монітор',   price: 8000, inStock: false },
];

app.get('/products', (req, res) => {
  res.render('products', { products });
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));
