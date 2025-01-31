const { User } = require("../models");
const ApiError = require('../utils/ApiError');

const loginWithUserAndPassword = async (username, password) => {
    const user = await User.findOne({ username: username });
    
    if (!user) {
        throw new ApiError(400, "Incorrect Credentials");
    }

    const isMatch = await user.isPasswordMatch(password);
    
    if (!isMatch) {
        throw new ApiError(400, "Incorrect Credentials");
    }

    return user;
}

module.exports = {
    loginWithUserAndPassword,
};
