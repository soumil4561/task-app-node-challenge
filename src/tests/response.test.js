const { sendSuccess, sendError } = require("../utils/response");

describe("Response Utility Functions", () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe("sendSuccess", () => {
    it("should send a success response with default values", async () => {
      await sendSuccess(mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: "success",
        message: "Request processed successfully.",
        data: null,
        error: null
      });
    });

    it("should send a success response with custom data and message", async () => {
      await sendSuccess(mockResponse, { user: "JohnDoe" }, "User fetched successfully", 201);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: "success",
        message: "User fetched successfully",
        data: { user: "JohnDoe" },
        error: null
      });
    });
  });

  describe("sendError", () => {
    it("should send an error response with default values", async () => {
      await sendError(mockResponse, "ERROR_CODE");
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: "error",
        message: "An error occurred.",
        data: null,
        error: {
          code: "ERROR_CODE",
          details: null
        }
      });
    });

    it("should send an error response with custom message and details", async () => {
      await sendError(mockResponse, "USER_NOT_FOUND", "User not found in the database.", "No user with ID 123", 404);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: "error",
        message: "User not found in the database.",
        data: null,
        error: {
          code: "USER_NOT_FOUND",
          details: "No user with ID 123"
        }
      });
    });
  });
});
