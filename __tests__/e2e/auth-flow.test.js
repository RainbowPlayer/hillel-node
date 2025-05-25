const request = require('supertest');
const app = require('../../src/app');
const { initTestDatabase, clearDatabase } = require('../setup');

// Mock the database configuration to use the test database
jest.mock('../../src/config/database', () => {
  // This will be initialized in beforeAll
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

// Mock JWT secret to be consistent across tests
jest.mock('../../src/config/jwt', () => ({
  JWT_SECRET: 'test-secret-key',
  JWT_EXPIRES_IN: '1h'
}));

describe('Authentication E2E Flow', () => {
  let db;
  let authToken;
  const testUser = {
    email: 'e2e@test.com',
    password: 'securepassword'
  };
  
  beforeAll(() => {
    // Initialize test database and assign it to the mocked module
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
    // Clean users table before each test
    db.exec('DELETE FROM users');
  });
  
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send(testUser)
      .expect(201);
      
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('userId');
  });
  
  it('should login with correct credentials and get JWT token', async () => {
    const response = await request(app)
      .post('/login')
      .send(testUser)
      .expect(200);
      
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
    
    // Save token for next tests
    authToken = response.body.token;
  });
  
  it('should access protected profile route with valid token', async () => {
    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
      
    expect(response.body).toHaveProperty('message', 'Profile access granted');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', testUser.email);
  });
  
  it('should return 401 when accessing protected route without token', async () => {
    const response = await request(app)
      .get('/profile')
      .expect(401);
      
    expect(response.body).toHaveProperty('message', 'Authentication token required');
  });
}); 