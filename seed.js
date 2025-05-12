const { MongoClient, ObjectId } = require('mongodb');

const uri    = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'shopdb';

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const cats = [
    { _id: new ObjectId(), name: 'Smartphones', description: 'Смартфони та аксесуари' },
    { _id: new ObjectId(), name: 'Laptops',    description: 'Ноутбуки та комплектуючі' },
  ];
  await db.collection('categories').deleteMany({});
  await db.collection('categories').insertMany(cats);

  const prods = [
    { name: 'iPhone 14',       description: 'Apple iPhone 14', price: 900,  category: cats[0]._id, stock: 10 },
    { name: 'Samsung Galaxy S',description: 'Samsung S23',    price: 800,  category: cats[0]._id, stock: 15 },
    { name: 'Dell XPS 13',     description: 'Dell Ultrabook',  price: 1200, category: cats[1]._id, stock: 5  },
  ];
  await db.collection('products').deleteMany({});
  await db.collection('products').insertMany(prods);

  const orders = [
    {
      items: [
        { product: prods[0]._id, quantity: 2, priceAtOrder: prods[0].price },
        { product: prods[1]._id, quantity: 1, priceAtOrder: prods[1].price },
      ],
      totalAmount: 2*prods[0].price + 1*prods[1].price,
      createdAt: new Date(),
    }
  ];
  await db.collection('orders').deleteMany({});
  await db.collection('orders').insertMany(orders);

  console.log('✅ Seed completed');
  await client.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
