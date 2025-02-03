const passport = require("passport");
const auth = require("../middlewares/auth");
const { sendError } = require("../utils/response");

jest.mock("../utils/response", () => ({
  sendError: jest.fn(),
}));

describe("Auth Middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it("should call next if authentication is successful", () => {
    const mockUser = { id: "12345", username: "testuser" };

    passport.authenticate = jest.fn((strategy, callback) => (req, res, next) =>
      callback(null, mockUser, null)
    );

    auth(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
    expect(sendError).not.toHaveBeenCalled();
  });

  it("should return an error if authentication fails", () => {
    passport.authenticate = jest.fn((strategy, callback) => (req, res, next) =>
      callback(null, false, { message: "Invalid token" })
    );

    auth(mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      "UNAUTHORIZED",
      "User not authenticated.",
      "Invalid token",
      401
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return an error if passport encounters an internal error", () => {
    const mockError = new Error("Something went wrong");

    passport.authenticate = jest.fn((strategy, callback) => (req, res, next) =>
      callback(mockError, null, null)
    );

    auth(mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      "AUTH_ERROR",
      "An error occurred during authentication.",
      "Something went wrong",
      500
    );
    expect(mockNext).not.toHaveBeenCalled();
  });
});
