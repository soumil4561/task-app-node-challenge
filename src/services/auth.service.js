const {User} = require("../models");

const loginWithUserAndPassword = async (username,password) => {
    const user = await User.findOne({username: username});
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new Error("Incorrect Credentials");
    }
    return user;
}

module.exports = {
    loginWithUserAndPassword,
}