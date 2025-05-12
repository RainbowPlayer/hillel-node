const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'shopdb';

async function connectDB() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log(`🗄️  MongoDB connected to ${uri}`);
  const db = client.db(dbName);
  return { client, db };
}

async function findProductsInCategory(db, categoryName) {
  const categories = db.collection('categories');
  const products = db.collection('products');
  const cat = await categories.findOne({ name: categoryName });
  if (!cat) throw new Error(`Category "${categoryName}" not found`);
  return products.find({ category: cat._id }).toArray();
}

async function calculateTotalProfit(db) {
  const orders = db.collection('orders');
  const result = await orders.aggregate([
    { $group: { _id: null, totalProfit: { $sum: '$totalAmount' } } }
  ]).toArray();
  return result[0]?.totalProfit || 0;
}

async function createOrder(db, client, items) {
  const orders = db.collection('orders');
  const products = db.collection('products');
  const session = client.startSession();
  try {
    session.startTransaction();
    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.priceAtOrder, 0);
    const orderDoc = {
      items: items.map(i => ({
        product: new ObjectId(i.product),
        quantity: i.quantity,
        priceAtOrder: i.priceAtOrder
      })),
      totalAmount,
      createdAt: new Date()
    };
    const result = await orders.insertOne(orderDoc, { session });
    for (const i of items) {
      await products.updateOne(
        { _id: new ObjectId(i.product) },
        { $inc: { stock: -i.quantity } },
        { session }
      );
    }
    await session.commitTransaction();
    return result.insertedId;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
}

async function getTop3Products(db) {
  const orders = db.collection('orders');
  const top = await orders.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
    { $sort: { totalSold: -1 } },
    { $limit: 3 },
    { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
    }},
    { $unwind: '$product' },
    { $project: {
        _id: 0,
        productId: '$product._id',
        name: '$product.name',
        totalSold: 1
    }}
  ]).toArray();
  return top;
}

async function main() {
  const { client, db } = await connectDB();
  try {
    const smartphones = await findProductsInCategory(db, 'Smartphones');
    console.log('Products in Smartphones:', smartphones);

    const profit = await calculateTotalProfit(db);
    console.log('Total profit:', profit);

    const top3 = await getTop3Products(db);
    console.log('Top 3 products:', top3);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();