const {Strategy, ExtractJwt} = require('passport-jwt');
const {User} = require("../models")
const tokenTypes = require('./token')

const jwtOptions = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload, done) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
};

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
}