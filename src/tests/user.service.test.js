const userService = require('../services/user.service');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

// Mock the User model
jest.mock('../models', () => ({
  User: {
    create: jest.fn(),
  }
}));

describe('userService: createUser', () => {

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should create a user successfully', async () => {
    const newUser = { username: 'Soumil Singh 5', password: 'password123' };
    const createdUser = { ...newUser, _id: 'someGeneratedId' };

    User.create.mockResolvedValue(createdUser);

    const result = await userService.createUser(newUser);

    expect(result).toEqual(createdUser);
    expect(User.create).toHaveBeenCalledWith(newUser);
  });

  it('should throw a duplicate username error (11000) if user already exists', async () => {
    const newUser = { username: 'newuser', password: 'password123' };

    const duplicateError = new Error('E11000 duplicate key error collection');
    duplicateError.code = 11000;

    User.create.mockRejectedValue(duplicateError);

    try {
      await userService.createUser(newUser);
    } catch (err) {
      expect(err.code).toBe(11000);
      expect(err.message).toBe('E11000 duplicate key error collection');
    }
  });

});
