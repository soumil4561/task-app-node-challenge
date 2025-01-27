const passport = require('passport');
const { sendError } = require('../utils/response');

const auth = (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) {
      console.error(err);
      return sendError(res, "AUTH_ERROR", "An error occurred during authentication.", err.message, 500);
    }

    if (!user) {
      return sendError(res, "UNAUTHORIZED", "User not authenticated.", info?.message || "Authentication failed.", 401);
    }

    req.user = user; 
    next();
  })(req, res, next);
};

module.exports = auth;
