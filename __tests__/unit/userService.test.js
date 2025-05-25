const userService = require('../../src/services/userService');

jest.mock('../../src/models/user', () => ({
  findById: jest.fn()
}));

jest.mock('../../src/config/database', () => ({
  db: {
    prepare: jest.fn(() => ({
      get: jest.fn()
    }))
  }
}));

const User = require('../../src/models/user');
const db = require('../../src/config/database');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return a user with the given ID', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      User.findById.mockReturnValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith(1);
    });

    it('should return null for non-existent user', async () => {
      User.findById.mockReturnValue(null);

      const result = await userService.getUserById(999);
      expect(result).toBeNull();
      expect(User.findById).toHaveBeenCalledWith(999);
    });

    it('should throw an error when database fails', async () => {
      const dbError = new Error('Database error');
      User.findById.mockImplementation(() => {
        throw dbError;
      });

      await expect(userService.getUserById(1)).rejects.toThrow('Failed to get user: Database error');
      expect(User.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('countUserOrders', () => {
    it('should return the count of orders for a user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockOrderCount = { count: 5 };
      
      User.findById.mockReturnValue(mockUser);
      const mockGet = jest.fn().mockReturnValue(mockOrderCount);
      db.db.prepare.mockReturnValue({ get: mockGet });

      const result = await userService.countUserOrders(1);

      expect(result).toBe(5);
      expect(User.findById).toHaveBeenCalledWith(1);
      expect(db.db.prepare).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM orders WHERE user_id = ?');
      expect(mockGet).toHaveBeenCalledWith(1);
    });

    it('should throw a 404 error when user does not exist', async () => {
      User.findById.mockReturnValue(null);

      try {
        await userService.countUserOrders(999);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe('User not found');
        expect(error.statusCode).toBe(404);
      }
      
      expect(User.findById).toHaveBeenCalledWith(999);
    });
  });
}); 