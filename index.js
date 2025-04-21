const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'school';

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const students = db.collection('students');

    await students.deleteMany({});

    const docs = [
      { name: 'Alex',   age: 24, group: 'A-31', marks: [88, 92, 81] },
      { name: 'Anna',   age: 22, group: 'B-12', marks: [75, 65, 70] },
      { name: 'Bohdan', age: 19, group: 'A-31', marks: [80, 60, 55] },
      { name: 'Alina',  age: 23, group: 'C-05', marks: [95, 90, 85] },
      { name: 'Dmytro', age: 20, group: 'B-12', marks: [70, 72, 74] }
    ];
    await students.insertMany(docs);

    console.log('\nAll students:');
    console.table(await students.find().toArray());

    console.log('\nStudents older than 20:');
    console.table(await students.find({ age: { $gt: 20 } }).toArray());

    console.log('\nStudents with marks above 85:');
    console.table(await students.find({ marks: { $elemMatch: { $gt: 85 } } }).toArray());

    console.log("\nStudents whose name starts with 'A':");
    console.table(await students.find({ name: { $regex: '^A' } }).toArray());

    console.log('\nStudents sorted by age descending:');
    console.table(await students.find().sort({ age: -1 }).toArray());

    console.log('\nAverage mark per student:');
    console.table(await students.aggregate([
      { $project: { name: 1, avgMark: { $avg: '$marks' } } }
    ]).toArray());

    console.log('\nStudent count per group:');
    console.table(await students.aggregate([
      { $group: { _id: '$group', count: { $sum: 1 } } }
    ]).toArray());

    const overall = await students.aggregate([
      { $unwind: '$marks' },
      { $group: { _id: null, overallAvg: { $avg: '$marks' } } }
    ]).toArray();
    console.log('\nOverall average mark:', overall[0].overallAvg);

  } finally {
    await client.close();
  }
})();
