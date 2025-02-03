const { User } = require("../models");
const { loginWithUserAndPassword } = require("../services/auth.service");
const ApiError = require("../utils/ApiError");

jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe("Auth Service - loginWithUserAndPassword", () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      username: "testuser",
      isPasswordMatch: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return user when credentials are correct", async () => {
    mockUser.isPasswordMatch.mockResolvedValue(true);
    User.findOne.mockResolvedValue(mockUser);

    const result = await loginWithUserAndPassword("testuser", "password123");

    expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
    expect(mockUser.isPasswordMatch).toHaveBeenCalledWith("password123");
    expect(result).toEqual(mockUser);
  });

  it("should throw an error when user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(loginWithUserAndPassword("invaliduser", "password123"))
      .rejects.toThrow(ApiError);
    await expect(loginWithUserAndPassword("invaliduser", "password123"))
      .rejects.toThrow("Incorrect Credentials");

    expect(User.findOne).toHaveBeenCalledWith({ username: "invaliduser" });
  });

  it("should throw an error when password is incorrect", async () => {
    mockUser.isPasswordMatch.mockResolvedValue(false);
    User.findOne.mockResolvedValue(mockUser);

    await expect(loginWithUserAndPassword("testuser", "wrongpassword"))
      .rejects.toThrow(ApiError);
    await expect(loginWithUserAndPassword("testuser", "wrongpassword"))
      .rejects.toThrow("Incorrect Credentials");

    expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
    expect(mockUser.isPasswordMatch).toHaveBeenCalledWith("wrongpassword");
  });
});
