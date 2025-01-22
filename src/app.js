const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/api");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport.config");

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(express.json());

app.use(cors());

app.use("/api",routes);

module.exports = app;