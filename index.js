const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_courses'
  });

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
  `);
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL
    );
  `);
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Enrollments (
      student_id INT,
      course_id INT,
      grade DECIMAL(5,2),
      PRIMARY KEY(student_id, course_id),
      FOREIGN KEY(student_id) REFERENCES Students(id) ON DELETE CASCADE,
      FOREIGN KEY(course_id)  REFERENCES Courses(id) ON DELETE CASCADE
    );
  `);

  await connection.execute(`DELETE FROM Enrollments;`);
  await connection.execute(`DELETE FROM Students;`);
  await connection.execute(`DELETE FROM Courses;`);

  await connection.execute(`ALTER TABLE Students AUTO_INCREMENT = 1;`);
  await connection.execute(`ALTER TABLE Courses AUTO_INCREMENT = 1;`);
  await connection.execute(`ALTER TABLE Enrollments AUTO_INCREMENT = 1;`);

  await connection.query(`
    INSERT INTO Students (name) VALUES 
      ('Оля'), 
      ('Іван'),
      ('Марія');
  `);
  await connection.query(`
    INSERT INTO Courses (title) VALUES 
      ('SQL Basics'),
      ('Node.js Fundamentals'),
      ('Advanced MySQL');
  `);
  await connection.query(`
    INSERT INTO Enrollments (student_id, course_id, grade) VALUES
      (1, 1, 90.00),
      (1, 2, 80.00),
      (2, 1, 70.00),
      (2, 3, 95.00),
      (3, 2, 88.00),
      (3, 3, 92.00);
  `);

  const [allAvg] = await connection.query(`
    SELECT s.name, ROUND(AVG(e.grade),2) AS avg_grade
    FROM Students s
    LEFT JOIN Enrollments e ON s.id = e.student_id
    GROUP BY s.id;
  `);
  console.log('\nВсі студенти із середнім балом:');
  console.table(allAvg);

  const [sqlStudents] = await connection.query(`
    SELECT s.name
    FROM Students s
    JOIN Enrollments e ON s.id = e.student_id
    JOIN Courses c ON e.course_id = c.id
    WHERE c.title = 'SQL Basics';
  `);
  console.log('\nСтуденти на курсі "SQL Basics":');
  console.table(sqlStudents);

  const [topStudent] = await connection.query(`
    SELECT s.name, ROUND(AVG(e.grade),2) AS avg_grade
    FROM Students s
    JOIN Enrollments e ON s.id = e.student_id
    GROUP BY s.id
    ORDER BY avg_grade DESC
    LIMIT 1;
  `);
  console.log('\nТоп-1 студент за середнім балом:');
  console.table(topStudent);

  const [counts] = await connection.query(`
    SELECT c.title, COUNT(e.student_id) AS student_count
    FROM Courses c
    LEFT JOIN Enrollments e ON c.id = e.course_id
    GROUP BY c.id;
  `);
  console.log('\nКількість студентів у кожному курсі:');
  console.table(counts);

  const [highAvgCourses] = await connection.query(`
    SELECT c.title, ROUND(AVG(e.grade),2) AS avg_grade
    FROM Courses c
    JOIN Enrollments e ON c.id = e.course_id
    GROUP BY c.id
    HAVING avg_grade > 85;
  `);
  console.log('\nКурси зі середнім балом > 85:');
  console.table(highAvgCourses);

  await connection.end();
}

main().catch(err => {
  console.error('Помилка:', err);
});
