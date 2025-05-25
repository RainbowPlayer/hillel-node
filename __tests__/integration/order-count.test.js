const request = require('supertest');
const app = require('../../src/app');
const { initTestDatabase, clearDatabase } = require('../setup');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../src/config/jwt');

jest.mock('../../src/config/database', () => {
  let testDb = null;
  
  return {
    get db() {
      return testDb;
    },
    set db(database) {
      testDb = database;
    }
  };
});

const dbModule = require('../../src/config/database');

describe('Order Count API Integration Test', () => {
  let db;
  let testUserId;
  let authToken;
  
  beforeAll(() => {
    db = initTestDatabase();
    dbModule.db = db;
  });
  
  afterAll(() => {
    if (db) {
      db.close();
    }
    clearDatabase();
  });
  
  beforeEach(() => {
    db.exec('DELETE FROM orders');
    db.exec('DELETE FROM users');
    
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const info = stmt.run('ordertest@example.com', 'hashedpassword');
    testUserId = info.lastInsertRowid;
    
    authToken = jwt.sign(
      { id: testUserId, email: 'ordertest@example.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });
  
  it('should return 0 when user has no orders', async () => {
    const response = await request(app)
      .get(`/users/${testUserId}/orders/count`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
      
    expect(response.body).toHaveProperty('count', 0);
  });
  
  it('should return correct order count when user has orders', async () => {
    const orderStmt = db.prepare('INSERT INTO orders (user_id) VALUES (?)');
    orderStmt.run(testUserId);
    orderStmt.run(testUserId);
    orderStmt.run(testUserId);
    
    const response = await request(app)
      .get(`/users/${testUserId}/orders/count`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
      
    expect(response.body).toHaveProperty('count', 3);
  });
  
  it('should return 404 when user does not exist', async () => {
    const nonExistentUserId = 999;
    
    const response = await request(app)
      .get(`/users/${nonExistentUserId}/orders/count`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
      
    expect(response.body).toHaveProperty('message', 'User not found');
  });
  
  it('should return 401 when not authenticated', async () => {
    const response = await request(app)
      .get(`/users/${testUserId}/orders/count`)
      .expect(401);
      
    expect(response.body).toHaveProperty('message', 'Authentication token required');
  });
}); 