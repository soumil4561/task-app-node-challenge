const authService = require('../services/auth.service');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

// Mock the User model methods
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe('authService: loginWithUserAndPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login the user successfully if credentials are correct', async () => {
    const username = 'validUser';
    const password = 'validPassword123';
    const user = { username, password, isPasswordMatch: jest.fn().mockResolvedValue(true) };

    // Mock findOne to return the user
    User.findOne.mockResolvedValue(user);

    // Call the function
    const result = await authService.loginWithUserAndPassword(username, password);

    // Check that the result matches the user object
    expect(result).toEqual(user);
    expect(User.findOne).toHaveBeenCalledWith({ username });
    expect(user.isPasswordMatch).toHaveBeenCalledWith(password);
  });

  it('should throw an error if user is not found', async () => {
    const username = 'nonExistentUser';
    const password = 'anyPassword123';

    // Mock findOne to return null (user not found)
    User.findOne.mockResdolvedValue(null);

    try {
      await authService.loginWithUserAndPassword(username, password);
    } catch (err) {
      // Debugging log here will help us understand if this is hit
      console.log("Error thrown:", err); // Check the error in the console output

      expect(err).toBeInstanceOf(ApiError);
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe('Incorrect Credentials');
    }
  });

  it('should throw an error if password does not match', async () => {
    const username = 'validUser';
    const password = 'wrongPassword123';
    const user = { username, password, isPasswordMatch: jest.fn().mockResolvedValue(false) };

    // Mock findOne to return the user
    User.findOne.mockResolvedValue(user);

    try {
      await authService.loginWithUserAndPassword(username, password);
    } catch (err) {
      // Debugging log here will help us understand if this is hit
      console.log("Error thrown:", err); // Check the error in the console output

      expect(err).toBeInstanceOf(ApiError);
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe('Incorrect Credentials');
    }
  });
});
