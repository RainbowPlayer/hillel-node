const request = require('supertest');
const app = require('../../src/app');
const { initTestDatabase, clearDatabase, TEST_DB_PATH } = require('../setup');
const bcrypt = require('bcrypt');

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

describe('User Creation Integration Test', () => {
  let db;
  
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
    db.exec('DELETE FROM users');
  });
  
  it('should create a new user with status 201', async () => {
    const userData = {
      email: 'integration@test.com',
      password: 'securepassword'
    };
    
    const response = await request(app)
      .post('/register')
      .send(userData)
      .expect(201);
      
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('userId');
    
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(userData.email);
    
    expect(user).toBeTruthy();
    expect(user.email).toBe(userData.email);
    
    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    expect(isPasswordValid).toBe(true);
  });
  
  it('should return 409 when creating a user with an existing email', async () => {
    const userData = {
      email: 'duplicate@test.com',
      password: 'securepassword'
    };
    
    await request(app)
      .post('/register')
      .send(userData)
      .expect(201);
      
    const response = await request(app)
      .post('/register')
      .send(userData)
      .expect(409);
      
    expect(response.body).toHaveProperty('message', 'User already exists');
  });
}); 