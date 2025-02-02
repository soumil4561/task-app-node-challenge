const moment = require('moment');
const jwt = require('jsonwebtoken');
const tokenTypes = require('../config/token')

const generateToken = (userId, expires, type, secret=process.env.JWT_SECRET) => {
    const payload ={
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
}

const generateAuthTokens = async (userId) => {
    const accessTokenExpiry = moment().add(process.env.JWT_EXPIRATION_TIME,'minutes');
    const accessToken = generateToken(userId, accessTokenExpiry, tokenTypes.ACCESS);

    return {
        access :{
            token: accessToken,
            expires: accessTokenExpiry.toDate()
        }
    };
};

module.exports = {
    generateAuthTokens,
    generateToken
}