const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'school';

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const students = db.collection('students');

    await students.deleteMany({});

    const docs = [
      { name: 'Ivan', age: 21, group: 'A-31', marks: [75, 90, 82] },
      { name: 'Oksana', age: 22, group: 'B-12', marks: [88, 76, 91] },
      { name: 'Petro', age: 20, group: 'A-31', marks: [65, 70, 72] },
      { name: 'Maria', age: 23, group: 'C-05', marks: [95, 98, 99] },
      { name: 'Andriy', age: 19, group: 'B-12', marks: [80, 85, 88] }
    ];
    const insertResult = await students.insertMany(docs);
    console.log(`Inserted ${insertResult.insertedCount} students`);

    const allStudents = await students.find().toArray();
    console.log('All students:');
    console.table(allStudents);

    const updateResult = await students.updateOne(
      { name: 'Ivan' },
      { $set: { age: 22 } }
    );
    console.log(`Updated ${updateResult.modifiedCount} student(s)`);

    const deleteResult = await students.deleteMany({ group: 'A-31' });
    console.log(`Deleted ${deleteResult.deletedCount} student(s) from group A-31`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
})();
