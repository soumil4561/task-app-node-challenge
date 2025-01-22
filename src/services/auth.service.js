const {User} = require("../models");
const ApiError = require('../utils/ApiError');

const loginWithUserAndPassword = async (username,password) => {
    const user = await User.findOne({username: username});
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(400, "Incorrect Credentials")
    }
    return user;
}

module.exports = {
    loginWithUserAndPassword,
}