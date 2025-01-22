const {userService, tokenService, authService} = require("../services")

const registerUser = async (req,res) => {
    try{
        const user = await userService.createUser(req.body);
        const authTokens = await tokenService.generateAuthTokens(user._id);
        res.send({user, authTokens});
    }
    catch(err){
        console.log(err);
        if(err.code===11000){
            return res.status(400).send('User already exists! Try another username');
        }
        else return res.status(500).send("Internal Server Error");
    }
}

const loginUser = async (req, res) => {
    try{
        const user = await authService.loginWithUserAndPassword(req.body.username, req.body.password);
        const authTokens = await tokenService.generateAuthTokens(user._id);
        res.send(authTokens);
    }
    catch(err){
        console.error(err);
        if(err.statusCode===400){
            return res.status(400).send("Incorrect username or password. Please try again.")
        }
        return res.status(500).send("Internal Server Error");
    }
}

module.exports ={
    registerUser,
    loginUser,
}