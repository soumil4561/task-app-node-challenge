const { userService, tokenService, authService } = require("../services");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { sendSuccess, sendError } = require("../utils/response");

jest.mock("../services", () => ({
  userService: {
    createUser: jest.fn(),
  },
  tokenService: {
    generateAuthTokens: jest.fn(),
  },
  authService: {
    loginWithUserAndPassword: jest.fn(),
  },
}));

jest.mock("../utils/response", () => ({
  sendSuccess: jest.fn(),
  sendError: jest.fn(),
}));

describe("Auth Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a user and return auth tokens", async () => {
      const mockUser = { _id: "123" };
      const mockTokens = { accessToken: "access123", refreshToken: "refresh123" };

      mockReq.body = { username: "testuser", password: "password123" };
      userService.createUser.mockResolvedValue(mockUser);
      tokenService.generateAuthTokens.mockResolvedValue(mockTokens);

      await registerUser(mockReq, mockRes);

      expect(userService.createUser).toHaveBeenCalledWith(mockReq.body);
      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(mockUser._id);
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, mockTokens, "User registered successfully!", 201);
    });

    it("should handle duplicate user error", async () => {
      const mockError = new Error("Duplicate Key");
      mockError.code = 11000;

      mockReq.body = { username: "existinguser", password: "password123" };
      userService.createUser.mockRejectedValue(mockError);

      await registerUser(mockReq, mockRes);

      expect(userService.createUser).toHaveBeenCalledWith(mockReq.body);
      expect(sendError).toHaveBeenCalledWith(
        mockRes,
        "DUPLICATE_USER",
        "Username already exists.",
        mockError.message,
        400
      );
    });

    it("should handle server errors", async () => {
      const mockError = new Error("Database error");

      mockReq.body = { username: "testuser", password: "password123" };
      userService.createUser.mockRejectedValue(mockError);

      await registerUser(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "SERVER_ERROR", "Internal Server Error", null, 500);
    });
  });

  describe("loginUser", () => {
    it("should log in a user and return auth tokens", async () => {
      const mockUser = { _id: "123" };
      const mockTokens = { accessToken: "access123", refreshToken: "refresh123" };

      mockReq.body = { username: "testuser", password: "password123" };
      authService.loginWithUserAndPassword.mockResolvedValue(mockUser);
      tokenService.generateAuthTokens.mockResolvedValue(mockTokens);

      await loginUser(mockReq, mockRes);

      expect(authService.loginWithUserAndPassword).toHaveBeenCalledWith("testuser", "password123");
      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(mockUser._id);
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, mockTokens, "Login successful!", 200);
    });

    it("should handle invalid credentials", async () => {
      const mockError = new Error("Incorrect Credentials");
      mockError.code = 400;

      mockReq.body = { username: "testuser", password: "wrongpassword" };
      authService.loginWithUserAndPassword.mockRejectedValue(mockError);

      await loginUser(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(
        mockRes,
        "INVALID_CREDENTIALS",
        "Incorrect username or password. Please try again.",
        mockError.message,
        400
      );
    });

    it("should handle server errors", async () => {
      const mockError = new Error("Database error");

      mockReq.body = { username: "testuser", password: "password123" };
      authService.loginWithUserAndPassword.mockRejectedValue(mockError);

      await loginUser(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "SERVER_ERROR", "Internal Server Error", null, 500);
    });
  });
});
