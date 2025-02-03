const Joi = require("joi");
const validate = require('../middlewares/validation');
const { sendError } = require("../utils/response");
const pick = require("../utils/pick");

jest.mock("../utils/response", () => ({
  sendError: jest.fn(),
}));

jest.mock("../utils/pick", () => jest.fn((obj, keys) =>
  keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {})
));

describe("Validate Middleware", () => {
  let mockReq, mockRes, mockNext, schema;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it("should call next if validation passes", () => {
    schema = {
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
      }),
    };

    mockReq.body = { username: "testuser", password: "password123" };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(sendError).not.toHaveBeenCalled();
  });

  it("should return a validation error if the request body is invalid", () => {
    schema = {
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
      }),
    };

    mockReq.body = { username: "testuser", password: "123" };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      "VALIDATION_ERROR",
      "Request validation failed.",
      expect.any(String),
      400
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return a validation error if a required field is missing", () => {
    schema = {
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
      }),
    };

    mockReq.body = { password: "password123" }; 

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      "VALIDATION_ERROR",
      "Request validation failed.",
      expect.stringContaining('"username" is required'),
      400
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should validate query parameters", () => {
    schema = {
      query: Joi.object({
        page: Joi.number().integer().min(1).required(),
        limit: Joi.number().integer().min(1).required(),
      }),
    };

    mockReq.query = { page: "2", limit: "10" };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(sendError).not.toHaveBeenCalled();
  });

  it("should return a validation error for invalid query parameters", () => {
    schema = {
      query: Joi.object({
        page: Joi.number().integer().min(1).required(),
        limit: Joi.number().integer().min(1).required(),
      }),
    };

    mockReq.query = { page: "-1", limit: "10" }; 

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      "VALIDATION_ERROR",
      "Request validation failed.",
      expect.stringContaining('"page" must be greater than or equal to 1'),
      400
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should validate params", () => {
    schema = {
      params: Joi.object({
        id: Joi.string().alphanum().length(24).required(),
      }),
    };

    mockReq.params = { id: "507f1f77bcf86cd799439011" };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(sendError).not.toHaveBeenCalled();
  });

  it("should return a validation error for invalid params", () => {
    schema = {
      params: Joi.object({
        id: Joi.string().alphanum().length(24).required(),
      }),
    };

    mockReq.params = { id: "invalid-id" };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      "VALIDATION_ERROR",
      "Request validation failed.",
      expect.stringContaining('"id" must only contain alpha-numeric characters'),
      400
    );
    expect(mockNext).not.toHaveBeenCalled();
  });
});
