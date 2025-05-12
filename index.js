const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
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
      { name: 'Ivan',   age: 21, group: 'A-31', marks: [75, 90, 82] },
      { name: 'Oksana', age: 22, group: 'B-12', marks: [88, 76, 91] },
      { name: 'Petro',  age: 20, group: 'A-31', marks: [65, 70, 72] },
      { name: 'Maria',  age: 23, group: 'C-05', marks: [95, 98, 99] },
      { name: 'Andriy', age: 19, group: 'B-12', marks: [80, 85, 88] }
    ];
    await students.insertMany(docs);
    console.log('Inserted students.');

    console.log('\nAll students:');
    console.table(await students.find().toArray());

    await students.updateOne({ name: 'Ivan' }, { $set: { age: 22 } });
    console.log("\nAfter updating Ivan's age:");
    console.table([await students.findOne({ name: 'Ivan' })]);

    await students.deleteOne({ group: 'A-31' });
    console.log('\nAfter deleting one from A-31:');
    console.table(await students.find().toArray());

    const olderThan20 = await students.find({ age: { $gt: 20 } }).toArray();
    console.log('\nStudents older than 20:');
    console.table(olderThan20);

    const marksAbove85 = await students.find({ marks: { $elemMatch: { $gt: 85 } } }).toArray();
    console.log('\nStudents with marks above 85:');
    console.table(marksAbove85);

    const nameStartsA = await students.find({ name: { $regex: '^A' } }).toArray();
    console.log("\nStudents whose name starts with 'A':");
    console.table(nameStartsA);

    const sortedByAgeDesc = await students.find().sort({ age: -1 }).toArray();
    console.log('\nStudents sorted by age descending:');
    console.table(sortedByAgeDesc);

    const avgPerStudent = await students.aggregate([
      { $project: { _id: 0, name: 1, avgMark: { $avg: '$marks' } } }
    ]).toArray();
    console.log('\nAverage mark per student:');
    console.table(avgPerStudent);

    const countPerGroup = await students.aggregate([
      { $group: { _id: '$group', count: { $sum: 1 } } }
    ]).toArray();
    console.log('\nCount of students per group:');
    console.table(countPerGroup);

    const overallAvg = await students.aggregate([
      { $unwind: '$marks' },
      { $group: { _id: null, overallAvg: { $avg: '$marks' } } },
      { $project: { _id: 0, overallAvg: 1 } }
    ]).toArray();
    console.log('\nOverall average mark:');
    console.table(overallAvg);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
})();
