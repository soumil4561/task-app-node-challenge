const {userService, tokenService, authService} = require("../services")

const registerUser = async (req,res) => {
    const user = await userService.createUser(req.body);
    const authTokens = await tokenService.generateAuthTokens(user._id);
    res.send({user, authTokens});
}

const loginUser = async (req, res) => {
    const user = await authService.loginWithUserAndPassword(req.body.username, req.body.password);
    const authTokens = await tokenService.generateAuthTokens(user._id);
    res.send(authTokens);
}

module.exports ={
    registerUser,
    loginUser,
}