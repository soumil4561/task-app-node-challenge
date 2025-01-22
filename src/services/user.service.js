const {User} = require("../models")

const createUser = async (userBody) =>{
    const user = await User.create(userBody);
    return user;
}

module.exports = {
    createUser,
};