const { userService, tokenService, authService } = require("../services");
const { sendSuccess, sendError } = require("../utils/response");

const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    const authTokens = await tokenService.generateAuthTokens(user._id);
    return sendSuccess(res, authTokens, "User registered successfully!", 201); // Changed status code to 201 for resource creation
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return sendError(
        res,
        "DUPLICATE_USER",
        "Username already exists.",
        err.message,
        400
      );
    }
    return sendError(res, "SERVER_ERROR", "Internal Server Error", null, 500);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await authService.loginWithUserAndPassword(req.body.username, req.body.password);
    const authTokens = await tokenService.generateAuthTokens(user._id);
    return sendSuccess(res, authTokens, "Login successful!", 200);
  } catch (err) {
    console.error(err);
    if (err.code === 400) {
      return sendError(res, "INVALID_CREDENTIALS", "Incorrect username or password. Please try again.", err.message, 400);
    }
    return sendError(res, "SERVER_ERROR", "Internal Server Error", null, 500);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
