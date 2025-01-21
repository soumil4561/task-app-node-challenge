const {User} = require("../models")

const addUser = async (userBody) =>{
    const user = await User.create(userBody);
    return user;
}

module.exports = {
    addUser,
};