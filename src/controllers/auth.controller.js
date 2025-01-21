const {userService} = require("../services")

const registerUser = async (req,res) => {
    const user = await userService.addUser(req.body);
    res.send("Added User Successfully");
}

module.exports ={
    registerUser,
}